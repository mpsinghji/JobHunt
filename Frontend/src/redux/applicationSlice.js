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

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applications: [],
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
        },
        updateApplicationStatus: (state, action) => {
            const { applicationId, status } = action.payload;
            const application = state.applications.find(app => app._id === applicationId);
            if (application) {
                application.status = status;
            }
        }
    },
    extraReducers: (builder) => {
        builder
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
            });
    }
});

export const { 
    setLoading, 
    setError,
    updateApplicationStatus 
} = applicationSlice.actions;

export default applicationSlice.reducer;