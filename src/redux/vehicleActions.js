import api from '../services/axios.js';
import { getVehiclesReducer, getVehicleByIdReducer, searchVehiclesReducer } from './vehicleSlice.js';


//-----TRAE ÚNICAMENTE LOS ACTIVOS

export const getVehicles = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/vehicle");

            const reversedData = data.reverse();

            dispatch(getVehiclesReducer(reversedData));

        } catch (error) {
            
            console.error("Error retrieving vehicles from server: " + error.message);
            return null;
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
            return null;
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
            return null;
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
            return null;
        }  
    };
};