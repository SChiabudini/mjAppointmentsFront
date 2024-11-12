import { createSlice } from "@reduxjs/toolkit";

export const companyClientSlice = createSlice({
    name: "companyClient",
    initialState: {
        companyClients: [],
        companyClientsCopy: [],

    },
    reducers: {
        getCompanyClientsReducer: (state, action) => {
            state.companyClients = action.payload;
            state.companyClientsCopy = action.payload;
        },
    }
});

export const { getCompanyClientsReducer } = companyClientSlice.actions;

export default companyClientSlice.reducer;