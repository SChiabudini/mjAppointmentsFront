import style from './NavBar.module.css';
import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (name) => {
    if(name === 'turnos') {
      navigate('/');
    }

    if(name === 'clientes') {
      navigate('/main_window/clientes');
    }
    
    if(name === 'vehiculos') {
      navigate('/main_window/vehiculos');
    }

    if(name === 'fichas') {
      navigate('/main_window/fichas');
    }
  }

  return (
    <div className={style.NavBar}>
      <div className={`${style.NavLink} ${location.pathname === '/' ? style.selected : ''}`}  onClick={() => handleClick('turnos')}>Turnos</div>
      <div className={`${style.NavLink} ${location.pathname === '/main_window/clientes' ? style.selected : ''}`}  onClick={() => handleClick('clientes')}>Clientes</div>
      <div className={`${style.NavLink} ${location.pathname === '/main_window/vehiculos' ? style.selected : ''}`}  onClick={() => handleClick('vehiculos')}>Vehículos</div>
      <div className={`${style.NavLink} ${location.pathname === '/main_window/fichas' ? style.selected : ''}`}  onClick={() => handleClick('fichas')}>Fichas</div>
    </div>
  )
}

export default NavBar;