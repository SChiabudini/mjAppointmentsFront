import './index.css';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import axios from "axios";
import { Provider } from 'react-redux';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HashRouter>
        <App/>
    </HashRouter>
);