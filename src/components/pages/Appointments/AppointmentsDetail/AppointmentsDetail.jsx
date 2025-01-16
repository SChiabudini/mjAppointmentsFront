import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PutAppointment from '../PutAppointment/PutAppointment.jsx';
import { getAppointmentById } from '../../../../redux/appointmentActions.js';

const AppointmentsDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const appointmentDetail = useSelector(state => state.appointment?.appointmentDetail || {});    
    // console.log(appointmentDetail);

    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);     
    const [popUpOpen, setPopUpOpen] = useState(false);   
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(getAppointmentById(id));
            setLoading(false);
        };
        fetchData();
    }, [dispatch, id]);

    if (loading) {
        return <div>Cargando...</div>;
    };

    // Si appointmentDetail es null o un objeto vacío, es posible que los datos aún no estén disponibles
    if (!appointmentDetail || Object.keys(appointmentDetail).length === 0) {
        return <div>No se encontraron detalles para este turno.</div>;
    };
    
    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    };

    return(
        <div className="page">
            {/* {
                loading ? (
                    <div>Cargando</div>
                ) : ( */}
                    <div className="component">
                        <div className="title">
                            <h2>Detalle del turno</h2>
                            <div className="titleButtons">
                                {appointmentDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                {!appointmentDetail.active 
                                    ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> 
                                    : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                                <button onClick={() => navigate(`/`)}>Atrás</button>
                            </div>
                        </div>
                        {/* <div className={!appointmentDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                        <div>
                            <div>
                            {/* <div className={style.column}> */}
                                <p><span>Estado:&nbsp;</span>{appointmentDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {appointmentDetail.start && <p><span>Inicio del turno:&nbsp;</span></p>}
                                <p><span>{new Date(appointmentDetail.start).toLocaleString('es-ES', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: '2-digit', 
                                    hour: '2-digit', 
                                    minute: '2-digit', 
                                })}</span></p>
                                {appointmentDetail.end && <p><span>Finalización del turno:&nbsp;</span></p>}
                                <p><span>{new Date(appointmentDetail.end).toLocaleString('es-ES', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: '2-digit', 
                                    hour: '2-digit', 
                                    minute: '2-digit', 
                                })}</span></p>
                                {(appointmentDetail.personClient || appointmentDetail.companyClient) && (
                                    <p><span>Cliente:&nbsp;</span></p>
                                )}                 
                                {appointmentDetail.personClient ? (
                                    <div>
                                        {appointmentDetail.personClient.name && <p><span>Nombre:&nbsp;</span>{appointmentDetail.personClient.name}</p>}
                                        {appointmentDetail.personClient.dni && <p><span>DNI:&nbsp;</span>{appointmentDetail.personClient.dni}</p>}
                                        {appointmentDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{appointmentDetail.personClient.cuilCuit}</p>}
                                        {appointmentDetail.personClient.email && <p><span>Correo electrónico:&nbsp;</span>{appointmentDetail.personClient.email}</p>}
                                        {appointmentDetail.personClient.phoneWsp ? (
                                            <p><span>Whatsapp:&nbsp;</span>{appointmentDetail.personClient.phoneWsp}</p>
                                        ) : (
                                            <p>No hay teléfono con Whatsapp registrado.</p>
                                        )}
                                        {appointmentDetail.personClient.phones?.length > 0 ? (
                                            <div>
                                                <p><span>Teléfonos:&nbsp;</span></p>
                                                {appointmentDetail.personClient.phones?.map((phone, index) => (
                                                    <ul key={index}>
                                                        <li>
                                                            {<p><span>{phone}</span></p>}
                                                        </li>
                                                    </ul>
                                                ))}
                                            </div>
                                        ) : (
                                            <p><span>No tiene teléfono registrado.</span></p>
                                        )}
                                    </div>
                                ) : (
                                    <></>
                                )}      
                                {appointmentDetail.companyClient ? (
                                    <div>
                                        {appointmentDetail.companyClient.name && <p><span>Nombre:&nbsp;</span>{appointmentDetail.companyClient.name}</p>}
                                        {appointmentDetail.companyClient.cuit && <p><span>CUIT:&nbsp;</span>{appointmentDetail.companyClient.cuit}</p>}
                                        {appointmentDetail.companyClient.address && <p><span>Dirección:&nbsp;</span>{appointmentDetail.companyClient.address}</p>}
                                        {appointmentDetail.companyClient.email && <p><span>Correo electrónico:&nbsp;</span>{appointmentDetail.companyClient.email}</p>}
                                        {appointmentDetail.companyClient.phones?.length > 0 ? (
                                            <div>
                                                <p><span>Teléfonos:&nbsp;</span></p>
                                                {appointmentDetail.companyClient.phones?.map((phone, index) => (
                                                    <ul key={index}>
                                                        <li>
                                                            {<p><span>{phone}</span></p>}
                                                        </li>
                                                    </ul>
                                                ))}
                                            </div>
                                        ) : (
                                            <p><span>No tiene teléfono registrado.</span></p>
                                        )}
                                        {appointmentDetail.companyClient.phoneWsp ? (
                                            <p><span>Whatsapp:&nbsp;</span>{appointmentDetail.companyClient.phoneWsp}</p>
                                        ) : (
                                            <p>No hay teléfono con Whatsapp registrado.</p>
                                        )}
                                    </div>
                                ) : (
                                    <></>
                                )} 
                                {appointmentDetail.vehicle && <p><span>Vehículo:&nbsp;</span></p>}
                                {appointmentDetail.vehicle ? (
                                    <ul key={appointmentDetail.vehicle.licensePlate}>
                                        <li> 
                                            {appointmentDetail.vehicle.licensePlate && <p><span>Patente:&nbsp;</span>{appointmentDetail.vehicle.licensePlate}</p>}
                                            {appointmentDetail.vehicle.brand && <p><span>Marca:&nbsp;</span>{appointmentDetail.vehicle.brand}</p>}
                                            {appointmentDetail.vehicle.model && <p><span>Modelo:&nbsp;</span>{appointmentDetail.vehicle.model}</p>}
                                            {appointmentDetail.vehicle.year && <p><span>Año:&nbsp;</span>{appointmentDetail.vehicle.year}</p>}
                                            {appointmentDetail.vehicle.engine && <p><span>Motor:&nbsp;</span>{appointmentDetail.vehicle.engine}</p>}
                                        </li>
                                    </ul>
                                ) : (
                                    <p>No hay vehículo registrado.</p>
                                )}
                                {appointmentDetail.procedure ? (
                                    <ul key={appointmentDetail.procedure.title}>
                                        <li> 
                                            {appointmentDetail.procedure.service && <p><span>Service</span></p>}
                                            {appointmentDetail.procedure.mechanical && <p><span>Mecánica</span></p>}
                                            {appointmentDetail.procedure.title && <p><span>Título:&nbsp;</span>{appointmentDetail.procedure.title}</p>}
                                            {appointmentDetail.procedure.description && <p><span>Descripción:&nbsp;</span>{appointmentDetail.procedure.description}</p>}
                                        </li>
                                    </ul>
                                ) : (
                                    <p>No hay procedimiento registrado.</p>
                                )}
                            </div>
                        </div>
                    </div>
                {/* ) */}
            {/* } */}
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <PutAppointment onAppointmentAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
    )
}

export default AppointmentsDetail