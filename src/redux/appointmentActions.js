import api from '../services/axios.js';
import { getAppointmentsReducer, getAppointmentsAllReducer, getAppointmentByIdReducer, postAppointmentReducer } from './appointmentSlice.js';

export const getAppointments = () => {

    return async (dispatch) => {
        try {
            const { data } = await api.get("/appointment");
            
            dispatch(getAppointmentsReducer(data));

        } catch (error) {
            console.error("Error retrieving appointments from server: " + error.message);
            throw new Error('Network error or server not reachable');
        };
    };
};

export const getAllAppointments = () => {

    return async (dispatch) => {
        try {
            const { data } = await api.get("/appointment/all");
            
            dispatch(getAppointmentsAllReducer(data));

        } catch (error) {
            console.error("Error retrieving appointments from server: " + error.message);
            throw new Error('Network error or server not reachable');
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
            throw new Error('Network error or server not reachable');
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
            throw new Error('Network error or server not reachable');
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
            throw new Error('Network error or server not reachable');
        }
    }
};

export const putAppointmentStatus = (appointmentId) => {    
    return async () => {   
        try {
            const response = await api.put(`/appointment/status/${appointmentId}`);

            return response;

        } catch (error) {
            console.error("Error editing appointment status: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};


export const deleteExpiredAppointments = () => {
    return async () => {
        try {
            const response = await api.delete('/appointment');
            return response;
            
        } catch (error) {
            console.error("Error when deleting expired shifts: ", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
};