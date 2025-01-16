import style from './VehicleDetail.module.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PutVehicle from '../PutVehicle/PutVehicle.jsx';
import { getVehicleById } from '../../../../redux/vehicleActions.js';


const VehicleDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const vehicleDetail = useSelector(state => state.vehicle.vehicleDetail); 

    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);    

    useEffect(() => {
        dispatch(getVehicleById(id))
    }, [dispatch, id]);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(getVehicleById(id));
            setLoading(false);
        };
        fetchData();
    }, [dispatch, id]);

    // if (loading) {
    //     return <div>Cargando...</div>;
    // };

    // if (!vehicleDetail || Object.keys(vehicleDetail)?.length === 0) {
    //     return <div>No se encontraron detalles de este vehículo.</div>;
    // };
    
    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    //----- ABRIR POPUP
    const [popUpOpen, setPopUpOpen] = useState(false);

    return(
        <div className="page">
            {/* {
                loading ? (
                    <div>Cargando</div>
                ) : ( */}
                    <div className="component">
                        <div className="title">
                            <h2>Detalle del vehículo</h2>
                            <div className="titleButtons">
                                {vehicleDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                {!vehicleDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Eliminar</button>}
                                <button onClick={() => navigate(`/main_window/vehiculos`)}>Atrás</button>
                            </div>
                        </div>
                        {/* <div className={!vehicleDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                        <div className="columns">
                            <div className="left">
                                <p><span>Estado:&nbsp;</span>{vehicleDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {vehicleDetail.licensePlate && <p><span>Patente:&nbsp;</span>{vehicleDetail.licensePlate}</p>}
                                {vehicleDetail.brand && <p><span>Marca:&nbsp;</span>{vehicleDetail.brand}</p>}
                                {vehicleDetail.model && <p><span>Modelo:&nbsp;</span>{vehicleDetail.model}</p>}
                                {vehicleDetail.year && <p><span>Año:&nbsp;</span>{vehicleDetail.year}</p>}
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
                                                {vehicleDetail.personClient.phoneWsp ? (
                                                    <p><span>Whatsapp:&nbsp;</span>{vehicleDetail.personClient.phoneWsp}</p>
                                                ) : (
                                                    <p>No hay teléfono con Whatsapp registrado.</p>
                                                )} 
                                                {vehicleDetail.personClient.phones?.length > 0 ? (
                                                    <div>
                                                        <li>
                                                            <span>Teléfono(s):&nbsp;</span>
                                                            {vehicleDetail.personClient.phones?.join(', ')}
                                                        </li>
                                                    </div>
                                                ) : (
                                                    <li>No tiene teléfono registrado.</li>
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
                                                {vehicleDetail.companyClient.phoneWsp ? (
                                                    <p><span>Whatsapp:&nbsp;</span>{vehicleDetail.companyClient.phoneWsp}</p>
                                                ) : (
                                                    <p>No hay teléfono con Whatsapp registrado.</p>
                                                )} 
                                                {vehicleDetail.companyClient.phones?.length > 0 ? (
                                                    <div>
                                                        <li>
                                                            <span>Teléfonos:&nbsp;</span>
                                                            {vehicleDetail.companyClient.phones?.join(', ')}
                                                        </li>
                                                    </div>
                                                ) : (
                                                    <li>No tiene teléfono registrado.</li>
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
                                {(vehicleDetail.serviceSheets?.length > 0 || vehicleDetail.mechanicalSheets?.length > 0) && (
                                        <p><span>Fichas&nbsp;</span></p>
                                )}
                                <div className={style.sheetsContainer}>
                                    {vehicleDetail.serviceSheets?.length > 0 ? (
                                        <div className={style.sheets}>
                                            <p><span>Service&nbsp;</span></p>
                                            {[...vehicleDetail.serviceSheets]?.reverse().map((serviceSheet, index) => (
                                                <ul key={index}>                                       
                                                    {serviceSheet.number && <li>Número:&nbsp;{serviceSheet.number}</li>}
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
                                        <p className={style.withoutRegistration}>No hay fichas de service registradas.</p>
                                    )}
                                    {vehicleDetail.mechanicalSheets?.length > 0 ? (
                                        <div className={style.sheets}>
                                            <p><span>Mecánica&nbsp;</span></p>
                                            {[...vehicleDetail.mechanicalSheets]?.reverse().map((mechanicalSheet, index) => (
                                                <ul key={index}>                                                    
                                                    {mechanicalSheet.number && <li>Número de ficha:&nbsp;{mechanicalSheet.number}</li>}
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
                                        <p className={style.withoutRegistration}>No hay fichas de mecánica registradas.</p>
                                    )} 
                                </div>
                            </div>
                        </div>
                    </div>
                {/* ) */}
            {/* } */}
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <PutVehicle onVehicleAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
    )
};

export default VehicleDetail;