import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import PutMechanicalSheet from '../PutMechanicalSheet/PutMechanicalSheet.jsx';
import Error from '../../Error/Error.jsx';
import { getMechanicalSheetById, putMechanicalSheetStatus, getMechanicalSheets } from '../../../../redux/mechanicalSheetActions';
import { clearMechanicalSheetDetailReducer } from '../../../../redux/mechanicalSheetSlice.js';
import logo from "../../../../assets/img/logoMJ-BG.png";
import loadingGif from "../../../../assets/img/loading.gif";
import print from "../../../../assets/img/print.png";
import printHover from "../../../../assets/img/printHover.png";
import style from "./MechanicalSheetDetail.module.css";

const MechanicalSheetDetail = () => {

  	let { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const mechanicalSheetDetail = useSelector(state => state.mechanicalSheet?.mechanicalSheetDetail || {});    

	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		dispatch(getMechanicalSheetById(id))
		.then(() => setLoading(false))
		.catch(() => setError(true));

		return () => {
			dispatch(clearMechanicalSheetDetailReducer());
		};
	}, [dispatch, id]);

	//----- ABRIR POPUP
	const [popUpOpen, setPopUpOpen] = useState(false);

	//----- DESACTIVAR ELEMENTO
	
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleDelete = async () => {
		dispatch(putMechanicalSheetStatus(id))
		.then(
			dispatch(getMechanicalSheets()).then(
				navigate(`/main_window/fichas`)
			)
		).catch(
			dispatch(getMechanicalSheets()).then(
				navigate(`/main_window/fichas`)
			)
		);
	}

	return (
		<div className={style.mechanicalSheetPage}>
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
								<h2>Ficha mecánica n°{mechanicalSheetDetail.number}</h2>
								<div className="titleButtons">
									<button 
										onClick={() => window.print()} 
										onMouseEnter={(e) => e.currentTarget.firstChild.src = printHover} 
										onMouseLeave={(e) => e.currentTarget.firstChild.src = print}
									>
										<img src={print} alt="Print"/>
									</button>
									{mechanicalSheetDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
									{!mechanicalSheetDetail.active ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Reactivar</button> : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Archivar</button>}
									<button onClick={() => navigate(`/main_window/fichas`)}>Atrás</button>
								</div>
							</div>
						</div>
						<div id="printable-section" className={`${style.mechanicalSheet} ${!mechanicalSheetDetail.active ? 'disabled' : ''}`}>
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
									<p className={style.bigP}>P</p>
									<p>DOCUMENTO</p>
									<p>NO VÁLIDO</p>
									<p>COMO FACTURA</p>
								</div>
								<div className={style.header3}>
									<div>
										<p><span>FICHA MECÁNICA</span></p>
										<p>N° {mechanicalSheetDetail.number}</p>
										<p>Fecha: {new Intl.DateTimeFormat('es-ES', { 
												day: '2-digit', 
												month: '2-digit', 
												year: '2-digit', 
												hour: '2-digit', 
												minute: '2-digit', 
												timeZone: 'UTC'
										}).format(new Date(mechanicalSheetDetail.date))}hs</p>
									</div>
								</div>
							</div>
							<div className={style.body}>
								<div className={style.dataColumns}>
									<div className={style.dataContainer}>
										<p><span>DATOS DEL CLIENTE</span></p>
										{mechanicalSheetDetail.personClient ? (
											<div className={style.data}>
												<p><span>DNI:</span> {mechanicalSheetDetail.personClient.dni}</p>
												<p><span>Nombre:</span> {mechanicalSheetDetail.personClient.name}</p>
												<p><span>Email:</span> {mechanicalSheetDetail.personClient.email}</p>
												{mechanicalSheetDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:</span> {mechanicalSheetDetail.personClient.cuilCuit}</p>}
												{mechanicalSheetDetail.personClient.phoneWsp.numberPhone && <p><span>Whatsapp:&nbsp;</span>+{mechanicalSheetDetail.personClient.phoneWsp.prefix}{mechanicalSheetDetail.personClient.phoneWsp.numberPhone}</p>}
												{mechanicalSheetDetail.personClient.phones?.length > 0 && <p><span>Teléfonos:</span> {mechanicalSheetDetail.personClient.phones?.join(', ')}</p>}
											</div>
										) : (
											<div className={style.data}>
												<p><span>CUIT:</span> {mechanicalSheetDetail.companyClient.cuit}</p>
												<p><span>Nombre:</span> {mechanicalSheetDetail.companyClient.name}</p>
												<p><span>Email:</span> {mechanicalSheetDetail.companyClient.email}</p>
												{mechanicalSheetDetail.companyClient.address && <p><span>Dirección:</span> {mechanicalSheetDetail.companyClient.address}</p>}
												{mechanicalSheetDetail.companyClient.phoneWsp.numberPhone && <p><span>Whatsapp:&nbsp;</span>+{mechanicalSheetDetail.companyClient.phoneWsp.prefix}{mechanicalSheetDetail.companyClient.phoneWsp.numberPhone}</p>}
												{mechanicalSheetDetail.companyClient.phones?.length > 0 && <p><span>Teléfonos:</span> {mechanicalSheetDetail.companyClient.phones?.join(', ')}</p>}
											</div>
										)}
									</div>
									<div className={style.dataContainer}>
										<p><span>DATOS DEL VEHÍCULO</span></p>
										<div className={style.data}>                                                                                
											<p><span>Patente:</span> {mechanicalSheetDetail.vehicle.licensePlate}</p>
											<p><span>Marca:</span> {mechanicalSheetDetail.vehicle.brand}</p>
											<p><span>Modelo:</span> {mechanicalSheetDetail.vehicle.model}</p>
											<p><span>Año:</span> {mechanicalSheetDetail.vehicle.year}</p>
											<p><span>Motor:</span> {mechanicalSheetDetail.vehicle.engine}</p>
										</div>
									</div>
								</div>
								<div className={style.dataContainer}>
									<p><span>DATOS DEL PROCEDIMIENTO</span></p>
									<div className={style.data}>
										{mechanicalSheetDetail.kilometers && <p><span>Kilómetros:&nbsp;</span>{mechanicalSheetDetail.kilometers}</p>}
										{mechanicalSheetDetail.keyWords && <p><span>Palabras clave:&nbsp;</span>{mechanicalSheetDetail.keyWords}</p>}
										{mechanicalSheetDetail.description && <p><span>Descripción:&nbsp;</span></p>}
										{mechanicalSheetDetail.description && <p className={style.notes}>{mechanicalSheetDetail.description}</p>}
									</div>  
								</div>
							</div>
							<div className={style.footer}>Total: ${mechanicalSheetDetail.amount}</div>
						</div>
					</div>
					// <div className="component">
					// 	<div className="title">
					// 		<h2>Detalle de la ficha mecánica</h2>
					// 		<div className="titleButtons">
					// 			{mechanicalSheetDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
					// 			{!mechanicalSheetDetail.active ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Reactivar</button> : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Archivar</button>}
					// 			<button onClick={() => navigate(`/main_window/fichas`)}>Atrás</button>
					// 		</div>
					// 	</div>
					// 	<div className={`columns ${!mechanicalSheetDetail.active ? 'disabled' : ''}`}>
					// 		<div>
					// 			{mechanicalSheetDetail.number && <p><span>Número de ficha:&nbsp;</span>{mechanicalSheetDetail.number}</p>}
					// 			{mechanicalSheetDetail.date && <p><span>Fecha:&nbsp;</span></p>}
					// 			<p><span>{new Intl.DateTimeFormat('es-ES', { 
					// 				day: '2-digit', 
					// 				month: '2-digit', 
					// 				year: '2-digit', 
					// 				hour: '2-digit', 
					// 				minute: '2-digit', 
					// 				timeZone: 'UTC' // Forzar UTC
                    //             }).format(new Date(mechanicalSheetDetail.date))} hs</span></p>
					// 			{(mechanicalSheetDetail.personClient || mechanicalSheetDetail.companyClient) && (
					// 				<p><span>Cliente:&nbsp;</span></p>
					// 			)}                 
					// 			{mechanicalSheetDetail.personClient ? (
					// 				<div>
					// 					{mechanicalSheetDetail.personClient.name && <p><span>Nombre:&nbsp;</span>{mechanicalSheetDetail.personClient.name}</p>}
					// 					{mechanicalSheetDetail.personClient.dni && <p><span>DNI:&nbsp;</span>{mechanicalSheetDetail.personClient.dni}</p>}
					// 					{mechanicalSheetDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{mechanicalSheetDetail.personClient.cuilCuit}</p>}
					// 					{mechanicalSheetDetail.personClient.email && <p><span>Correo electrónico:&nbsp;</span>{mechanicalSheetDetail.personClient.email}</p>}
					// 					{mechanicalSheetDetail.personClient.phoneWsp.numberPhone ? (
                    //                         <li><span>Whatsapp:&nbsp;</span>+{mechanicalSheetDetail.personClient.phoneWsp.prefix}{mechanicalSheetDetail.personClient.phoneWsp.numberPhone}</li>
                    //                     ) : (
                    //                         <li><span>Whatsapp:&nbsp;</span>No Whatsapp registrado.</li>
                    //                     )} 
                    //                     {mechanicalSheetDetail.personClient.phones?.length > 0 ? (
                    //                         <div>
                    //                             <li>
                    //                                 <span>Teléfonos:&nbsp;</span>
                    //                                 {mechanicalSheetDetail.personClient.phones?.join(', ')}
                    //                             </li>
                    //                         </div>
                    //                     ) : (
                    //                         <li><span>Teléfonos:&nbsp;</span>No tiene teléfono registrado.</li>
                    //                     )}

					// 				</div>
					// 			) : (
					// 				<></>
					// 			)}      
					// 			{mechanicalSheetDetail.companyClient ? (
					// 				<div>
					// 					{mechanicalSheetDetail.companyClient.name && <p><span>Nombre:&nbsp;</span>{mechanicalSheetDetail.companyClient.name}</p>}
					// 					{mechanicalSheetDetail.companyClient.cuit && <p><span>CUIT:&nbsp;</span>{mechanicalSheetDetail.companyClient.cuit}</p>}
					// 					{mechanicalSheetDetail.companyClient.address && <p><span>Dirección:&nbsp;</span>{mechanicalSheetDetail.companyClient.address}</p>}
					// 					{mechanicalSheetDetail.companyClient.email && <p><span>Correo electrónico:&nbsp;</span>{mechanicalSheetDetail.companyClient.email}</p>}
					// 					{mechanicalSheetDetail.companyClient.phoneWsp.numberPhone ? (
                    //                         <li><span>Whatsapp:&nbsp;</span>+{mechanicalSheetDetail.companyClient.phoneWsp.prefix}{mechanicalSheetDetail.companyClient.phoneWsp.numberPhone}</li>
                    //                     ) : (
                    //                         <li><span>Whatsapp:&nbsp;</span>No Whatsapp registrado.</li>
                    //                     )} 
                    //                     {mechanicalSheetDetail.companyClient.phones?.length > 0 ? (
                    //                         <div>
                    //                             <li>
                    //                                 <span>Teléfonos:&nbsp;</span>
                    //                                 {mechanicalSheetDetail.companyClient.phones?.join(', ')}
                    //                             </li>
                    //                         </div>
                    //                     ) : (
                    //                         <li><span>Teléfonos:&nbsp;</span>No tiene teléfono registrado.</li>
                    //                     )}
					// 				</div>
					// 			) : (
					// 				<></>
					// 			)} 
					// 			{mechanicalSheetDetail.vehicle && <p><span>Vehículo:&nbsp;</span></p>}
					// 			{mechanicalSheetDetail.vehicle ? (
					// 				<ul key={mechanicalSheetDetail.vehicle.licensePlate}>
					// 					<li> 
					// 						{mechanicalSheetDetail.vehicle.licensePlate && <p><span>Patente:&nbsp;</span>{mechanicalSheetDetail.vehicle.licensePlate}</p>}
					// 						{mechanicalSheetDetail.vehicle.brand && <p><span>Marca:&nbsp;</span>{mechanicalSheetDetail.vehicle.brand}</p>}
					// 						{mechanicalSheetDetail.vehicle.model && <p><span>Modelo:&nbsp;</span>{mechanicalSheetDetail.vehicle.model}</p>}
					// 						{mechanicalSheetDetail.vehicle.year && <p><span>Año:&nbsp;</span>{mechanicalSheetDetail.vehicle.year}</p>}
					// 						{mechanicalSheetDetail.vehicle.engine && <p><span>Motor:&nbsp;</span>{mechanicalSheetDetail.vehicle.engine}</p>}
					// 					</li>
					// 				</ul>
					// 			) : (
					// 				<p>No hay vehículo registrado.</p>
					// 			)}
					// 			{mechanicalSheetDetail.kilometers && <p><span>Kilómetros:&nbsp;</span>{mechanicalSheetDetail.kilometers}</p>}
					// 			{mechanicalSheetDetail.keyWords && <p><span>Palabras clave:&nbsp;</span>{mechanicalSheetDetail.keyWords}</p>}
					// 			{mechanicalSheetDetail.description && <p><span>Descripción:&nbsp;</span>{mechanicalSheetDetail.description}</p>}
					// 			{mechanicalSheetDetail.amount && <p><span>Monto:&nbsp;$&nbsp;</span>{mechanicalSheetDetail.amount}</p>} 
					// 		</div>
					// 	</div>
					// </div>
				)
			)}
			<div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
				<div onClick={(e) => e.stopPropagation()}>
					<PutMechanicalSheet onMechanicalSheetAdded={() => setPopUpOpen(false)}/>
				</div>
			</div>
			{showDeleteModal ?
                <div className="deleteModal">
                    <div className="deleteModalContainer">
                        <p>{mechanicalSheetDetail.active ? "¿Está seguro que desea archivar esta ficha?" : "¿Está seguro que desea reactivar esta ficha?"}</p>
                        <div className="deleteModalButtons">
                            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                            {mechanicalSheetDetail.active ?
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

export default MechanicalSheetDetail;