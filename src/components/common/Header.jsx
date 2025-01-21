import style from './Header.module.css';
import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from './logo.png';

import NavBar from './NavBar/NavBar.jsx';

const Header = () => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <NavLink to="/">
          <h1>
            <img className={style.logoImg} src={logo} alt="Logo-MJ" title="Logo-MJ"/>
          </h1>
        </NavLink>
        <div className={style.nav}>
            <NavBar/>
        </div>
      </div>
    </div>
  )
}

export default Header;