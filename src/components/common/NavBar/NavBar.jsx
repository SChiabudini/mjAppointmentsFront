import style from './NavBar.module.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = (name) => {
    if(name === 'inicio') {
      navigate('/');
    }

    if(name === 'turnos') {
      navigate('/main_window/turnos');
    }
    
    if(name === 'vehiculos') {
      navigate('/main_window/vehiculos');
    }

    if(name === 'fichas') {
      navigate('/main_window/fichas');
    }
  }

  const handleClientClick = (subsection) => {
    if (subsection === 'personas') {
      navigate('/main_window/clientes/personas');
    }
    if (subsection === 'empresas') {
      navigate('/main_window/clientes/empresas');
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className={style.NavBar}>
      <div className={`${style.NavLink} ${location.pathname === '/' ? style.selected : ''}`}  onClick={() => handleClick('inicio')}>Inicio</div>
      <div className={`${style.NavLink} ${location.pathname === '/main_window/turnos' ? style.selected : ''}`}  onClick={() => handleClick('turnos')}>Turnos</div>
      <div
        className={`${style.NavLink} ${location.pathname.startsWith('/main_window/clientes') ? style.selected : ''}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Alternar visibilidad del menú desplegable
      >
        Clientes
        {isDropdownOpen && (
          <div className={style.DropdownMenu}>
            <div
              className={style.DropdownItem}
              onClick={() => handleClientClick('personas')}
            >
              Personas
            </div>
            <div
              className={style.DropdownItem}
              onClick={() => handleClientClick('empresas')}
            >
              Empresas
            </div>
          </div>
        )}
      </div>
      <div className={`${style.NavLink} ${location.pathname === '/main_window/vehiculos' ? style.selected : ''}`}  onClick={() => handleClick('vehiculos')}>Vehículos</div>
      <div className={`${style.NavLink} ${location.pathname === '/main_window/fichas' ? style.selected : ''}`}  onClick={() => handleClick('fichas')}>Fichas</div>
    </div>
  )
}

export default NavBar;