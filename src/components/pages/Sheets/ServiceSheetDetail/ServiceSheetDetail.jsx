import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PutServiceSheet from '../PutServiceSheet/PutServiceSheet.jsx';
import Error from '../../Error/Error.jsx';
import { getServiceSheetById, putServiceSheetStatus, getServiceSheets } from '../../../../redux/serviceSheetActions.js';
import { clearServiceSheetDetailReducer } from '../../../../redux/serviceSheetSlice.js';
import logo from "../../../../assets/img/logoMJ-BG.png";
import loadingGif from "../../../../assets/img/loading.gif";
import print from "../../../../assets/img/print.png";
import printHover from "../../../../assets/img/printHover.png";
import style from "./ServiceSheetDetail.module.css";

const ServiceSheetDetail = () => {

  	let { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const serviceSheetDetail = useSelector(state => state.serviceSheet?.serviceSheetDetail || {});    
    
    const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

    useEffect(() => {
		dispatch(getServiceSheetById(id))
        .then(() => setLoading(false))
        .catch(() => setError(true));

        return () => {
            dispatch(clearServiceSheetDetailReducer());
        };
	}, [dispatch, id]);

    //----- ABRIR POPUP
    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- DESACTIVAR ELEMENTO
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        dispatch(putServiceSheetStatus(id))
        .then(
            dispatch(getServiceSheets()).then(
                navigate(`/main_window/fichas`)
            )
        ).catch(
            dispatch(getServiceSheets()).then(
                navigate(`/main_window/fichas`)
            )
        );
    }

	return (
		<div className={style.serviceSheetPage}>
            {error ? (
                <Error />
            ) : (
                loading ? (
                    <div className="loadingPage">
                        <img src={loadingGif} alt=""/>
                        <p>Cargando</p>
                    </div>
                ) : (
                    <div>
                        <div className="page">
                            <div className="title">
                                <h2>Ficha de service n°{serviceSheetDetail.number}</h2>
                                <div className="titleButtons">
                                    <button 
                                        onClick={() => window.print()} 
                                        onMouseEnter={(e) => e.currentTarget.firstChild.src = printHover} 
                                        onMouseLeave={(e) => e.currentTarget.firstChild.src = print}
                                    >
                                        <img src={print} alt="Print"/>
                                    </button>
                                    {serviceSheetDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                    {!serviceSheetDetail.active ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Reactivar</button> : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Archivar</button>}
                                    <button onClick={() => navigate(`/main_window/fichas`)}>Atrás</button>
                                </div>
                            </div>
                        </div>
                        <div id="printable-section" className={`${style.serviceSheet} ${!serviceSheetDetail.active ? 'disabled' : ''}`}>

                            <div className={`columns ${!serviceSheetDetail.active ? 'disabled' : ''}`}>
                                <div>
                                    {serviceSheetDetail.number && <p><span>Número de ficha:&nbsp;</span>{serviceSheetDetail.number}</p>}
                                    {serviceSheetDetail.date && <p><span>Fecha:&nbsp;</span></p>}
                                    <p><span>{new Intl.DateTimeFormat('es-ES', { 
                                        day: '2-digit', 
                                        month: '2-digit', 
                                        year: '2-digit', 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        timeZone: 'UTC' // Forzar UTC
                                    }).format(new Date(serviceSheetDetail.date))} hs</span></p>
                                    {(serviceSheetDetail.personClient || serviceSheetDetail.companyClient) && (
                                        <p><span>Cliente:&nbsp;</span></p>
                                    )}                 
                                    {serviceSheetDetail.personClient ? (
                                        <div>
                                            {serviceSheetDetail.personClient.name && <p><span>Nombre:&nbsp;</span>{serviceSheetDetail.personClient.name}</p>}
                                            {serviceSheetDetail.personClient.dni && <p><span>DNI:&nbsp;</span>{serviceSheetDetail.personClient.dni}</p>}
                                            {serviceSheetDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{serviceSheetDetail.personClient.cuilCuit}</p>}
                                            {serviceSheetDetail.personClient.email && <p><span>Correo electrónico:&nbsp;</span>{serviceSheetDetail.personClient.email}</p>}
                                            {serviceSheetDetail.personClient.phoneWsp.numberPhone ? (
                                                <li><span>Whatsapp:&nbsp;</span>+{serviceSheetDetail.personClient.phoneWsp.prefix}{serviceSheetDetail.personClient.phoneWsp.numberPhone}</li>

                                            ) : (
                                                <li><span>Whatsapp:&nbsp;</span>No Whatsapp registrado.</li>
                                            )} 
                                            {serviceSheetDetail.personClient.phones?.length > 0 ? (
                                                <div>
                                                    <li>
                                                        <span>Teléfonos:&nbsp;</span>
                                                        {serviceSheetDetail.personClient.phones?.join(', ')}
                                                    </li>
                                                </div>
                                            ) : (
                                                <li><span>Teléfonos:&nbsp;</span>No tiene teléfono registrado.</li>
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
                                            {serviceSheetDetail.companyClient.phoneWsp.numberPhone ? (
                                                <li><span>Whatsapp:&nbsp;</span>+{serviceSheetDetail.companyClient.phoneWsp.prefix}{serviceSheetDetail.companyClient.phoneWsp.numberPhone}</li>
                                            ) : (
                                                <li><span>Whatsapp:&nbsp;</span>No Whatsapp registrado.</li>
                                            )} 
                                            {serviceSheetDetail.companyClient.phones?.length > 0 ? (
                                                <div>
                                                    <li>
                                                        <span>Teléfonos:&nbsp;</span>
                                                        {serviceSheetDetail.companyClient.phones?.join(', ')}
                                                    </li>
                                                </div>
                                            ) : (
                                                <li><span>Teléfonos:&nbsp;</span>No tiene teléfono registrado.</li>
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
                    </div>

                )
            )}
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <PutServiceSheet onServiceSheetAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
            {showDeleteModal ?
                <div className="deleteModal">
                    <div className="deleteModalContainer">
                        <p>{serviceSheetDetail.active ? "¿Está seguro que desea archivar esta ficha?" : "¿Está seguro que desea reactivar esta ficha?"}</p>
                        <div className="deleteModalButtons">
                            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                            {serviceSheetDetail.active ?
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

export default ServiceSheetDetail;