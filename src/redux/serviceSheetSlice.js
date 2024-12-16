import { createSlice } from "@reduxjs/toolkit";

export const serviceSheetSlice = createSlice({
    name: "serviceSheet",
    initialState: {
        serviceSheets: [],
        serviceSheetsCopy: [],
        serviceSheetDetail: {}
    },
    reducers: {
        getServiceSheetsReducer: (state, action) => {
            state.serviceSheets = action.payload;
            state.serviceSheetsCopy = action.payload;
        },

        getServiceSheetByIdReducer: (state, action) => {
            state.serviceSheetDetail = action.payload;
        },

        searchServiceSheetsReducer: (state, action) => {
            state.serviceSheets = action.payload;
        },

        clearServiceSheetDetailReducer: (state) => {
            state.serviceSheetDetail = {};
        },

        clearServiceSheetsReducer: (state) => {
            state.serviceSheets = state.serviceSheetsCopy;
        }
    }
});

export const { getServiceSheetsReducer, getServiceSheetByIdReducer, searchServiceSheetsReducer, clearServiceSheetDetailReducer, clearServiceSheetsReducer } = serviceSheetSlice.actions;

export default serviceSheetSlice.reducer;