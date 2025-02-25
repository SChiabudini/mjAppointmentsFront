import api from '../services/axios.js';
import { getPersonClientsReducer, getPersonClientsAllReducer, getPersonClientByIdReducer, searchPersonClientsReducer, searchPersonClientsAllReducer } from './personClientSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getPersonClients = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/personClient");

            const reversedData = data.reverse();

            dispatch(getPersonClientsReducer(reversedData));

        } catch (error) {
            
            console.error("Error retrieving clients from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE TODOS

export const getAllPersonClients = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/personClient/all");

            const reversedData = data.reverse();

            dispatch(getPersonClientsAllReducer(reversedData));

        } catch (error) {
            
            console.error("Error retrieving clients from server: " + error.message);
            throw new Error('Network error or server not reachable');
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
            throw new Error('Network error or server not reachable');
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

            const reversedData = data.reverse();

            dispatch(searchPersonClientsReducer(reversedData));

        } catch (error) {
            console.error("Clients search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
}

//-----TRAE TODOS FILTRADOS
export const searchAllPersonClients = (dni, name, vehicle) => {

    return async (dispatch) => {

        try {
            
            let query = '/personClient/all?';
            
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

            const reversedData = data.reverse();

            dispatch(searchPersonClientsAllReducer(reversedData));

        } catch (error) {
            console.error("Clients search error:", error.message);
            throw new Error('Network error or server not reachable');
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

export const putPersonClient = (personClientData) => {    
    return async () => {   
        try {
            const response = await api.put('/personClient', personClientData);
            return response;

        } catch (error) {
            console.error("Error editing a person client: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};

export const putPersonClientStatus = (personClienttId) => {    
    return async () => {   
        try {
            const response = await api.put(`/personClient/status/${personClienttId}`);

            return response;

        } catch (error) {
            console.error("Error editing client status: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};