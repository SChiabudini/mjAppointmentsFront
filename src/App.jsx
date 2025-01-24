import './App.css';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import logo from './components/common/logo.png';
import Header from './components/common/Header.jsx';
import Appointments from './components/pages/Appointments/Appointments.jsx';
import AppointmentsDetail from './components/pages/Appointments/AppointmentsDetail/AppointmentsDetail.jsx';
import PersonClient from './components/pages/Clients/PersonClient/PersonClient.jsx';
import PersonClientDetail from './components/pages/Clients/PersonClient/PersonClientDetail/PersonClientDetail.jsx';
import PutPersonClient from './components/pages/Clients/PersonClient/PutPersonClient/PutPersonClient.jsx';
import CompanyClient from './components/pages/Clients/CompanyClient/CompanyClient.jsx';
import CompanyClientDetail from './components/pages/Clients/CompanyClient/CompanyClientDetail/CompanyClientDetail.jsx';
import PutCompanyClient from './components/pages/Clients/CompanyClient/PutCompanyClient/PutCompanyClient.jsx';
import Vehicles from './components/pages/Vehicles/Vehicles.jsx';
import VehicleDetail from './components/pages/Vehicles/VehicleDetail/VehicleDetail.jsx';
import Sheets from './components/pages/Sheets/Sheets.jsx';
import ServiceSheetDetail from './components/pages/Sheets/ServiceSheetDetail/ServiceSheetDetail.jsx';
import MechanicalSheetDetail from './components/pages/Sheets/MechanicalSheetDetail/MechanicalSheetDetail.jsx';
import Budgets from './components/pages/Budget/Budgets.jsx';
import BudgetDetail from './components/pages/Budget/BudgetDetail/BudgetDetail.jsx';
import Error from './components/pages/Error/Error.jsx';
import { getAppointments } from './redux/appointmentActions.js';
import { getPersonClients } from './redux/personClientActions.js';
import { getCompanyClients } from './redux/companyClientActions.js';
import { getVehicles } from './redux/vehicleActions.js';
import { getServiceSheets } from './redux/serviceSheetActions.js';
import { getMechanicalSheets } from './redux/mechanicalSheetActions.js';
import { getBudgets } from './redux/budgetActions.js';

const App = () => {

  const dispatch = useDispatch();
  const [ hasFetched, setHasFetched ] = useState(false);
  const [ error, setError ] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      await dispatch(getAppointments());
      await dispatch(getPersonClients());
      await dispatch(getCompanyClients());
      await dispatch(getVehicles());
      await dispatch(getServiceSheets());
      await dispatch(getMechanicalSheets());
      await dispatch(getBudgets());
      setHasFetched(true);
    } catch (error) {
      setError(true);
    }
  }

  if( !hasFetched ){
    fetchData();
  }

}, [dispatch, hasFetched]);

  return (
    <div className="App">
      {error ? (
        <Error />
      ) : (
        !hasFetched ? 
          <div className="loadingApp">
              <img src={logo} alt="logo"/>
              <div className="containerPoints">

                <div className="circulo2"></div>
                <div className="circulo1"></div>
                <div className="circulo3"></div>

              </div>
              {/* <p className="loadingPoint"></p> */}
              {/* <p className="loadingStyle">Cargando...</p> */}
          </div>
        :
          <>
            <div className="header"><Header /></div>
            <div className="content">
                <Routes>
                  <Route path='/' element={<Appointments />}/>
                  <Route path='/main_window/turnos/:id' element={<AppointmentsDetail />} />
                  <Route path='/main_window/clientes/personas' element={<PersonClient />}/>
                  <Route path='/main_window/clientes/personas/:id' element={<PersonClientDetail />}/>
                  <Route path='/main_window/clientes/personas/edit/:id' element={<PutPersonClient />}/>
                  <Route path='/main_window/clientes/empresas' element={<CompanyClient />}/>
                  <Route path='/main_window/clientes/empresas/:id' element={<CompanyClientDetail />}/>
                  <Route path='/main_window/clientes/empresas/edit/:id' element={<PutCompanyClient />}/>
                  <Route path='/main_window/vehiculos' element={<Vehicles />}/>
                  <Route path='/main_window/vehiculos/:id' element={<VehicleDetail />} />
                  <Route path='/main_window/fichas' element={<Sheets />}/>
                  <Route path='/main_window/fichas/service/:id' element={<ServiceSheetDetail />}/>
                  <Route path='/main_window/fichas/mecanica/:id' element={<MechanicalSheetDetail />}/>
                  <Route path='/main_window/presupuesto' element={<Budgets />}/>
                  <Route path='/main_window/presupuesto/:id' element={<BudgetDetail />}/>
                </Routes>
            </div>
          </>
      )}
    </div>
  );
};

export default App;