import api from '../services/axios.js';
import { getProcedureSheetsReducer, getProcedureSheetByIdReducer, searchProcedureSheetsReducer } from './procedureSheetSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getProcedureSheets = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/procedureSheet");

            const reversedData = data.reverse();

            dispatch(getProcedureSheetsReducer(reversedData));

        } catch (error) {
            
            console.error("Error retrieving procedure sheets from server: " + error.message);
            return null;
        }
    }

};

//-----TRAE POR ID TANTO ACTIVOS COMO INACTIVOS

export const getProcedureSheetById = (procedureSheetId) => {

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/procedureSheet/${procedureSheetId}`);

            dispatch(getProcedureSheetByIdReducer(data));
        } catch (error) {
            console.error("Error retrieving procedure sheet by server id: ", error.message);
            return null;
        }
    }

};

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchProcedureSheets = (number, date, client, vehicle, kewWords) => {

    return async (dispatch) => {

        try {
            
            let query = '/procedureSheet?';
            
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

            dispatch(searchProcedureSheetsReducer(reversedData));

        } catch (error) {
            console.error("Procedure sheets search error:", error.message);
            return null;
        }
    }
}

export const postProcedureSheet = (procedureSheetData) => {
    return async () => {
        try {
            const response = await api.post("/procedureSheet", procedureSheetData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Error creating procedure sheet');
            }
            throw new Error('Network error or server not reachable');
        }
    };
};