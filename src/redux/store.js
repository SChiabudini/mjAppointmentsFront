import { configureStore } from "@reduxjs/toolkit";
import Appointment from "./appointmentSlice.js";
import CompanyClient from "./companyClientSlice.js";
import PersonClient from "./personClientSlice.js";
import ProcedureSheet from "./procedureSheetSlice.js";
import ServiceSheet from "./serviceSheetSlice.js";
import Vehicle from "./vehicleSlice.js";


export default configureStore({
    reducer:{
        appointment: Appointment,
        companyClient: CompanyClient,
        personClient: PersonClient,
        procedureSheet: ProcedureSheet,
        serviceSheet: ServiceSheet,
        vehicle: Vehicle,
    }
});