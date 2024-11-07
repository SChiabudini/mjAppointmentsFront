import { createSlice } from "@reduxjs/toolkit";

export const companyClientSlice = createSlice({
    name: "companyClient",
    initialState: {
        companyClient: [],
        companyClientCopy: [],

    },
    reducers: {
        getCompanyClientReducer: (state, action) => {
            state.companyClient = action.payload;
            state.companyClientCopy = action.payload;
        },
    }
});

export const { getCompanyClientReducer } = companyClientSlice.actions;

export default companyClientSlice.reducer;