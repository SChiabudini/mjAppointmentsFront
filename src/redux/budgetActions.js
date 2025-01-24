import api from '../services/axios.js';
import { getBudgetsReducer, getBudgetByIdReducer, searchBudgetsReducer } from './budgetSlice.js';

//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getBudgets = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/budget");

            const reversedData = data.reverse();

            dispatch(getBudgetsReducer(reversedData));

        } catch (error) {
            console.error("Error retrieving budgets from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE POR ID TANTO ACTIVOS COMO INACTIVOS

export const getBudgetById = (budgetId) => {    

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/budget/${budgetId}`);
            
            dispatch(getBudgetByIdReducer(data));
            
        } catch (error) {
            console.error("Error retrieving budget by server id: ", error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchBudgets = (number, client, vehicle) => {

    return async (dispatch) => {

        try {
            
            let query = '/budget?';
            
            if(number){
                query += `number=${number}&`
            }

            if(client){
                query += `client=${client}&`
            }

            if(vehicle){
                query += `vehicle=${vehicle}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchBudgetsReducer(reversedData));

        } catch (error) {
            console.error("Budgets search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
}

export const postBudget = (budgetData) => {
    return async () => {
        try {
            const response = await api.post("/budget", budgetData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Error creating budget');
            }
            throw new Error('Network error or server not reachable');
        }
    };
};