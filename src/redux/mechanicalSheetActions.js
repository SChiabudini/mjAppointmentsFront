import api from '../services/axios.js';
import { getMechanicalSheetsReducer, getMechanicalSheetsAllReducer, getMechanicalSheetByIdReducer, searchMechanicalSheetsReducer, searchMechanicalSheetsAllReducer } from './mechanicalSheetSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getMechanicalSheets = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/mechanicalSheet");

            const reversedData = data.reverse();

            dispatch(getMechanicalSheetsReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving mechanical sheets from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE TODOS

export const getAllMechanicalSheets = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/mechanicalSheet/all");

            const reversedData = data.reverse();

            dispatch(getMechanicalSheetsAllReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving mechanical sheets from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE POR ID TANTO ACTIVOS COMO INACTIVOS

export const getMechanicalSheetById = (mechanicalSheetId) => {

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/mechanicalSheet/${mechanicalSheetId}`);

            dispatch(getMechanicalSheetByIdReducer(data));
        } catch (error) {
            console.error("Error retrieving mechanical sheet by server id: ", error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchMechanicalSheets = (number, vehicle, client, keyWords) => {

    return async (dispatch) => {

        try {
            
            let query = '/mechanicalSheet?';
            
            if(number){
                query += `number=${number}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            if(client){
                query += `client=${client}&`
            }

            if(keyWords){
                query += `keyWords=${keyWords}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchMechanicalSheetsReducer(reversedData));

        } catch (error) {
            console.error("Mechanical sheets search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
}

//-----TRAE TODOS FILTRADOS

export const searchAllMechanicalSheets = (number, vehicle, client, keyWords) => {

    return async (dispatch) => {

        try {
            
            let query = '/mechanicalSheet/all?';
            
            if(number){
                query += `number=${number}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            if(client){
                query += `client=${client}&`
            }

            if(keyWords){
                query += `keyWords=${keyWords}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchMechanicalSheetsAllReducer(reversedData));

        } catch (error) {
            console.error("Mechanical sheets search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
}

export const postMechanicalSheet = (mechanicalSheetData) => {
    return async () => {
        try {
            const response = await api.post("/mechanicalSheet", mechanicalSheetData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Error creating mechanical sheet');
            }
            throw new Error('Network error or server not reachable');
        }
    };
};

export const putMechanicalSheet = (mechanicalSheetData) => {
    return async () => {
        try {
            const response = await api.put('/mechanicalSheet', mechanicalSheetData);
            return response;
        } catch (error) {
            console.error("Error editing a mechanical sheet: ", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
};

export const putMechanicalSheetStatus = (mechanicalSheetId) => {    
    return async () => {   
        try {
            const response = await api.put(`/mechanicalSheet/status/${mechanicalSheetId}`);

            return response;

        } catch (error) {
            console.error("Error editing sheet status: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};