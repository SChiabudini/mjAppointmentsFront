import api from '../services/axios.js';
import { getCompanyClientsReducer } from './companyClientSlice.js';

export const getCompanyClients = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/companyClient");

            const reversedData = data.reverse();

            dispatch(getCompanyClientsReducer(reversedData));

        } catch (error) {
            
            console.error("Error retrieving clients from server: " + error.message);
            return null;
        }
    }

};

export const postCompanyClient = (clientData) => {
    return async () => {
        try {
            const response = await api.post("/companyClient", clientData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Error creating client');
            }
            throw new Error('Network error or server not reachable');
        }
    };
};