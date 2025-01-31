import React from 'react';
import error from '../../../assets/img/error.png';

const Error = () => {
    return (
        <div className='error'>
            <div>
                <img src={error} alt=""/>
                <h2>Error al cargar los datos del servidor</h2>
                <ul>
                    <li>Chequear la conexión a internet del dispositivo.</li>
                    <li>Reiniciar la aplicación.</li>
                    <li>Si el problema persiste, contactarse con <span>Frida Software</span>.</li>
                </ul>
            </div>
        </div>
    )
}

export default Error;