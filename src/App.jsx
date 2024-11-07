import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Home from './components/pages/Home/Home.jsx';
import Shifts from './components/pages/Shifts/Shifts.jsx';
import Sheets from './components/pages/Sheets/Sheets.jsx';
import Clients from './components/pages/Clients/Clients.jsx';

const App = () => {

  return (
    <div className="App">
      <div className="header"><Header /></div>
      <div className="content">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/turnos' element={<Shifts />}/>
          <Route path='/fichas' element={<Sheets />}/>
          <Route path='/clientes' element={<Clients />}/>
        </Routes>
      </div>
    </div>
  );
};

export default App;