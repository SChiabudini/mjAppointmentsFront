import { createSlice } from "@reduxjs/toolkit";

export const appoimentSlice = createSlice({
    name: "appoiment",
    initialState: {
        appoiment: [],
        appoimentCopy: [],

    },
    reducers: {
        getAppoimentReducer: (state, action) => {
            state.appoiment = action.payload;
            state.appoimentCopy = action.payload;
        },
    }
});

export const { getAppoimentReducer } = appoimentSlice.actions;

export default appoimentSlice.reducer;