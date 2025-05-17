import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { toast } from "sonner";

// Async thunks
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching users from both endpoints...");
      const [usersResponse, adminsResponse] = await Promise.all([
        api.get("/api/v1/user/all"),
        api.get("/api/v1/admin/users")
      ]);
      
      console.log("Users Response:", usersResponse.data);
      console.log("Admins Response:", adminsResponse.data);
      
      if (!usersResponse.data.success || !adminsResponse.data.success) {
        console.error("Failed responses:", { users: usersResponse.data, admins: adminsResponse.data });
        return rejectWithValue("Failed to fetch users");
      }

      // Combine and categorize users
      const allUsers = {
        recruiters: usersResponse.data.users.filter(user => {
          console.log("Checking recruiter:", user);
          return user.role === "Recruiter";
        }),
        jobseekers: usersResponse.data.users.filter(user => {
          console.log("Checking jobseeker:", user);
          return user.role === "Jobseeker";
        }),
        admins: adminsResponse.data.data.admins || []
      };

      console.log("Categorized users:", allUsers);
      return allUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMsg = error.response?.data?.message || "Failed to fetch users";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchPendingRecruiters = createAsyncThunk(
  "admin/fetchPendingRecruiters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/admin/pending-recruiters");
      
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch pending recruiters");
      }
      return response.data.data || [];
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch pending recruiters";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const verifyUser = createAsyncThunk(
  "admin/verifyUser",
  async ({ userId, role }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentUser = state.auth.user;

      // Prevent self-verification
      if (currentUser._id === userId) {
        toast.error("You cannot verify yourself");
        return rejectWithValue("Cannot verify yourself");
      }

      const endpoint = role === "Recruiter" 
        ? `/api/v1/admin/verify-recruiter/${userId}`
        : `/api/v1/admin/verify-admin/${userId}`;
      
      const response = await api.post(endpoint);
      
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to verify user");
      }
      toast.success(`${role} verified successfully`);
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to verify user";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const banUser = createAsyncThunk(
  "admin/banUser",
  async ({ userId, role }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentUser = state.auth.user;

      // Prevent self-ban
      if (currentUser._id === userId) {
        toast.error("You cannot ban yourself");
        return rejectWithValue("Cannot ban yourself");
      }

      const endpoint = role === "Recruiter" 
        ? `/api/v1/admin/ban-recruiter/${userId}`
        : `/api/v1/admin/ban-admin/${userId}`;
      
      const response = await api.post(endpoint);
      
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to ban user");
      }
      toast.success(`${role} ${response.data.data.isBanned ? 'banned' : 'unbanned'} successfully`);
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to ban user";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const initialState = {
  pendingRecruiters: [],
  allUsers: {
    recruiters: [],
    jobseekers: [],
    admins: []
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.allUsers = {
          recruiters: [],
          jobseekers: [],
          admins: []
        };
      })
      // Fetch pending recruiters
      .addCase(fetchPendingRecruiters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRecruiters.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRecruiters = action.payload || [];
      })
      .addCase(fetchPendingRecruiters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.pendingRecruiters = [];
      })
      // Verify user
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const userList = action.payload.role === "Recruiter" 
            ? state.allUsers.recruiters 
            : state.allUsers.admins;
          
          const updatedUsers = userList.map(user =>
            user._id === action.payload._id ? action.payload : user
          );
          
          if (action.payload.role === "Recruiter") {
            state.allUsers.recruiters = updatedUsers;
          } else {
            state.allUsers.admins = updatedUsers;
          }
        }
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Ban user
      .addCase(banUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const userList = action.payload.role === "Recruiter" 
            ? state.allUsers.recruiters 
            : state.allUsers.admins;
          
          const updatedUsers = userList.map(user =>
            user._id === action.payload._id ? action.payload : user
          );
          
          if (action.payload.role === "Recruiter") {
            state.allUsers.recruiters = updatedUsers;
          } else {
            state.allUsers.admins = updatedUsers;
          }
        }
      })
      .addCase(banUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAdminData } = adminSlice.actions;
export default adminSlice.reducer; 