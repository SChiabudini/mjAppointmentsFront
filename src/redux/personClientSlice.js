import { createSlice } from "@reduxjs/toolkit";

export const personClientSlice = createSlice({
    name: "personClient",
    initialState: {
        personClients: [],
        personClientsCopy: [],
        personClientsAll: [],
        personClientsAllCopy: [],
        personClientDetail: {}
    },
    reducers: {
        getPersonClientsReducer: (state, action) => {
            state.personClients = action.payload;
            state.personClientsCopy = action.payload;
        },

        getPersonClientsAllReducer: (state, action) => {
            state.personClientsAll = action.payload;
            state.personClientsAllCopy = action.payload;
        },

        getPersonClientByIdReducer: (state, action) => {
            state.personClientDetail = action.payload;
        },

        searchPersonClientsReducer: (state, action) =>{
            state.personClients = action.payload;
        },

        searchPersonClientsAllReducer: (state, action) =>{
            state.personClientsAll = action.payload;
        },

        clearPersonClientDetailReducer: (state) => {
            state.personClientDetail = {};
        },

        clearPersonClientsReducer: (state) => {
            state.personClients = state.personClientsCopy;
            state.personClientsAll = state.personClientsAllCopy;
        }
    }
});

export const { getPersonClientsReducer, getPersonClientsAllReducer, getPersonClientByIdReducer, searchPersonClientsReducer, searchPersonClientsAllReducer, clearPersonClientDetailReducer, clearPersonClientsReducer} = personClientSlice.actions;

export default personClientSlice.reducer;