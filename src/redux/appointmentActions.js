import api from '../services/axios.js';
import { getAppointmentsReducer } from './appointmentSlice.js';

export const getAppointments = () => {

    return async (dispatch) => {
        try {
            const { data } = await api.get("/appointment");
            
            dispatch(getAppointmentsReducer(data));


        } catch (error) {
            console.error("Error retrieving appintments from server: " + error.message);
            return null;
        }
    }

};