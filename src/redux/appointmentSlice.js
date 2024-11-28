import { createSlice } from "@reduxjs/toolkit";

export const appointmentSlice = createSlice({
    name: "appointments",
    initialState: {
        appointments: [],
        appointmentsCopy: [],
    },
    reducers: {
        getAppointmentsReducer: (state, action) => {
            state.appointments = action.payload;
            state.appointmentsCopy = action.payload;
        },
        postAppointmentReducer: (state, action) => {
            state.appointments.push(action.payload);
            state.appointmentsCopy.push(action.payload);
        }
    }
});

export const { getAppointmentsReducer, postAppointmentReducer } = appointmentSlice.actions;

export default appointmentSlice.reducer;