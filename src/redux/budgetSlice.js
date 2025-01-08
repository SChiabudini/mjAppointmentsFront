import { createSlice } from "@reduxjs/toolkit";

export const budgetSlice = createSlice({
    name: "budget",
    initialState: {
        budgets: [],
        budgetsCopy: [],
        budgetDetail: {}
    },
    reducers: {
        getBudgetsReducer: (state, action) => {
            state.budgets = action.payload;
            state.budgetsCopy = action.payload;
        },

        getBudgetByIdReducer: (state, action) => {   
            state.budgetDetail = action.payload;
        },

        searchBudgetsReducer: (state, action) => {
            state.budgets = action.payload;
        },

        clearBudgetDetailReducer: (state) => {
            state.budgetDetail = {};
        },

        clearBudgetsReducer: (state) => {
            state.budgets = state.budgetsCopy;
        }
    }
});

export const { getBudgetsReducer, getBudgetByIdReducer, searchBudgetsReducer, clearBudgetDetailReducer, clearBudgetsReducer } = budgetSlice.actions;

export default budgetSlice.reducer;