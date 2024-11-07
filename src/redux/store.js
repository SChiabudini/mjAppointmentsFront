import { configureStore } from "@reduxjs/toolkit";
import Appoiment from "./appoimentSlice.js";
import CompanyClient from "./companyClientSlice.js";
import PersonClient from "./personClientSlice.js";
import ProcedureSheet from "./procedureSheetSlice.js";
import ServiceSheet from "./serviceSheetSlice.js";
import Vehicle from "./vehicleSlice.js";


export default configureStore({
    reducer:{
        appoiment: Appoiment,
        companyClient: CompanyClient,
        personClient: PersonClient,
        procedureSheet: ProcedureSheet,
        serviceSheet: ServiceSheet,
        vehicle: Vehicle,
    }
});