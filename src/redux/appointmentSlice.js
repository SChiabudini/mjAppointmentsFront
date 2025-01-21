import { createSlice } from "@reduxjs/toolkit";

export const appointmentSlice = createSlice({
    name: "appointments",
    initialState: {
        appointments: [],
        appointmentsCopy: [],
        appointmentDetail: {},
    },
    reducers: {
        getAppointmentsReducer: (state, action) => {
            state.appointments = action.payload;
            state.appointmentsCopy = action.payload;
        },

        getAppointmentByIdReducer: (state, action) => {
            state.appointmentDetail = action.payload;
        },

        postAppointmentReducer: (state, action) => {
            state.appointments.push(action.payload);
            state.appointmentsCopy.push(action.payload);
        },

        clearAppointmentDetailReducer: (state) => {
            state.appointmentDetail = {};
        },

        clearAppointmentsReducer: (state) => {
            state.appointments = state.appointmentsCopy;
        }
    }
});

export const { getAppointmentsReducer, getAppointmentByIdReducer, postAppointmentReducer, clearAppointmentDetailReducer,  clearAppointmentsReducer} = appointmentSlice.actions;

export default appointmentSlice.reducer;