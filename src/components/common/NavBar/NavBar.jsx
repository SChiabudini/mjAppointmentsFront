import React from 'react';
import { useNavigate } from "react-router-dom";

const NavBar = () => {

  const navigate = useNavigate();

    const handleNavigate = (route) => {
        navigate(route);
    };


  return (
    <div>
      <button onClick={() => handleNavigate('/')}>Inicio</button>
      <button onClick={() => handleNavigate('/turnos')}>Turnos</button>
      <button onClick={() => handleNavigate('/fichas')}>Fichas</button>
      <button onClick={() => handleNavigate('/clientes')}>Clientes</button>
    </div>
  )
}

export default NavBar;