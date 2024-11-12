import { createSlice } from "@reduxjs/toolkit";

export const serviceSheetSlice = createSlice({
    name: "serviceSheet",
    initialState: {
        serviceSheets: [],
        serviceSheetsCopy: [],

    },
    reducers: {
        getServiceSheetsReducer: (state, action) => {
            state.serviceSheets = action.payload;
            state.serviceSheetsCopy = action.payload;
        },
    }
});

export const { getServiceSheetsReducer } = serviceSheetSlice.actions;

export default serviceSheetSlice.reducer;