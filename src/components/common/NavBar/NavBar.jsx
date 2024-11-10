import style from './NavBar.module.css';
import React from 'react';
import { NavLink } from "react-router-dom";


const NavBar = () => {

  return (
    <div>
      <NavLink className={({ isActive }) => `${style.NavLink} ${isActive ? style.selected : ''}`} to="/turnos" >Turnos</NavLink>
      <NavLink className={({ isActive }) => `${style.NavLink} ${isActive ? style.selected : ''}`} to="/clientes" >Clientes</NavLink>
      <NavLink className={({ isActive }) => `${style.NavLink} ${isActive ? style.selected : ''}`} to="/vehiculos" >Vehículos</NavLink>
      <NavLink className={({ isActive }) => `${style.NavLink} ${isActive ? style.selected : ''}`} to="/fichas" >Fichas</NavLink>
    </div>
  )
}

export default NavBar;


//OPC 1:
// const NavBar = () => {

//   const navigate = useNavigate();

//   const handleNavigate = (route) => {
//       navigate(route);
//   };


//   return (
//     <div>
//       <button onClick={() => handleNavigate('/')}>Inicio</button>
//       <button onClick={() => handleNavigate('/turnos')}>Turnos</button>
//       <button onClick={() => handleNavigate('/clientes')}>Clientes</button>
//       <button onClick={() => handleNavigate('/fichas')}>Fichas</button>
//     </div>
//   )
// }