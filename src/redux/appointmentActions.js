import api from '../services/axios.js';
import { getAppointmentsReducer, getAppointmentByIdReducer, postAppointmentReducer } from './appointmentSlice.js';

export const getAppointments = () => {

    return async (dispatch) => {
        try {
            const { data } = await api.get("/appointment");
            
            dispatch(getAppointmentsReducer(data));

        } catch (error) {
            console.error("Error retrieving appointments from server: " + error.message);
            return null;
        };
    };
};

export const getAppointmentById = (appointmentId) => {

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/appointment/${appointmentId}`);
            
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

export const putAppointment = (appointmentData) => {
    return async () => {
        try {
            const response = await api.put('/appointment', appointmentData);
            return response;
        } catch (error) {
            console.error("Error editing a appointment: ", error.message);
            return null;
        }
    }
};