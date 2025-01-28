import { createSlice } from "@reduxjs/toolkit";

export const mechanicalSheetSlice = createSlice({
    name: "mechanicalSheet",
    initialState: {
        mechanicalSheets: [],
        mechanicalSheetsCopy: [],
        mechanicalSheetsAll: [],
        mechanicalSheetsAllCopy: [],
        mechanicalSheetDetail: {}
    },
    reducers: {
        getMechanicalSheetsReducer: (state, action) => {
            state.mechanicalSheets = action.payload;
            state.mechanicalSheetsCopy = action.payload;
        },

        getMechanicalSheetsAllReducer: (state, action) => {
            state.mechanicalSheetsAll = action.payload;
            state.mechanicalSheetsAllCopy = action.payload;
        },
        
        getMechanicalSheetByIdReducer: (state, action) => {
            state.mechanicalSheetDetail = action.payload;
        },

        searchMechanicalSheetsReducer: (state, action) => {
            state.mechanicalSheets = action.payload;
        },

        searchMechanicalSheetsAllReducer: (state, action) => {
            state.mechanicalSheetsAll = action.payload;
        },

        clearMechanicalSheetDetailReducer: (state) => {
            state.mechanicalSheetDetail = {};
        },

        clearMechanicalSheetsReducer: (state) => {
            state.mechanicalSheets = state.mechanicalSheetsCopy;
            state.mechanicalSheetsAll = state.mechanicalSheetsAllCopy;
        }
    }
});

export const { getMechanicalSheetsReducer, getMechanicalSheetsAllReducer, getMechanicalSheetByIdReducer, searchMechanicalSheetsReducer, searchMechanicalSheetsAllReducer, clearMechanicalSheetDetailReducer, clearMechanicalSheetsReducer } = mechanicalSheetSlice.actions;

export default mechanicalSheetSlice.reducer;