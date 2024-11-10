import { createSlice } from "@reduxjs/toolkit";

export const procedureSheetSlice = createSlice({
    name: "procedureSheet",
    initialState: {
        procedureSheet: [],
        procedureSheetCopy: [],

    },
    reducers: {
        getProcedureSheetReducer: (state, action) => {
            state.procedureSheet = action.payload;
            state.procedureSheetCopy = action.payload;
        },
    }
});

export const { getProcedureSheetReducer } = procedureSheetSlice.actions;

export default procedureSheetSlice.reducer;