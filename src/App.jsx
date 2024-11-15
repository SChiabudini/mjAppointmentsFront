import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Appointments from './components/pages/Appointments/Appointments.jsx';
import PersonClient from './components/pages/Clients/PersonClient/PersonClient.jsx';
import CompanyClient from './components/pages/Clients/CompanyClient/CompanyClient.jsx';
import Vehicles from './components/pages/Vehicles/Vehicles.jsx';
import Sheets from './components/pages/Sheets/Sheets.jsx';

const App = () => {

  return (
    <div className="App">
      <div className="header"><Header /></div>
      <div className="content">
        <Routes>
          <Route path='/' element={<Appointments />}/>
          <Route path='/main_window/clientes/personas' element={<PersonClient />}/>
          <Route path='/main_window/clientes/empresas' element={<CompanyClient />}/>
          <Route path='/main_window/vehiculos' element={<Vehicles />}/>
          <Route path='/main_window/fichas' element={<Sheets />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;