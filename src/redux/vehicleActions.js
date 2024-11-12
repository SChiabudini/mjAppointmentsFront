import api from '../services/axios.js';
import { getVehiclesReducer } from './vehicleSlice.js';

export const getVehicles = () => {

    return async (dispatch) => {
        try {
            
            const { data } = await api.get("/vehicle");

            dispatch(getVehiclesReducer(data));

        } catch (error) {
            
            console.error("Error retrieving vehicles from server: " + error.message);
            return null;
        }
    }

}