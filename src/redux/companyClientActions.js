import api from '../services/axios.js';
import { getCompanyClientsReducer, getCompanyClientByIdReducer, searchCompanyClientsReducer } from './companyClientSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

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

//-----TRAE POR ID TANTO ACTIVOS COMO INACTIVOS

export const getCompanyClientById = (companyClientId) => {

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/companyClient/${companyClientId}`);

            dispatch(getCompanyClientByIdReducer(data));

        } catch (error) {
            console.error("Error retrieving client by server id: ", error.message);
            return null;
        }
    }

}

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchCompanyClients = (cuit, name, vehicle) => {

    return async (dispatch) => {

        try {
            
            let query = '/companyClient?';
            
            if(cuit){
                query += `cuit=${cuit}&`
            }

            if(name){
                query += `name=${name}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            const { data } = await api.get(query);

            dispatch(searchCompanyClientsReducer(data));

            console.log(data);

        } catch (error) {
            console.error("Clients search error:", error.message);
            return null;
        }
    }
}

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