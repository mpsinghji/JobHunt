import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        job: null,
        loading: false,
        error: null
    },
    reducers: {
        setJobWithApplications: (state, action) => {
            state.job = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state) => {
            state.loading = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateApplicationStatus: (state, action) => {
            const { applicationId, status } = action.payload;
            const application = state.job.application.find(app => app._id === applicationId);
            if (application) {
                application.status = status;
            }
        }
    }
});

export const { 
    setJobWithApplications, 
    setLoading, 
    setError,
    updateApplicationStatus 
} = applicationSlice.actions;

export default applicationSlice.reducer;