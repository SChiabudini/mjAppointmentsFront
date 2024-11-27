import api from '../services/axios.js';
import { getPersonClientsReducer, getPersonClientByIdReducer, searchPersonClientsReducer } from './personClientSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

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

//-----TRAE POR ID TANTO ACTIVOS COMO INACTIVOS

export const getPersonClientById = (personClientId) => {

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/personClient/${personClientId}`);

            dispatch(getPersonClientByIdReducer(data));
        } catch (error) {
            console.error("Error retrieving client by server id: ", error.message);
            return null;
        }
    }

}

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchPersonClients = (dni, name, vehicle) => {

    return async (dispatch) => {

        try {
            
            let query = '/personClient?';
            
            if(dni){
                query += `dni=${dni}&`
            }

            if(name){
                query += `name=${name}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            const { data } = await api.get(query);

            dispatch(searchPersonClientsReducer(data));

            console.log(data);

        } catch (error) {
            console.error("Clients search error:", error.message);
            return null;
        }
    }
}

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