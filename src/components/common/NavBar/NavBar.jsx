import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import style from './NavBar.module.css';

const NavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleClick = (name) => {
        if (name === 'turnos') navigate('/');
        if (name === 'vehiculos') navigate('/main_window/vehiculos');
        if (name === 'fichas') navigate('/main_window/fichas');
        if (name === 'presupuestos') navigate('/main_window/presupuestos');
    };

    const handleClientClick = (subsection) => {
        if (subsection === 'personas') navigate('/main_window/clientes/personas');
        if (subsection === 'empresas') navigate('/main_window/clientes/empresas');
        setIsDropdownOpen(false);
    };
    
    return (
        <div className={style.NavBar}>
            <div className={`${style.NavLink} ${location.pathname === '/' || location.pathname.startsWith('/main_window/turnos') ? style.selected : ''}`} onClick={() => handleClick('turnos')}>
                Turnos
            </div>         
            <div
                className={`${style.NavLink} ${location.pathname.startsWith('/main_window/clientes') ? style.selected : ''}`}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                onClick={() => setIsDropdownOpen(true)} 
            >
                Clientes
                {isDropdownOpen && (
                    <div
                        className={style.DropdownMenu}
                        onMouseEnter={() => setIsDropdownOpen(true)} 
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <div className={style.DropdownItemsContainer}>
                            <div className={style.DropdownItem} onClick={() => handleClientClick('personas')}>Personas</div>
                            <div className={style.DropdownItem} onClick={() => handleClientClick('empresas')}>Empresas</div>
                        </div>
                    </div>
                )}
            </div>       
            <div className={`${style.NavLink} ${location.pathname.startsWith('/main_window/vehiculos') ? style.selected : ''}`} onClick={() => handleClick('vehiculos')}>
                Vehículos
            </div>
            <div className={`${style.NavLink} ${location.pathname.startsWith('/main_window/fichas') ? style.selected : ''}`} onClick={() => handleClick('fichas')}>
                Fichas
            </div>
            <div className={`${style.NavLink} ${location.pathname.startsWith('/main_window/presupuestos') ? style.selected : ''}`} onClick={() => handleClick('presupuestos')}>
                Presupuesto
            </div>
        </div>
    );
}

export default NavBar;
