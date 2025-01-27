import { createSlice } from "@reduxjs/toolkit";

export const budgetSlice = createSlice({
    name: "budget",
    initialState: {
        budgets: [],
        budgetsCopy: [],
        budgetsAll: [],
        budgetsAllCopy: [],
        budgetDetail: {}
    },
    reducers: {
        getBudgetsReducer: (state, action) => {
            state.budgets = action.payload;
            state.budgetsCopy = action.payload;
        },

        getBudgetsAllReducer: (state, action) => {
            state.budgetsAll = action.payload;
            state.budgetsAllCopy = action.payload;
        },

        getBudgetByIdReducer: (state, action) => {   
            state.budgetDetail = action.payload;
        },

        searchBudgetsReducer: (state, action) => {
            state.budgets = action.payload;
        },

        searchBudgetsAllReducer: (state, action) => {
            state.budgetsAll = action.payload;
        },

        clearBudgetDetailReducer: (state) => {
            state.budgetDetail = {};
        },

        clearBudgetsReducer: (state) => {
            state.budgets = state.budgetsCopy;
            state.budgetsAll = state.budgetsAllCopy;
        }
    }
});

export const { getBudgetsReducer, getBudgetsAllReducer, getBudgetByIdReducer, searchBudgetsReducer, searchBudgetsAllReducer, clearBudgetDetailReducer, clearBudgetsReducer } = budgetSlice.actions;

export default budgetSlice.reducer;