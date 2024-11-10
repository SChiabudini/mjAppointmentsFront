import { createSlice } from "@reduxjs/toolkit";

export const vehicleSlice = createSlice({
    name: "vehicle",
    initialState: {
        vehicle: [],
        vehicleCopy: [],

    },
    reducers: {
        getVehicleReducer: (state, action) => {
            state.vehicle = action.payload;
            state.vehicleCopy = action.payload;
        },
    }
});

export const { getVehicleReducer } = vehicleSlice.actions;

export default vehicleSlice.reducer;