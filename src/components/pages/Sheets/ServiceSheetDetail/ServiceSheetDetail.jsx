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
    };

    //----- FORMAT NUMBER

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

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
                                        className="withImage"
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
                            <div className={style.header}>
                                <div className={style.header1}>
                                    <img src={logo} alto=""/>
                                    <p><span>MJ PRO OIL</span></p>
                                    <p>Matías Nicolás Ezequiel</p>
                                    <p>20-41195480-4</p>
                                    <p>Av. 44 n° 1877 e/ 132 y 133</p>
                                    <p>Teléfono: (221) 6230285</p>
                                    <p>Email: mjprooil44@gmail.com</p>
                                </div>
                                <div className={style.header2}>
                                    <p className={style.bigP}>F</p>
                                    <p>DOCUMENTO</p>
                                    <p>NO VÁLIDO</p>
                                    <p>COMO FACTURA</p>
                                </div>
                                <div className={style.header3}>
                                    <div>
                                        <p><span>FICHA DE SERVICE</span></p>
                                        <p>N° {serviceSheetDetail.number}</p>
                                        <p>Fecha: {new Intl.DateTimeFormat('es-ES', { 
                                                day: '2-digit', 
                                                month: '2-digit', 
                                                year: '2-digit', 
                                                hour: '2-digit', 
                                                minute: '2-digit', 
                                                timeZone: 'UTC'
                                        }).format(new Date(serviceSheetDetail.date))}hs</p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.body}>
                                <div className={style.dataColumns}>
                                    <div className={style.dataContainer}>
                                        <p><span>DATOS DEL CLIENTE</span></p>
                                        {serviceSheetDetail.personClient ? (
                                            <div className={style.data}>
                                                <p><span>DNI:</span> {serviceSheetDetail.personClient.dni}</p>
                                                <p><span>Nombre:</span> {serviceSheetDetail.personClient.name}</p>
                                                <p><span>Email:</span> {serviceSheetDetail.personClient.email}</p>
                                                {serviceSheetDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:</span> {serviceSheetDetail.personClient.cuilCuit}</p>}
                                                {serviceSheetDetail.personClient.phoneWsp.numberPhone && <p><span>Whatsapp:&nbsp;</span>+{serviceSheetDetail.personClient.phoneWsp.prefix}{serviceSheetDetail.personClient.phoneWsp.numberPhone}</p>}
                                                {serviceSheetDetail.personClient.phones?.length > 0 && <p><span>Teléfonos:</span> {serviceSheetDetail.personClient.phones?.join(', ')}</p>}
                                            </div>
                                        ) : (
                                            <div className={style.data}>
                                                <p><span>CUIT:</span> {serviceSheetDetail.companyClient.cuit}</p>
                                                <p><span>Nombre:</span> {serviceSheetDetail.companyClient.name}</p>
                                                <p><span>Email:</span> {serviceSheetDetail.companyClient.email}</p>
                                                {serviceSheetDetail.companyClient.address && <p><span>Dirección:</span> {serviceSheetDetail.companyClient.address}</p>}
                                                {serviceSheetDetail.companyClient.phoneWsp.numberPhone && <p><span>Whatsapp:&nbsp;</span>+{serviceSheetDetail.companyClient.phoneWsp.prefix}{serviceSheetDetail.companyClient.phoneWsp.numberPhone}</p>}
                                                {serviceSheetDetail.companyClient.phones?.length > 0 && <p><span>Teléfonos:</span> {serviceSheetDetail.companyClient.phones?.join(', ')}</p>}
                                            </div>
                                        )}
                                    </div>
                                    <div className={style.dataContainer}>
                                        <p><span>DATOS DEL VEHÍCULO</span></p>
                                        <div className={style.data}>                                                                                    
                                            <p><span>Patente:</span> {serviceSheetDetail.vehicle.licensePlate}</p>
                                            <p><span>Marca:</span> {serviceSheetDetail.vehicle.brand}</p>
                                            <p><span>Modelo:</span> {serviceSheetDetail.vehicle.model}</p>
                                            <p><span>Año:</span> {serviceSheetDetail.vehicle.year}</p>
                                            <p><span>Motor:</span> {serviceSheetDetail.vehicle.engine}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.dataContainer}>
                                    <p><span>DATOS DEL SERVICE</span></p>
                                    <div className={style.data}>
                                        {serviceSheetDetail.kilometers && <p><span>Kilómetros:&nbsp;</span>{formatNumber(serviceSheetDetail.kilometers)}</p>}
                                        {serviceSheetDetail.kmsToNextService && <p><span>Kilómetros hasta el siguiente service:&nbsp;</span>{formatNumber(serviceSheetDetail.kmsToNextService)}</p>}
                                        {serviceSheetDetail.oil && <p><span>Aceite:&nbsp;</span>{serviceSheetDetail.oil}</p>}
                                        {serviceSheetDetail.filters?.length > 0 ? (
                                            <p><span>Filtros:&nbsp;</span>{serviceSheetDetail.filters?.join(', ')}</p>
                                        ) : (
                                            <></>
                                        )}
                                        {serviceSheetDetail.notes && <p><span>Notas:&nbsp;</span></p>}
                                        {serviceSheetDetail.notes && <p className={style.notes}>{serviceSheetDetail.notes}</p>}
                                    </div>  
                                </div>
                            </div>
                            <div className={style.footer}>Total: ${formatNumber(serviceSheetDetail.amount)}</div>
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