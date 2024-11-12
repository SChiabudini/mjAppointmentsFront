import { createSlice } from "@reduxjs/toolkit";

export const appointmentSlice = createSlice({
    name: "appointment",
    initialState: {
        appointments: [],
        appointmentsCopy: [],
    },
    reducers: {
        getAppointmentsReducer: (state, action) => {
            state.appointments = action.payload;
            state.appointmentsCopy = action.payload;
        },
    }
});

export const { getAppointmentsReducer } = appointmentSlice.actions;

export default appointmentSlice.reducer;