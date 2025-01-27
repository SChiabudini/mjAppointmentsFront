import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PutServiceSheet from '../PutServiceSheet/PutServiceSheet.jsx';
import Error from '../../Error/Error.jsx';
import { getServiceSheetById, putServiceSheetStatus } from '../../../../redux/serviceSheetActions.js';

const ServiceSheetDetail = () => {

  	let { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const serviceSheetDetail = useSelector(state => state.serviceSheet?.serviceSheetDetail || {});    
    
    const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);     
    const [popUpOpen, setPopUpOpen] = useState(false);      
	
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		setLoading(true);
	// 		await dispatch(getServiceSheetById(id));
	// 		setLoading(false);
	// 	};
	// 	fetchData();
	// }, [dispatch, id]);
    useEffect(() => {
		dispatch(getServiceSheetById(id))
        .then(() => setLoading(false))
        .catch(() => setError(true));
	}, [dispatch, id]);
	
	const toggleShowDeleteModal = () => {
		setShowDeleteModal(!showDeleteModal);
	};

	return (
		<div className="page">
            {error ? (
                <Error />
            ) : (
                loading ? (
                    <div className="loadingPage">
                        <img src={loadingGif} alt=""/>
                        <p>Cargando</p>
                    </div>
                ) : (
                    <div className="component">
                        <div className="title">
                            <h2>Detalle de la ficha service</h2>
                            <div className="titleButtons">
                                {serviceSheetDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                {!serviceSheetDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                                <button onClick={() => navigate(`/main_window/fichas`)}>Atrás</button>
                            </div>
                        </div>
                        {/* <div className={!serviceSheetDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                        <div>
                            <div>
                            {/* <div className={style.column}> */}
                                {/* <p><span>Estado:&nbsp;</span>{serviceSheetDetail.active ? 'Activo' : 'Inactivo'}</p> */}
								{serviceSheetDetail.number && <p><span>Número de ficha:&nbsp;</span>{serviceSheetDetail.number}</p>}
								{serviceSheetDetail.date && <p><span>Fecha:&nbsp;</span></p>}
                                <p><span>{new Date(serviceSheetDetail.date).toLocaleString('es-ES', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: '2-digit', 
                                    hour: '2-digit', 
                                    minute: '2-digit', 
                                })}</span></p>
                                {(serviceSheetDetail.personClient || serviceSheetDetail.companyClient) && (
                                    <p><span>Cliente:&nbsp;</span></p>
                                )}                 
                                {serviceSheetDetail.personClient ? (
                                    <div>
                                        {serviceSheetDetail.personClient.name && <p><span>Nombre:&nbsp;</span>{serviceSheetDetail.personClient.name}</p>}
                                        {serviceSheetDetail.personClient.dni && <p><span>DNI:&nbsp;</span>{serviceSheetDetail.personClient.dni}</p>}
                                        {serviceSheetDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{serviceSheetDetail.personClient.cuilCuit}</p>}
                                        {serviceSheetDetail.personClient.email && <p><span>Correo electrónico:&nbsp;</span>{serviceSheetDetail.personClient.email}</p>}
                                        {serviceSheetDetail.personClient.phoneWsp ? (
                                            <p><span>Whatsapp:&nbsp;</span>{serviceSheetDetail.personClient.phoneWsp}</p>
                                        ) : (
                                            <p>No hay teléfono con Whatsapp registrado.</p>
                                        )} 
                                        {serviceSheetDetail.personClient.phones?.length > 0 ? (
                                            <div>
                                                <p><span>Teléfonos:&nbsp;</span></p>
                                                {serviceSheetDetail.personClient.phones?.map((phone, index) => (
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
                                {serviceSheetDetail.companyClient ? (
                                    <div>
                                        {serviceSheetDetail.companyClient.name && <p><span>Nombre:&nbsp;</span>{serviceSheetDetail.companyClient.name}</p>}
                                        {serviceSheetDetail.companyClient.cuit && <p><span>CUIT:&nbsp;</span>{serviceSheetDetail.companyClient.cuit}</p>}
                                        {serviceSheetDetail.companyClient.address && <p><span>Dirección:&nbsp;</span>{serviceSheetDetail.companyClient.address}</p>}
                                        {serviceSheetDetail.companyClient.email && <p><span>Correo electrónico:&nbsp;</span>{serviceSheetDetail.companyClient.email}</p>}
                                        {serviceSheetDetail.companyClient.phoneWsp ? (
                                            <p><span>Whatsapp:&nbsp;</span>{serviceSheetDetail.companyClient.phoneWsp}</p>
                                        ) : (
                                            <p>No hay teléfono con Whatsapp registrado.</p>
                                        )} 
                                        {serviceSheetDetail.companyClient.phones?.length > 0 ? (
                                            <div>
                                                <p><span>Teléfonos:&nbsp;</span></p>
                                                {serviceSheetDetail.companyClient.phones?.map((phone, index) => (
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
                                {serviceSheetDetail.vehicle && <p><span>Vehículo:&nbsp;</span></p>}
                                {serviceSheetDetail.vehicle ? (
                                    <ul key={serviceSheetDetail.vehicle.licensePlate}>
                                        <li> 
                                            {serviceSheetDetail.vehicle.licensePlate && <p><span>Patente:&nbsp;</span>{serviceSheetDetail.vehicle.licensePlate}</p>}
                                            {serviceSheetDetail.vehicle.brand && <p><span>Marca:&nbsp;</span>{serviceSheetDetail.vehicle.brand}</p>}
                                            {serviceSheetDetail.vehicle.model && <p><span>Modelo:&nbsp;</span>{serviceSheetDetail.vehicle.model}</p>}
                                            {serviceSheetDetail.vehicle.year && <p><span>Año:&nbsp;</span>{serviceSheetDetail.vehicle.year}</p>}
                                            {serviceSheetDetail.vehicle.engine && <p><span>Motor:&nbsp;</span>{serviceSheetDetail.vehicle.engine}</p>}
                                        </li>
                                    </ul>
                                ) : (
                                    <p>No hay vehículo registrado.</p>
                                )}
								{serviceSheetDetail.kilometers && <p><span>Kilómetros:&nbsp;</span>{serviceSheetDetail.kilometers}</p>}
								{serviceSheetDetail.kmsToNextService && <p><span>Kilómetros hasta el siguiente service:&nbsp;</span>{serviceSheetDetail.kmsToNextService}</p>}
								{serviceSheetDetail.oil && <p><span>Aceite:&nbsp;</span>{serviceSheetDetail.oil}</p>}
								{serviceSheetDetail.filters?.length > 0 ? (
									<div>
										<p><span>Filtros:&nbsp;</span></p>
										{serviceSheetDetail.filters?.map((filter, index) => (
											<ul key={index}>
												<li>
													{<p><span>{filter}</span></p>}
												</li>
											</ul>
										))}
									</div>
								) : (
									<></>
								)}
								{serviceSheetDetail.notes && <p><span>Notas:&nbsp;</span>{serviceSheetDetail.notes}</p>}
								{serviceSheetDetail.amount && <p><span>Monto:&nbsp;$&nbsp;</span>{serviceSheetDetail.amount}</p>}                                                   
                            </div>
                        </div>
                    </div>
                )
            )}
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <PutServiceSheet onServiceSheetAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
	)
};

export default ServiceSheetDetail;