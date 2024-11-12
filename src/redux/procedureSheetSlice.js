import { createSlice } from "@reduxjs/toolkit";

export const procedureSheetSlice = createSlice({
    name: "procedureSheet",
    initialState: {
        procedureSheets: [],
        procedureSheetsCopy: [],

    },
    reducers: {
        getProcedureSheetsReducer: (state, action) => {
            state.procedureSheets = action.payload;
            state.procedureSheetsCopy = action.payload;
        },
    }
});

export const { getProcedureSheetsReducer } = procedureSheetSlice.actions;

export default procedureSheetSlice.reducer;