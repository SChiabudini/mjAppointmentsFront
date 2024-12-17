import { createSlice } from "@reduxjs/toolkit";

export const mechanicalSheetSlice = createSlice({
    name: "mechanicalSheet",
    initialState: {
        mechanicalSheets: [],
        mechanicalSheetsCopy: [],
        mechanicalSheetDetail: {}
    },
    reducers: {
        getMechanicalSheetsReducer: (state, action) => {
            state.mechanicalSheets = action.payload;
            state.mechanicalSheetsCopy = action.payload;
        },
        
        getMechanicalSheetByIdReducer: (state, action) => {
            state.mechanicalSheetDetail = action.payload;
        },

        searchMechanicalSheetsReducer: (state, action) => {
            state.mechanicalSheets = action.payload;
        },

        clearMechanicalSheetDetailReducer: (state) => {
            state.mechanicalSheetDetail = {};
        },

        clearMechanicalSheetsReducer: (state) => {
            state.mechanicalSheets = state.mechanicalSheetsCopy;
        }
    }
});

export const { getMechanicalSheetsReducer, getMechanicalSheetByIdReducer, searchMechanicalSheetsReducer, clearMechanicalSheetDetailReducer, clearMechanicalSheetsReducer } = mechanicalSheetSlice.actions;

export default mechanicalSheetSlice.reducer;