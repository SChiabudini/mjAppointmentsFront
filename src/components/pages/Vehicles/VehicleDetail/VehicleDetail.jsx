import style from './VehicleDetail.module.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PutVehicle from '../PutVehicle/PutVehicle.jsx';
import Error from '../../Error/Error.jsx';
import { getVehicleById, getVehicles, putVehicleStatus } from '../../../../redux/vehicleActions.js';
import { clearVehicleDetailReducer } from '../../../../redux/vehicleSlice.js';
import loadingGif from "../../../../assets/img/loading.gif";


const VehicleDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const vehicleDetail = useSelector(state => state.vehicle.vehicleDetail); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        dispatch(getVehicleById(id))
        .then(() => setLoading(false))
        .catch(() => setError(true));

        return () => {
            dispatch(clearVehicleDetailReducer());
        };
    }, [dispatch, id]);

    //----- ABRIR POPUP
    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- DESACTIVAR ELEMENTO

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        dispatch(putVehicleStatus(id))
        .then(
            dispatch(getVehicles()).then(
                navigate(`/main_window/vehiculos`)
            )
        ).catch(
            dispatch(getVehicles()).then(
                navigate(`/main_window/vehiculos`)
            )
        );
    };

    //----- FORMAT NUMBER

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return(
        <div className="page">
            {error ? (
                <Error />
            ) : (
                loading ? 
                    <div className="loadingPage">
                        <img src={loadingGif} alt=""/>
                        <p>Cargando</p>
                    </div>
                :
                    <div className="component">
                        <div className="title">
                            <h2>Detalle del vehículo</h2>
                            <div className="titleButtons">
                                {vehicleDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                {!vehicleDetail.active ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Reactivar</button> : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Archivar</button>}
                                <button onClick={() => navigate(`/main_window/vehiculos`)}>Atrás</button>
                            </div>
                        </div>
                        <div className={`columns ${!vehicleDetail.active ? 'disabled' : ''}`}>
                            <div className="left">
                                <p><span>Estado:&nbsp;</span>{vehicleDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {vehicleDetail.licensePlate && <p><span>Patente:&nbsp;</span>{vehicleDetail.licensePlate}</p>}
                                {vehicleDetail.brand && <p><span>Marca:&nbsp;</span>{vehicleDetail.brand}</p>}
                                {vehicleDetail.model && <p><span>Modelo:&nbsp;</span>{vehicleDetail.model}</p>}
                                <p><span>Año:&nbsp;</span>{vehicleDetail.year !== 0 ? vehicleDetail.year : "No disponible"}</p>
                                {vehicleDetail.engine && <p><span>Motor:&nbsp;</span>{vehicleDetail.engine}</p>}
                                {vehicleDetail.personClient || vehicleDetail.companyClient ? (
                                <div>  
                                    <p><span>Cliente:&nbsp;</span></p>              
                                    {vehicleDetail.personClient && (
                                        <div className="clientInfo">
                                            <ul>
                                                {vehicleDetail.personClient.name && <li><span>Nombre:&nbsp;</span>{vehicleDetail.personClient.name}</li>}
                                                {vehicleDetail.personClient.dni && <li><span>DNI:&nbsp;</span>{vehicleDetail.personClient.dni}</li>}
                                                {vehicleDetail.personClient.cuilCuit && <li><span>CUIL/CUIT:&nbsp;</span>{vehicleDetail.personClient.cuilCuit}</li>}
                                                {vehicleDetail.personClient.email && <li><span>Correo electrónico:&nbsp;</span>{vehicleDetail.personClient.email}</li>}
                                                {vehicleDetail.personClient.phoneWsp.numberPhone ? (
                                                    <li><span>Whatsapp:&nbsp;</span>+{vehicleDetail.personClient.phoneWsp.prefix}{vehicleDetail.personClient.phoneWsp.numberPhone}</li>
                                                ) : (
                                                    <li><span>Whatsapp:&nbsp;</span>Sin Whatsapp.</li>
                                                )} 
                                                {vehicleDetail.personClient.phones?.length > 0 ? (
                                                    <div>
                                                        <li>
                                                            <span>Teléfono(s):&nbsp;</span>
                                                            {vehicleDetail.personClient.phones?.join(', ')}
                                                        </li>
                                                    </div>
                                                ) : (
                                                    <li><span>Teléfonos:&nbsp;</span>No tiene teléfono registrado.</li>
                                                )}
                                            </ul>         
                                        </div>
                                    )}      
                                    {vehicleDetail.companyClient && (
                                        <div className="clientInfo">
                                            <ul>
                                                {vehicleDetail.companyClient.name && <li><span>Nombre:&nbsp;</span>{vehicleDetail.companyClient.name}</li>}
                                                {vehicleDetail.companyClient.cuit && <li><span>CUIT:&nbsp;</span>{vehicleDetail.companyClient.cuit}</li>}
                                                {vehicleDetail.companyClient.address && <li><span>Dirección:&nbsp;</span>{vehicleDetail.companyClient.address}</li>}
                                                {vehicleDetail.companyClient.email && <li><span>Correo electrónico:&nbsp;</span>{vehicleDetail.companyClient.email}</li>}
                                                {vehicleDetail.companyClient.phoneWsp.numberPhone ? (
                                                    <li><span>Whatsapp:&nbsp;</span>+{vehicleDetail.companyClient.phoneWsp.prefix}{vehicleDetail.companyClient.phoneWsp.numberPhone}</li>
                                                ) : (
                                                    <li><span>Whatsapp:&nbsp;</span>No Whatsapp registrado.</li>
                                                )} 
                                                {vehicleDetail.companyClient.phones?.length > 0 ? (
                                                    <div>
                                                        <li>
                                                            <span>Teléfonos:&nbsp;</span>
                                                            {vehicleDetail.companyClient.phones?.join(', ')}
                                                        </li>
                                                    </div>
                                                ) : (
                                                    <li><span>Teléfonos:&nbsp;</span>No tiene teléfono registrado.</li>
                                                )}
                                            </ul>
                                        </div>
                                    )} 
                                </div>
                                ) : (
                                    <p><span className={style.withoutRegistration}>No hay cliente asociado a este vehículo.</span></p>
                                )}
                            </div>
                            <div className="right">                            
                                <p><span>Fichas&nbsp;</span></p>
                                <div className={style.sheetsContainer}>
                                    {vehicleDetail.serviceSheets?.length > 0 ? (
                                        <div className={style.sheets}>
                                            <p><span>Service&nbsp;</span></p>
                                            {[...vehicleDetail.serviceSheets]?.reverse().map((serviceSheet, index) => (
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
                                                    {serviceSheet.kilometers && <li>Kilometraje:&nbsp;{formatNumber(serviceSheet.kilometers)}</li>}
                                                    {serviceSheet.kmsToNextService && <li>Kms hasta el siguiente service:&nbsp;{formatNumber(serviceSheet.kmsToNextService)}</li>}
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
                                                    {serviceSheet.amount && 
                                                        <li>Monto:&nbsp;${formatNumber(serviceSheet.amount)}</li>
                                                    }                         
                                                </ul>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={style.sheets}>
                                            <p><span>Service&nbsp;</span></p>
                                            <p className={style.withoutRegistration}>No hay fichas de service registradas.</p>
                                        </div>
                                    )}
                                    {vehicleDetail.mechanicalSheets?.length > 0 ? (
                                        <div className={style.sheets}>
                                            <p><span>Mecánica&nbsp;</span></p>
                                            {[...vehicleDetail.mechanicalSheets]?.reverse().map((mechanicalSheet, index) => (
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
                                                    {mechanicalSheet.kilometers && <li>Kilometraje:&nbsp;{formatNumber(mechanicalSheet.kilometers)}</li>}
                                                    {mechanicalSheet.keyWords && <li>Palabras clave:&nbsp;{mechanicalSheet.keyWords}</li>}
                                                    {mechanicalSheet.description && <li>Descripción:&nbsp;{mechanicalSheet.description}</li>}
                                                    {mechanicalSheet.amount && <li>Monto:&nbsp;${formatNumber(mechanicalSheet.amount)}</li>}               
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
                <PutVehicle onVehicleAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
            {showDeleteModal ?
                <div className="deleteModal">
                    <div className="deleteModalContainer">
                        <p>{vehicleDetail.active ? "¿Está seguro que desea archivar este vehículo?" : "¿Está seguro que desea reactivar este vehículo?"}</p>
                        <div className="deleteModalButtons">
                            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                            {vehicleDetail.active ?
                                <button onClick={handleDelete} className="delete">Archivar</button>
                            : 
                                <button onClick={handleDelete} className="add">Reactivar</button>
                            }
                        </div>
                    </div>
                </div>
                :
                <></>
            }
            
        </div>
    )
};

export default VehicleDetail;