import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/api';
import { APPLICATION_API_END_POINT } from '../utils/constants';

// Async thunk for fetching applications
export const fetchApplications = createAsyncThunk(
    'application/fetchApplications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${APPLICATION_API_END_POINT}/get`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk for fetching job applicants
export const fetchJobApplicants = createAsyncThunk(
    'application/fetchJobApplicants',
    async (jobId, { rejectWithValue }) => {
        try {
            const response = await api.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`);
            
            if (!response.data.success) {
                return rejectWithValue(response.data.message || "Failed to fetch applicants");
            }

            // Ensure the job object has applications array
            const jobData = response.data.job;
            if (!jobData.applications) {
                jobData.applications = [];
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk for updating application status
export const updateApplicationStatus = createAsyncThunk(
    'application/updateStatus',
    async ({ applicationId, status }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
                { status }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applications: [],
        currentJob: null,
        loading: false,
        error: null
    },
    reducers: {
        setLoading: (state) => {
            state.loading = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchApplications
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.application;
                state.error = null;
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle fetchJobApplicants
            .addCase(fetchJobApplicants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobApplicants.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure the job object has applications array
                const jobData = action.payload.job;
                if (!jobData.applications) {
                    jobData.applications = [];
                }
                state.currentJob = jobData;
                state.error = null;
            })
            .addCase(fetchJobApplicants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle updateApplicationStatus
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                if (state.currentJob?.applications) {
                    const application = state.currentJob.applications.find(
                        app => app._id === action.payload.application._id
                    );
                    if (application) {
                        application.status = action.payload.application.status;
                    }
                }
            });
    }
});

export const { 
    setLoading, 
    setError
} = applicationSlice.actions;

export default applicationSlice.reducer;