import api from '../services/axios.js';
import { getServiceSheetsReducer, getServiceSheetsAllReducer, getServiceSheetByIdReducer, searchServiceSheetsReducer, searchServiceSheetsAllReducer } from './serviceSheetSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getServiceSheets = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/serviceSheet");

            const reversedData = data.reverse();

            dispatch(getServiceSheetsReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving service sheets from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE TODOS

export const getAllServiceSheets = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/serviceSheet/all");

            const reversedData = data.reverse();

            dispatch(getServiceSheetsAllReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving service sheets from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE POR ID TANTO ACTIVOS COMO INACTIVOS

export const getServiceSheetById = (serviceSheetId) => {    

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/serviceSheet/${serviceSheetId}`);
            
            dispatch(getServiceSheetByIdReducer(data));
            
        } catch (error) {
            console.error("Error retrieving service sheet by server id: ", error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchServiceSheets = (number, vehicle, client) => {

    return async (dispatch) => {

        try {
            
            let query = '/serviceSheet?';
            
            if(number){
                query += `number=${number}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            if(client){
                query += `client=${client}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchServiceSheetsReducer(reversedData));

        } catch (error) {
            console.error("Service sheets search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
}

//-----TRAE TODOS FILTRADOS

export const searchAllServiceSheets = (number, vehicle, client) => {

    return async (dispatch) => {

        try {
            
            let query = '/serviceSheet/all?';
            
            if(number){
                query += `number=${number}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            if(client){
                query += `client=${client}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchServiceSheetsAllReducer(reversedData));

        } catch (error) {
            console.error("Service sheets search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
}

export const postServiceSheet = (serviceSheetData) => {
    return async () => {
        try {
            const response = await api.post("/serviceSheet", serviceSheetData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Error creating service sheet');
            }
            throw new Error('Network error or server not reachable');
        }
    };
};

export const putServiceSheet = (serviceSheetData) => {
    return async () => {
        try {
            const response = await api.put('/serviceSheet', serviceSheetData);
            return response;
        } catch (error) {
            console.error("Error editing a service sheet: ", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
};

export const putServiceSheetStatus = (serviceSheetId) => {    
    return async () => {   
        try {
            const response = await api.put(`/serviceSheet/status/${serviceSheetId}`);

            return response;

        } catch (error) {
            console.error("Error editing sheet status: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};