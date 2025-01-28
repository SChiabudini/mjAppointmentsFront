import api from '../services/axios.js';
import { getVehiclesReducer, getVehiclesAllReducer, getVehicleByIdReducer, searchVehiclesReducer, searchVehiclesAllReducer } from './vehicleSlice.js';


//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getVehicles = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/vehicle");

            const reversedData = data.reverse();

            dispatch(getVehiclesReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving vehicles from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE TODOS

export const getAllVehicles = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/vehicle/all");

            const reversedData = data.reverse();

            dispatch(getVehiclesAllReducer(reversedData));

        } catch (error) {           
            console.error("Error retrieving vehicles from server: " + error.message);
            throw new Error('Network error or server not reachable');
        }
    }

};

//-----TRAE POR ID TANTO ACTIVOS COMO INACTIVOS

export const getVehicleById = (vehicleId) => {

    return async (dispatch) => {
        try {
            const { data } = await api.get(`/vehicle/${vehicleId}`);
            dispatch(getVehicleByIdReducer(data));
            
        } catch (error) {
            console.error("Error retrieving vehicle by server id: ", error.message);
            throw new Error('Network error or server not reachable');
        }
    };
};

//-----TRAE SOLO LOS ACTIVOS FILTRADOS

export const searchVehicles = (licensePlate, client) => {

    return async (dispatch) => {

        try {
            
            let query = '/vehicle?';
            
            if(licensePlate){
                query += `licensePlate=${licensePlate}&`
            }

            if(client){
                query += `client=${client}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchVehiclesReducer(reversedData));

        } catch (error) {
            console.error("Vehicles search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
};

//-----TRAE TODOS FILTRADOS

export const searchAllVehicles = (licensePlate, client) => {

    return async (dispatch) => {

        try {
            
            let query = '/vehicle/all?';
            
            if(licensePlate){
                query += `licensePlate=${licensePlate}&`
            }

            if(client){
                query += `client=${client}&`
            }

            const { data } = await api.get(query);

            const reversedData = data.reverse();

            dispatch(searchVehiclesAllReducer(reversedData));

        } catch (error) {
            console.error("Vehicles search error:", error.message);
            throw new Error('Network error or server not reachable');
        }
    }
};

export const postVehicle = (vehicleData) => {
    return async () => {
        try {
            const response = await api.post("/vehicle", vehicleData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Error creating vehicle');
            }
            throw new Error('Network error or server not reachable');
        }
    };
};

export const putVehicle = (vehicleData) => {   
     
    return async () => {   
        try {
            const response = await api.put('/vehicle', vehicleData);
            return response;

        } catch (error) {
            console.error("Error editing a vehicle: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};

export const putVehicleStatus = (vehicleId) => {    
    return async () => {   
        try {
            const response = await api.put(`/vehicle/status/${vehicleId}`);

            return response;

        } catch (error) {
            console.error("Error editing vehicle status: ", error.message);
            throw new Error('Network error or server not reachable');
        }  
    };
};