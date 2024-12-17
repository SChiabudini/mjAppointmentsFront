import api from '../services/axios.js';
import { getMechanicalSheetsReducer, getMechanicalSheetByIdReducer, searchMechanicalSheetsReducer } from './mechanicalSheetSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getMechanicalSheets = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/mechanicalSheet");

            const reversedData = data.reverse();

            dispatch(getMechanicalSheetsReducer(reversedData));

        } catch (error) {
            
            console.error("Error retrieving mechanical sheets from server: " + error.message);
            return null;
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
            return null;
        }
    }

};

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchMechanicalSheets = (number, date, client, vehicle, kewWords) => {

    return async (dispatch) => {

        try {
            
            let query = '/mechanicalSheet?';
            
            if(number){
                query += `number=${number}&`
            }

            if(date){
                query += `date=${date}&`
            }

            if(client){
                query += `client=${client}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            if(kewWords){
                query += `kewWords=${kewWords}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchMechanicalSheetsReducer(reversedData));

        } catch (error) {
            console.error("Mechanical sheets search error:", error.message);
            return null;
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