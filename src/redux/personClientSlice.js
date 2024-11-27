import { createSlice } from "@reduxjs/toolkit";

export const personClientSlice = createSlice({
    name: "personClient",
    initialState: {
        personClients: [],
        personClientsCopy: [],
        personClientDetail: {}
    },
    reducers: {
        getPersonClientsReducer: (state, action) => {
            state.personClients = action.payload;
            state.personClientsCopy = action.payload;
        },

        getPersonClientByIdReducer: (state, action) => {
            state.personClientDetail = action.payload;
        },

        searchPersonClientsReducer: (state, action) =>{
            state.personClients = action.payload;
        },

        clearPersonClientDetailReducer: (state) => {
            state.personClientDetail = {};
        },

        clearPersonClientsReducer: (state) => {
            state.personClients = state.personClientsCopy;
        }
    }
});

export const { getPersonClientsReducer, getPersonClientByIdReducer, searchPersonClientsReducer, clearPersonClientDetailReducer, clearPersonClientsReducer} = personClientSlice.actions;

export default personClientSlice.reducer;