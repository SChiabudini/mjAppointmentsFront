import { createSlice } from "@reduxjs/toolkit";

export const serviceSheetSlice = createSlice({
    name: "serviceSheet",
    initialState: {
        serviceSheets: [],
        serviceSheetsCopy: [],
        serviceSheetsAll: [],
        serviceSheetsAllCopy: [], 
        serviceSheetDetail: {}
    },
    reducers: {
        getServiceSheetsReducer: (state, action) => {
            state.serviceSheets = action.payload;
            state.serviceSheetsCopy = action.payload;
        },

        getServiceSheetsAllReducer: (state, action) => {
            state.serviceSheetsAll = action.payload;
            state.serviceSheetsAllCopy = action.payload;
        },

        getServiceSheetByIdReducer: (state, action) => {   
            state.serviceSheetDetail = action.payload;
        },

        searchServiceSheetsReducer: (state, action) => {
            state.serviceSheets = action.payload;
        },

        searchServiceSheetsAllReducer: (state, action) => {
            state.serviceSheetsAll = action.payload;
        },

        clearServiceSheetDetailReducer: (state) => {
            state.serviceSheetDetail = {};
        },

        clearServiceSheetsReducer: (state) => {
            state.serviceSheets = state.serviceSheetsCopy;
            state.serviceSheetsAll = state.serviceSheetsAllCopy;
        }
    }
});

export const { getServiceSheetsReducer, getServiceSheetsAllReducer, getServiceSheetByIdReducer, searchServiceSheetsReducer, searchServiceSheetsAllReducer, clearServiceSheetDetailReducer, clearServiceSheetsReducer } = serviceSheetSlice.actions;

export default serviceSheetSlice.reducer;