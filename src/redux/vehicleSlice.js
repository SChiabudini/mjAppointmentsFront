import { createSlice } from "@reduxjs/toolkit";

export const vehicleSlice = createSlice({
    name: "vehicle",
    initialState: {
        vehicles: [],
        vehiclesCopy: [],

    },
    reducers: {
        getVehiclesReducer: (state, action) => {
            state.vehicles = action.payload;
            state.vehiclesCopy = action.payload;
        },
    }
});

export const { getVehiclesReducer } = vehicleSlice.actions;

export default vehicleSlice.reducer;