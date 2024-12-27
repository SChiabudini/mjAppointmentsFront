import api from '../services/axios.js';
import { getAppointmentsReducer, getAppointmentByIdReducer, postAppointmentReducer } from './appointmentSlice.js';

export const getAppointments = () => {

    return async (dispatch) => {
        try {
            const { data } = await api.get("/appointment");
            
            dispatch(getAppointmentsReducer(data));

        } catch (error) {
            console.error("Error retrieving appintments from server: " + error.message);
            return null;
        };
    };
};

export const getAppointmentById = (appointmentId) => {

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/vehicle/${appointmentId}`);
            dispatch(getAppointmentByIdReducer(data));
            
        } catch (error) {
            console.error("Error retrieving appointment by server id: ", error.message);
            return null;
        }
    };
};

export const postAppointment = (appointmentData) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post('/appointment', appointmentData);

            dispatch(postAppointmentReducer(data));

            return data;

        } catch (error) {
            console.error("Error creating appointment: ", error.message);
            return null;
        };
    };
};