import { createSlice } from "@reduxjs/toolkit";

export const companyClientSlice = createSlice({
    name: "companyClient",
    initialState: {
        companyClients: [],
        companyClientsCopy: [],
        companyClientDetail: {}
    },
    reducers: {
        getCompanyClientsReducer: (state, action) => {
            state.companyClients = action.payload;
            state.companyClientsCopy = action.payload;
        },

        getCompanyClientByIdReducer: (state, action) => {
            state.companyClientDetail = action.payload;
        },

        searchCompanyClientsReducer: (state, action) => {
            state.companyClients = action.payload;
        },

        clearCompanyClientDetailReducer: (state) => {
            state.companyClientDetail = {};
        },

        clearCompanyClientsReducer: (state) => {
            state.companyClients = state.companyClientsCopy;
        }
    }
});

export const { getCompanyClientsReducer, getCompanyClientByIdReducer, searchCompanyClientsReducer, clearCompanyClientDetailReducer, clearCompanyClientsReducer} = companyClientSlice.actions;

export default companyClientSlice.reducer;