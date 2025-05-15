import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { ADMIN_API_END_POINT } from "../utils/constants";

// Async thunks
export const fetchPendingRecruiters = createAsyncThunk(
  "admin/fetchPendingRecruiters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ADMIN_API_END_POINT}/pending-recruiters`);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch pending recruiters");
      }
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pending recruiters");
    }
  }
);

export const verifyRecruiter = createAsyncThunk(
  "admin/verifyRecruiter",
  async (recruiterId, { rejectWithValue }) => {
    try {
      const response = await api.post(`${ADMIN_API_END_POINT}/verify-recruiter/${recruiterId}`);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to verify recruiter");
      }
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to verify recruiter");
    }
  }
);

const initialState = {
  pendingRecruiters: [],
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
  },
  extraReducers: (builder) => {
    builder
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
      // Verify recruiter
      .addCase(verifyRecruiter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRecruiter.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRecruiters = state.pendingRecruiters.filter(
          (recruiter) => recruiter._id !== action.payload._id
        );
      })
      .addCase(verifyRecruiter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer; 