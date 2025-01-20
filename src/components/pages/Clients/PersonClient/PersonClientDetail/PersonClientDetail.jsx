import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonClientById } from '../../../../../redux/personClientActions.js';
import { clearPersonClientDetailReducer } from '../../../../../redux/personClientSlice.js';
import PutPersonClient from '../PutPersonClient/PutPersonClient.jsx';
import loadingGif from "../../../../../assets/img/loading.gif";
import style from "./PersonClientDetail.module.css";

const PersonClientDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const personClientDetail = useSelector(state => state.personClient.personClientDetail); 

    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);    
    const [popUpOpen, setPopUpOpen] = useState(false);

    useEffect(() => {
        dispatch(getPersonClientById(id)).then(() => setLoading(false));
        
            return () => {
                dispatch(clearPersonClientDetailReducer());
            };
    }, [dispatch, id]);

    return(
        <div className="page">
            {loading ? 
                <div className="loadingPage">
                    <img src={loadingGif} alt=""/>
                    <p>Cargando</p>
                </div>
            : 
                <div className="component">
                    <div className="title">
                        <h2>Detalle del Cliente</h2>
                        <div className="titleButtons">
                            {/* {personClientDetail.active ? <button onClick={() => navigate(`/main_window/clientes/personas/edit/${id}`)}>Editar</button> : ''} */}
                            {personClientDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                            {!personClientDetail.active ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Activar</button> : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Desactivar</button>}
                            <button onClick={() => navigate(`/main_window/clientes/personas`)}>Atrás</button>
                        </div>
                    </div>
                    {/* <div className={!personClientDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                    <div className="columns">
                        <div className="left">
                            <p><span>Estado:&nbsp;</span>{personClientDetail.active ? 'Activo' : 'Inactivo'}</p>
                            {personClientDetail.dni && <p><span>DNI:&nbsp;</span>{personClientDetail.dni}</p>}
                            {personClientDetail.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{personClientDetail.cuilCuit}</p>}
                            {personClientDetail.name && <p><span>Nombre:&nbsp;</span>{personClientDetail.name}</p>}
                            {personClientDetail.phoneWsp ? (
                                <p><span>Whatsapp:&nbsp;</span>+{personClientDetail.phoneWsp}</p>
                            ) : (
                                <p>No hay teléfono con Whatsapp registrado.</p>
                            )}  
                            {personClientDetail.phones?.length > 0 ? (
                                <p><span>Teléfono(s):&nbsp;</span>{personClientDetail.phones?.join(', ')}</p>
                            ) : (
                                <p><span>Teléfono(s):&nbsp;</span>No tiene teléfono registrado.</p>
                            )}     
                            {personClientDetail.email && <p><span>Correo electrónico:&nbsp;</span>{personClientDetail.email}</p>}
                            <div>
                                {personClientDetail.vehicles && <p><span>Vehículos:&nbsp;</span></p>}
                                {personClientDetail.vehicles?.length > 0 ? (
                                <div>
                                    {personClientDetail.vehicles?.map((vehicle, index) => (
                                        <div className="clientInfo">
                                            <ul key={index}>
                                                <li><span>Patente:&nbsp;</span>{vehicle.licensePlate}</li>
                                                <li><span>Marca:&nbsp;</span>{vehicle.brand}</li>
                                                <li><span>Modelo:&nbsp;</span>{vehicle.model}</li>
                                                <li><span>Año:&nbsp;</span>{vehicle.year}</li>
                                                <li><span>Motor:&nbsp;</span>{vehicle.engine}</li>
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="clientInfo"><p><span className={style.withoutRegistration}>No hay vehículos disponibles.</span></p></div>
                            )}  
                            </div>
                        </div>
                        <div className="right">                            
                            <p><span>Fichas&nbsp;</span></p>
                            <div className={style.sheetsContainer}>
                                {personClientDetail.serviceSheets?.length > 0 ? (
                                    <div className={style.sheets}>
                                        <p><span>Service&nbsp;</span></p>
                                        {[...personClientDetail.serviceSheets]?.reverse().map((serviceSheet, index) => (
                                            <ul key={index}>                                       
                                                {serviceSheet.number && <span><li>Número:&nbsp;{serviceSheet.number}</li></span>}
                                                {serviceSheet.date && 
                                                    <li>Fecha: {new Date(serviceSheet.date).toLocaleString('es-ES', { 
                                                        day: '2-digit', 
                                                        month: '2-digit', 
                                                        year: '2-digit', 
                                                        hour: '2-digit', 
                                                        minute: '2-digit', 
                                                    })}</li>
                                                }
                                                {serviceSheet.kilometers && <li>Kilometraje:&nbsp;{serviceSheet.kilometers}</li>}
                                                {serviceSheet.kmsToNextService && <li>Kms hasta el siguiente service:&nbsp;{serviceSheet.kmsToNextService}</li>}
                                                {serviceSheet.oil && <li>Aceite:&nbsp;{serviceSheet.oil}</li>}
                                                {serviceSheet.filters?.length > 0 ? (
                                                    <li>
                                                        Filtros:&nbsp;
                                                        {serviceSheet.filters?.join(', ')}
                                                    </li>
                                                ) : (
                                                    <></>
                                                )}
                                                {serviceSheet.notes && <li>Notas:&nbsp;{serviceSheet.notes}</li>}
                                                {serviceSheet.amount && <li>Monto:&nbsp;${serviceSheet.amount}</li>}                                                   
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={style.sheets}>
                                        <p><span>Service&nbsp;</span></p>
                                        <p className={style.withoutRegistration}>No hay fichas de service registradas.</p>
                                    </div>
                                    
                                )}
                                {personClientDetail.mechanicalSheets?.length > 0 ? (
                                    <div className={style.sheets}>
                                        <p><span>Mecánica&nbsp;</span></p>
                                        {[...personClientDetail.mechanicalSheets]?.reverse().map((mechanicalSheet, index) => (
                                            <ul key={index}>                                                    
                                                {mechanicalSheet.number && <span><li>Número:&nbsp;{mechanicalSheet.number}</li></span>}
                                                {mechanicalSheet.date && 
                                                    <li>Fecha: {new Date(mechanicalSheet.date).toLocaleString('es-ES', { 
                                                        day: '2-digit', 
                                                        month: '2-digit', 
                                                        year: '2-digit', 
                                                        hour: '2-digit', 
                                                        minute: '2-digit', 
                                                    })}</li>
                                                }
                                                {mechanicalSheet.kilometers && <li>Kilometraje:&nbsp;{mechanicalSheet.kilometers}</li>}
                                                {mechanicalSheet.keyWords && <li>Palabras clave:&nbsp;{mechanicalSheet.keyWords}</li>}
                                                {mechanicalSheet.description && <li>Descripción:&nbsp;{mechanicalSheet.description}</li>}
                                                {mechanicalSheet.amount && <li>Monto:&nbsp;${mechanicalSheet.amount}</li>}                                                   
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={style.sheets}>
                                        <p><span>Mecánica&nbsp;</span></p>
                                        <p className={style.withoutRegistration}>No hay fichas mecánicas registradas.</p>
                                    </div>
                                )} 
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <PutPersonClient onClientAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
    )
};

export default PersonClientDetail;