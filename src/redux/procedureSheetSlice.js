import { createSlice } from "@reduxjs/toolkit";

export const procedureSheetSlice = createSlice({
    name: "procedureSheet",
    initialState: {
        procedureSheets: [],
        procedureSheetsCopy: [],
        procedureSheetDetail: {}
    },
    reducers: {
        getProcedureSheetsReducer: (state, action) => {
            state.procedureSheets = action.payload;
            state.procedureSheetsCopy = action.payload;
        },
        
        getProcedureSheetByIdReducer: (state, action) => {
            state.procedureSheetDetail = action.payload;
        },

        searchProcedureSheetsReducer: (state, action) => {
            state.procedureSheets = action.payload;
        },

        clearProcedureSheetDetailReducer: (state) => {
            state.procedureSheetDetail = {};
        },

        clearProcedureSheetsReducer: (state) => {
            state.procedureSheets = state.procedureSheetsCopy;
        }
    }
});

export const { getProcedureSheetsReducer, getProcedureSheetByIdReducer, searchProcedureSheetsReducer, clearProcedureSheetDetailReducer, clearProcedureSheetsReducer } = procedureSheetSlice.actions;

export default procedureSheetSlice.reducer;