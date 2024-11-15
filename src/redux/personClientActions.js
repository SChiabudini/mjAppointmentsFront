import api from '../services/axios.js';
import { getPersonClientsReducer } from './personClientSlice.js';

export const getPersonClients = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/personClient");

            const reversedData = data.reverse();

            dispatch(getPersonClientsReducer(reversedData));

        } catch (error) {
            
            console.error("Error retrieving clients from server: " + error.message);
            return null;
        }
    }

};

export const postPersonClient = (clientData) => {
    return async () => {
        try {
            const response = await api.post("/personClient", clientData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Error creating client');
            }
            throw new Error('Network error or server not reachable');
        }
    };
};