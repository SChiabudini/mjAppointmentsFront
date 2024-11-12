import { createSlice } from "@reduxjs/toolkit";

export const personClientSlice = createSlice({
    name: "personClient",
    initialState: {
        personClients: [],
        personClientsCopy: [],

    },
    reducers: {
        getPersonClientsReducer: (state, action) => {
            state.personClients = action.payload;
            state.personClientsCopy = action.payload;
        },
    }
});

export const { getPersonClientsReducer } = personClientSlice.actions;

export default personClientSlice.reducer;