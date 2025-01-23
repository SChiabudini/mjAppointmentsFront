import style from './Header.module.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import NavBar from './NavBar/NavBar.jsx';

const Header = () => {

    const navigate = useNavigate();

    return (
        <div className={style.container}>
            <div className={style.content}>
                <h1 onClick={() => navigate("/")}>
                <img className={style.logoImg} src={logo} alt="Logo-MJ" title="Logo-MJ"/>
                </h1>
            <div className={style.nav}>
                <NavBar/>
            </div>
            </div>
        </div>
    )
}

export default Header;