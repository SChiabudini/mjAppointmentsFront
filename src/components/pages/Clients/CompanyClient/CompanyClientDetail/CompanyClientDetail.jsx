import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyClientById } from '../../../../../redux/companyClientActions';
import { clearCompanyClientDetailReducer } from '../../../../../redux/companyClientSlice.js';
import PutCompanyClient from '../PutCompanyClient/PutCompanyClient.jsx';
import loadingGif from "../../../../../assets/img/loading.gif";
import style from "./CompanyClientDetail.module.css";

const CompanyClientDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const companyClientDetail = useSelector(state => state.companyClient.companyClientDetail); 

    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);    
    const [popUpOpen, setPopUpOpen] = useState(false);

    useEffect(() => {
        dispatch(getCompanyClientById(id)).then(() => setLoading(false));
        
        return () => {
            dispatch(clearCompanyClientDetailReducer());
        };
    }, [dispatch, id]);   

    return(
        <div className="page">
            {loading ? (
                <div className="loadingPage">
                    <img src={loadingGif} alt=""/>
                    <p>Cargando</p>
                </div>
            ):( 
                <div className="component">
                    <div className="title">
                        <h2>Detalle de la empresa</h2>
                        <div className="titleButtons">
                            {companyClientDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                            {!companyClientDetail.active ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Activar</button> : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Desactivar</button>}
                            <button onClick={() => navigate(`/main_window/clientes/empresas`)}>Atrás</button>
                        </div>
                    </div>
                    {/* <div className={!companyClientDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                    <div className="columns">
                        <div className="left">
                        {/* <div className={style.column}> */}
                            <p><span>Estado:&nbsp;</span>{companyClientDetail.active ? 'Activo' : 'Inactivo'}</p>
                            {companyClientDetail.cuit && <p><span>CUIT:&nbsp;</span>{companyClientDetail.cuit}</p>}
                            {companyClientDetail.name && <p><span>Nombre:&nbsp;</span>{companyClientDetail.name}</p>}
                            {companyClientDetail.phoneWsp ? (
                                <p><span>Whatsapp:&nbsp;</span>+{companyClientDetail.phoneWsp.prefix}{companyClientDetail.phoneWsp.numberPhone}</p>
                            ) : (
                                <p>No hay teléfono con Whatsapp registrado.</p>
                            )}                        
                            {companyClientDetail.phones?.length > 0 ? (
                                <p><span>Teléfono(s):&nbsp;</span>{companyClientDetail.phones?.join(', ')}</p>
                            ) : (
                                <p><span>Teléfono(s):&nbsp;</span>No tiene teléfono registrado.</p>
                            )}    
                            {companyClientDetail.email && <p><span>Correo electrónico:&nbsp;</span>{companyClientDetail.email}</p>}
                            {companyClientDetail.address && <p><span>Dirección:&nbsp;</span>{companyClientDetail.address}</p>}                        
                            <div>
                                {companyClientDetail.vehicles && <p><span>Vehículos:&nbsp;</span></p>}
                                {companyClientDetail.vehicles?.length > 0 ? (
                                    <div>
                                        {companyClientDetail.vehicles?.map((vehicle, index) => (
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
                                {companyClientDetail.serviceSheets?.length > 0 ? (
                                    <div className={style.sheets}>
                                        <p><span>Service&nbsp;</span></p>
                                        {[...companyClientDetail.serviceSheets]?.reverse().map((serviceSheet, index) => (
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
                                {companyClientDetail.mechanicalSheets?.length > 0 ? (
                                    <div className={style.sheets}>
                                        <p><span>Mecánica&nbsp;</span></p>
                                        {[...companyClientDetail.mechanicalSheets]?.reverse().map((mechanicalSheet, index) => (
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
            )}
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
                <div onClick={(e) => e.stopPropagation()}>
                    <PutCompanyClient onClientAdded={() => setPopUpOpen(false)}/>
                </div>
            </div>
        </div>
    )
};

export default CompanyClientDetail;