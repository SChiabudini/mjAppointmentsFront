import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getMechanicalSheetById } from '../../../../redux/mechanicalSheetActions';

const MechanicalSheetDetail = () => {

  	let { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getMechanicalSheetById(id))
	}, [dispatch, id]);

	const mechanicalSheetDetail = useSelector(state => state.mechanicalSheet?.mechanicalSheetDetail || {});    
	// console.log(mechanicalSheetDetail);

	const [loading, setLoading] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);        
	
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await dispatch(getMechanicalSheetById(id));
			setLoading(false);
		};
		fetchData();
	}, [dispatch, id]);

	if (loading) {
		return <div>Cargando...</div>;
	};
	
	const toggleShowDeleteModal = () => {
		setShowDeleteModal(!showDeleteModal);
	};

	return (
		<div className="page">
				{/* {
					loading ? (
						<div>Cargando</div>
					) : ( */}
						<div className="component">
							<div className="title">
								<h2>Detalle de la ficha mecánica</h2>
								<div className="titleButtons">
									{/* {mechanicalSheetDetail.active ? <button onClick={() => navigate(`/main_window/clientes/personas/${id}`)}>Editar</button> : ''} */}
									{!mechanicalSheetDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
									<button onClick={() => navigate(`/main_window/fichas`)}>Atrás</button>
								</div>
							</div>
							{/* <div className={!mechanicalSheetDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
							<div>
								<div>
								{/* <div className={style.column}> */}
									{/* <p><span>Estado:&nbsp;</span>{mechanicalSheetDetail.active ? 'Activo' : 'Inactivo'}</p> */}
									{mechanicalSheetDetail.number && <p><span>Número de ficha:&nbsp;</span>{mechanicalSheetDetail.number}</p>}
									{mechanicalSheetDetail.date && <p><span>Fecha:&nbsp;</span></p>}
									<p><span>{new Date(mechanicalSheetDetail.date).toLocaleString('es-ES', { 
										day: '2-digit', 
										month: '2-digit', 
										year: '2-digit', 
										hour: '2-digit', 
										minute: '2-digit', 
									})}</span></p>
									{(mechanicalSheetDetail.personClient || mechanicalSheetDetail.companyClient) && (
										<p><span>Cliente:&nbsp;</span></p>
									)}                 
									{mechanicalSheetDetail.personClient ? (
										<div>
											{mechanicalSheetDetail.personClient.name && <p><span>Nombre:&nbsp;</span>{mechanicalSheetDetail.personClient.name}</p>}
											{mechanicalSheetDetail.personClient.dni && <p><span>DNI:&nbsp;</span>{mechanicalSheetDetail.personClient.dni}</p>}
											{mechanicalSheetDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{mechanicalSheetDetail.personClient.cuilCuit}</p>}
											{mechanicalSheetDetail.personClient.email && <p><span>Correo electrónico:&nbsp;</span>{mechanicalSheetDetail.personClient.email}</p>}
											{mechanicalSheetDetail.personClient.phones?.length > 0 ? (
												<div>
													<p><span>Teléfonos:&nbsp;</span></p>
													{mechanicalSheetDetail.personClient.phones?.map((phone, index) => (
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
									{mechanicalSheetDetail.companyClient ? (
										<div>
											{mechanicalSheetDetail.companyClient.name && <p><span>Nombre:&nbsp;</span>{mechanicalSheetDetail.companyClient.name}</p>}
											{mechanicalSheetDetail.companyClient.cuit && <p><span>CUIT:&nbsp;</span>{mechanicalSheetDetail.companyClient.cuit}</p>}
											{mechanicalSheetDetail.companyClient.address && <p><span>Dirección:&nbsp;</span>{mechanicalSheetDetail.companyClient.address}</p>}
											{mechanicalSheetDetail.companyClient.email && <p><span>Correo electrónico:&nbsp;</span>{mechanicalSheetDetail.companyClient.email}</p>}
											{mechanicalSheetDetail.companyClient.phones?.length > 0 ? (
												<div>
													<p><span>Teléfonos:&nbsp;</span></p>
													{mechanicalSheetDetail.companyClient.phones?.map((phone, index) => (
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
									{mechanicalSheetDetail.vehicle && <p><span>Vehículo:&nbsp;</span></p>}
									{mechanicalSheetDetail.vehicle ? (
										<ul key={mechanicalSheetDetail.vehicle.licensePlate}>
											<li> 
												{mechanicalSheetDetail.vehicle.licensePlate && <p><span>Patente:&nbsp;</span>{mechanicalSheetDetail.vehicle.licensePlate}</p>}
												{mechanicalSheetDetail.vehicle.brand && <p><span>Marca:&nbsp;</span>{mechanicalSheetDetail.vehicle.brand}</p>}
												{mechanicalSheetDetail.vehicle.model && <p><span>Modelo:&nbsp;</span>{mechanicalSheetDetail.vehicle.model}</p>}
												{mechanicalSheetDetail.vehicle.year && <p><span>Año:&nbsp;</span>{mechanicalSheetDetail.vehicle.year}</p>}
												{mechanicalSheetDetail.vehicle.engine && <p><span>Motor:&nbsp;</span>{mechanicalSheetDetail.vehicle.engine}</p>}
											</li>
										</ul>
									) : (
										<p>No hay vehículo registrado.</p>
									)}
									{mechanicalSheetDetail.kilometers && <p><span>Kilómetros:&nbsp;</span>{mechanicalSheetDetail.kilometers}</p>}
									{mechanicalSheetDetail.keyWords && <p><span>Palabras clave:&nbsp;</span>{mechanicalSheetDetail.keyWords}</p>}
									{mechanicalSheetDetail.description && <p><span>Descripción:&nbsp;</span>{mechanicalSheetDetail.description}</p>}
									{mechanicalSheetDetail.amount && <p><span>Monto:&nbsp;$&nbsp;</span>{mechanicalSheetDetail.amount}</p>} 
								</div>
							</div>
						</div>
					{/* ) */}
				{/* } */}
				<div>
				</div>
		</div>
	)
};

export default MechanicalSheetDetail;