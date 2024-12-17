import { configureStore } from "@reduxjs/toolkit";
import Appointment from "./appointmentSlice.js";
import CompanyClient from "./companyClientSlice.js";
import PersonClient from "./personClientSlice.js";
import MechanicalSheet from "./mechanicalSheetSlice.js";
import ServiceSheet from "./serviceSheetSlice.js";
import Vehicle from "./vehicleSlice.js";


export default configureStore({
    reducer:{
        appointment: Appointment,
        companyClient: CompanyClient,
        personClient: PersonClient,
        mechanicalSheet: MechanicalSheet,
        serviceSheet: ServiceSheet,
        vehicle: Vehicle,
    }
});