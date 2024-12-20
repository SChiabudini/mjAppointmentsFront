import './App.css';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Appointments from './components/pages/Appointments/Appointments.jsx';
import PersonClient from './components/pages/Clients/PersonClient/PersonClient.jsx';
import PersonClientDetail from './components/pages/Clients/PersonClient/PersonClientDetail/PersonClientDetail.jsx';
import CompanyClient from './components/pages/Clients/CompanyClient/CompanyClient.jsx';
import CompanyClientDetail from './components/pages/Clients/CompanyClient/CompanyClientDetail/CompanyClientDetail.jsx';
import Vehicles from './components/pages/Vehicles/Vehicles.jsx';
import VehicleDetail from './components/pages/Vehicles/VehicleDetail/VehicleDetail.jsx';
import Sheets from './components/pages/Sheets/Sheets.jsx';
import { getAppointments } from './redux/appointmentActions.js';
import { getPersonClients } from './redux/personClientActions.js';
import { getCompanyClients } from './redux/companyClientActions.js';
import { getVehicles } from './redux/vehicleActions.js';

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAppointments());
    dispatch(getPersonClients());
    dispatch(getCompanyClients());
    dispatch(getVehicles());
  }, [dispatch]);

  return (
    <div className="App">
      <div className="header"><Header /></div>
      <div className="content">
        <Routes>
          <Route path='/' element={<Appointments />}/>
          <Route path='/main_window/clientes/personas' element={<PersonClient />}/>
          <Route path='/main_window/clientes/personas/:id' element={<PersonClientDetail />}/>
          <Route path='/main_window/clientes/empresas' element={<CompanyClient />}/>
          <Route path='/main_window/clientes/empresas/:id' element={<CompanyClientDetail />}/>
          <Route path='/main_window/vehiculos' element={<Vehicles />}/>
          <Route path='/main_window/vehiculos/:id' element={<VehicleDetail />} />
          <Route path='/main_window/fichas' element={<Sheets />}/>
          <Route path='/main_window/fichas/:id' element={<Sheets />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;