import { createSlice } from "@reduxjs/toolkit";

export const serviceSheetSlice = createSlice({
    name: "serviceSheet",
    initialState: {
        serviceSheet: [],
        serviceSheetCopy: [],

    },
    reducers: {
        getServiceSheetReducer: (state, action) => {
            state.serviceSheet = action.payload;
            state.serviceSheetCopy = action.payload;
        },
    }
});

export const { getServiceSheetReducer } = serviceSheetSlice.actions;

export default serviceSheetSlice.reducer;