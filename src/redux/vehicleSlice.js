import { createSlice } from "@reduxjs/toolkit";

export const vehicleSlice = createSlice({
    name: "vehicle",
    initialState: {
        vehicles: [],
        vehiclesCopy: [],
        vehiclesAll: [],
        vehiclesAllCopy: [],
        vehicleDetail: {},
    },
    reducers: {
        getVehiclesReducer: (state, action) => {
            state.vehicles = action.payload;
            state.vehiclesCopy = action.payload;
        },

        getVehiclesAllReducer: (state, action) => {
            state.vehiclesAll = action.payload;
            state.vehiclesAllCopy = action.payload;
        },

        getVehicleByIdReducer: (state, action) => {
            state.vehicleDetail = action.payload;
        },

        searchVehiclesReducer: (state, action) => {
            state.vehicles = action.payload;
        },

        searchVehiclesAllReducer: (state, action) => {
            state.vehiclesAll = action.payload;
        },

        clearVehicleDetailReducer: (state) => {
            state.vehicleDetail = {};
        },

        clearVehiclesReducer: (state) => {
            state.vehicles = state.vehiclesCopy;
            state.vehiclesAll = state.vehiclesAllCopy;
        }
    }
});

export const { getVehiclesReducer, getVehiclesAllReducer, getVehicleByIdReducer, searchVehiclesReducer, searchVehiclesAllReducer, clearVehicleDetailReducer, clearVehiclesReducer } = vehicleSlice.actions;

export default vehicleSlice.reducer;