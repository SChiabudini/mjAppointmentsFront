import { createSlice } from "@reduxjs/toolkit";

export const companyClientSlice = createSlice({
    name: "companyClient",
    initialState: {
        companyClients: [],
        companyClientsCopy: [],
        companyClientsAll: [],
        companyClientAllCopy: [],
        companyClientDetail: {}
    },
    reducers: {
        getCompanyClientsReducer: (state, action) => {
            state.companyClients = action.payload;
            state.companyClientsCopy = action.payload;
        },

        getCompanyClientsAllReducer: (state, action) => {
            state.companyClientsAll = action.payload;
            state.companyClientsAllCopy = action.payload;
        },

        getCompanyClientByIdReducer: (state, action) => {
            state.companyClientDetail = action.payload;
        },

        searchCompanyClientsReducer: (state, action) => {
            state.companyClients = action.payload;
        },

        searchCompanyClientsAllReducer: (state, action) => {
            state.companyClientsAll = action.payload;
        },

        clearCompanyClientDetailReducer: (state) => {
            state.companyClientDetail = {};
        },

        clearCompanyClientsReducer: (state) => {
            state.companyClients = state.companyClientsCopy;
            state.companyClientsAll = state.companyClientsAllCopy;
        }
    }
});

export const { getCompanyClientsReducer, getCompanyClientsAllReducer, getCompanyClientByIdReducer, searchCompanyClientsReducer, searchCompanyClientsAllReducer, clearCompanyClientDetailReducer, clearCompanyClientsReducer} = companyClientSlice.actions;

export default companyClientSlice.reducer;