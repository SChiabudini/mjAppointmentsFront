import { createSlice } from "@reduxjs/toolkit";

export const vehicleSlice = createSlice({
    name: "vehicle",
    initialState: {
        vehicles: [],
        vehiclesCopy: [],
        vehicleDetail: {}
    },
    reducers: {
        getVehiclesReducer: (state, action) => {
            state.vehicles = action.payload;
            state.vehiclesCopy = action.payload;
        },

        getVehicleByIdReducer: (state, action) => {
            state.vehicleDetail = action.payload;
        },

        searchVehiclesReducer: (state, action) => {
            state.vehicles = action.payload;
        },

        clearVehicleDetailReducer: (state, action) => {
            state.vehicleDetail = {};
        },

        clearVehiclesReducer: (state) => {
            state.vehicles = state.vehiclesCopy;
        }
    }
});

export const { getVehiclesReducer, getVehicleByIdReducer, searchVehiclesReducer, clearVehiclesReducer } = vehicleSlice.actions;

export default vehicleSlice.reducer;