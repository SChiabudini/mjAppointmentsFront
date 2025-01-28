import api from '../services/axios.js';
import { getCompanyClientsReducer, getCompanyClientsAllReducer, getCompanyClientByIdReducer, searchCompanyClientsReducer, searchCompanyClientsAllReducer } from './companyClientSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS
export const getCompanyClients = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/companyClient");

            const reversedData = data.reverse();

            dispatch(getCompanyClientsReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving clients from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE TODOS
export const getAllCompanyClients = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/companyClient/all");

            const reversedData = data.reverse();

            dispatch(getCompanyClientsAllReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving clients from server: " + error.message);
            throw new Error('Network error or server not reachable');
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
            throw new Error('Network error or server not reachable');
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

            const reversedData = data.reverse();

            dispatch(searchCompanyClientsReducer(reversedData));

        } catch (error) {
            console.error("Clients search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
}

//-----TRAE TODOS FILTRADOS
export const searchAllCompanyClients = (cuit, name, vehicle) => {

    return async (dispatch) => {

        try {
            
            let query = '/companyClient/all?';
            
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

            const reversedData = data.reverse();

            dispatch(searchCompanyClientsAllReducer(reversedData));

        } catch (error) {
            console.error("Clients search error:", error.message);
            throw new Error('Network error or server not reachable');
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

export const putCompanyClient = (companyClientData) => {    
    return async () => {   
        try {
            const response = await api.put('/companyClient', companyClientData);
            return response;

        } catch (error) {
            console.error("Error editing a company client: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};

export const putCompanyClientStatus = (companyClienttId) => {    
    return async () => {   
        try {
            const response = await api.put(`/companyClient/status/${companyClienttId}`);

            return response;

        } catch (error) {
            console.error("Error editing client status: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};