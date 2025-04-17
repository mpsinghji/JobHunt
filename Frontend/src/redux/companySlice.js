import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        allCompanies: [],
        searchCompanyByText:"",
    },
    reducers:{
        setSingleCompany:(state,action) => {
            state.singleCompany = action.payload;
        },
        setCompanies:(state,action) => {
            state.companies = action.payload;
        },    
        setAllCompanies:(state,action) => {
            state.allCompanies = action.payload;
        },
        setSearchCompanyByText:(state,action) => {
            state.searchCompanyByText = action.payload;
        }
    }
});

export const { setSingleCompany,setCompanies,setAllCompanies,setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
