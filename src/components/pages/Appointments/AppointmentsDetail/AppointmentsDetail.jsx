import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PutAppointment from '../PutAppointment/PutAppointment.jsx';
import Error from '../../Error/Error.jsx';
import { getAppointmentById } from '../../../../redux/appointmentActions.js';
import { clearAppointmentDetailReducer } from '../../../../redux/appointmentSlice.js';
import loadingGif from "../../../../assets/img/loading.gif";

const AppointmentsDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const appointmentDetail = useSelector(state => state.appointment?.appointmentDetail || {});    

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);     
    const [popUpOpen, setPopUpOpen] = useState(false);   
    
    useEffect(() => {
        dispatch(getAppointmentById(id))
        .then(() => setLoading(false))
        .catch(() => setError(true));

        return () => {
            dispatch(clearAppointmentDetailReducer());
        }

    }, [dispatch, id]);   

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
                            <h2>Detalle del turno</h2>
                            <div className="titleButtons">
                                {appointmentDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                {!appointmentDetail.active 
                                    ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Activar</button> 
                                    : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Desactivar</button>}
                                <button onClick={() => navigate(`/`)}>Atrás</button>
                            </div>
                        </div>
                        {/* <div className={!appointmentDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                        <div className="columns">
                            <div className="left">
                                <div>
                                {(appointmentDetail.personClient || appointmentDetail.companyClient) && (
                                    <p><span>Cliente:&nbsp;</span></p>
                                )}                 
                                {appointmentDetail.personClient ? (
                                    <div className="clientInfo">
                                        <ul>
                                            {appointmentDetail.personClient.name && <li><span>Nombre:&nbsp;</span>{appointmentDetail.personClient.name}</li>}
                                            {appointmentDetail.personClient.dni && <li><span>DNI:&nbsp;</span>{appointmentDetail.personClient.dni}</li>}
                                            {appointmentDetail.personClient.cuilCuit && <li><span>CUIL/CUIT:&nbsp;</span>{appointmentDetail.personClient.cuilCuit}</li>}
                                            {appointmentDetail.personClient.email && <li><span>Correo electrónico:&nbsp;</span>{appointmentDetail.personClient.email}</li>}
                                            {appointmentDetail.personClient.phoneWsp ? (
                                                <li><span>Whatsapp:&nbsp;</span>+{appointmentDetail.personClient.phoneWsp.prefix}{appointmentDetail.personClient.phoneWsp.numberPhone}</li>
                                            ) : (
                                                <li>No hay teléfono con Whatsapp registrado.</li>
                                            )}   
                                            {appointmentDetail.personClient.phones?.length > 0 ? (
                                                <li><span>Teléfono(s):&nbsp;</span>{appointmentDetail.personClient.phones?.join(', ')}</li>
                                            ) : (
                                                <li><span>Teléfono(s):&nbsp;</span>No tiene teléfono registrado.</li>
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <></>
                                )}      
                                {appointmentDetail.companyClient ? (
                                    <div className="clientInfo">
                                        <ul>
                                            {appointmentDetail.companyClient.name && <li><span>Nombre:&nbsp;</span>{appointmentDetail.companyClient.name}</li>}
                                            {appointmentDetail.companyClient.cuit && <li><span>CUIT:&nbsp;</span>{appointmentDetail.companyClient.cuit}</li>}
                                            {appointmentDetail.companyClient.address && <li><span>Dirección:&nbsp;</span>{appointmentDetail.companyClient.address}</li>}
                                            {appointmentDetail.companyClient.email && <li><span>Correo electrónico:&nbsp;</span>{appointmentDetail.companyClient.email}</li>}
                                            {appointmentDetail.companyClient.phoneWsp ? (
                                                <li><span>Whatsapp:&nbsp;</span>+{appointmentDetail.companyClient.phoneWsp.prefix}{appointmentDetail.companyClient.phoneWsp.numberPhone}</li>
                                            ) : (
                                                <li>No hay teléfono con Whatsapp registrado.</li>
                                            )} 
                                            {appointmentDetail.companyClient.phones?.length > 0 ? (
                                                <li><span>Teléfono(s):&nbsp;</span>{appointmentDetail.companyClient.phones?.join(', ')}</li>
                                            ) : (
                                                <li><span>Teléfono(s):&nbsp;</span>No tiene teléfono registrado.</li>
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <></>
                                )} 
                                </div>
                                <div>
                                    {appointmentDetail.vehicle && <p><span>Vehículo:&nbsp;</span></p>}
                                    {appointmentDetail.vehicle ? (
                                        <div className="clientInfo">
                                            <ul key={appointmentDetail.vehicle.licensePlate}>
                                                    {appointmentDetail.vehicle.licensePlate && <li><span>Patente:&nbsp;</span>{appointmentDetail.vehicle.licensePlate}</li>}
                                                    {appointmentDetail.vehicle.brand && <li><span>Marca:&nbsp;</span>{appointmentDetail.vehicle.brand}</li>}
                                                    {appointmentDetail.vehicle.model && <li><span>Modelo:&nbsp;</span>{appointmentDetail.vehicle.model}</li>}
                                                    {appointmentDetail.vehicle.year && <li><span>Año:&nbsp;</span>{appointmentDetail.vehicle.year}</li>}
                                                    {appointmentDetail.vehicle.engine && <li><span>Motor:&nbsp;</span>{appointmentDetail.vehicle.engine}</li>}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="clientInfo"><p>No hay vehículo registrado.</p></div>
                                    )}
                                </div> 
                            </div>
                            <div className="right">
                            <p><span>Estado:&nbsp;</span>{appointmentDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {appointmentDetail.start && <p><span>Inicio del turno:&nbsp;</span>
                                    {new Intl.DateTimeFormat('es-ES', { 
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: '2-digit', 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        timeZone: 'UTC' // Forzar UTC
                                }).format(new Date(appointmentDetail.start))} hs</p>}
                                {appointmentDetail.end && <p><span>Finalización del turno:&nbsp;</span>
                                    {new Intl.DateTimeFormat('es-ES', { 
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: '2-digit', 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        timeZone: 'UTC' // Forzar UTC
                                }).format(new Date(appointmentDetail.end))} hs</p>}
                                {appointmentDetail.procedure ? (
                                    <>
                                        {appointmentDetail.procedure.service ? <p><span>Service:&nbsp;</span>sí.</p> : <p><span>Service:&nbsp;</span>no.</p>}
                                        {appointmentDetail.procedure.mechanical ? <p><span>Mecánica:&nbsp;</span>sí.</p> : <p><span>Mecánica:&nbsp;</span>no.</p>}
                                        {appointmentDetail.procedure.title && <p><span>Título:&nbsp;</span>{appointmentDetail.procedure.title}</p>}
                                        {appointmentDetail.procedure.description ? 
                                            <p><span>Descripción:&nbsp;</span>{appointmentDetail.procedure.description}</p>
                                        :
                                            <p><span>Descripción:&nbsp;</span>no posee.</p>
                                        }
                                    </>
                                ) : (
                                    <p>No hay procedimiento registrado.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
                <div onClick={(e) => e.stopPropagation()}>
                    <PutAppointment onAppointmentAdded={() => setPopUpOpen(false)}/>
                </div>
            </div>
        </div>
    )
}

export default AppointmentsDetail