import { createSlice } from "@reduxjs/toolkit";

export const personClientSlice = createSlice({
    name: "personClient",
    initialState: {
        personClient: [],
        personClientCopy: [],

    },
    reducers: {
        getPersonClientReducer: (state, action) => {
            state.personClient = action.payload;
            state.personClientCopy = action.payload;
        },
    }
});

export const { getPersonClientReducer } = personClientSlice.actions;

export default personClientSlice.reducer;