import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById } from '../../../../redux/vehicleActions';

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
                            <h2>Detalle del vehículo</h2>
                            <div className="titleButtons">
                                {/* {vehicleDetail.active ? <button onClick={() => navigate(`/main_window/clientes/personas/${id}`)}>Editar</button> : ''} */}
                                {!vehicleDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                                <button onClick={() => navigate(`/main_window/vehiculos`)}>Atrás</button>
                            </div>
                        </div>
                        {/* <div className={!vehicleDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                        <div>
                            <div>
                            {/* <div className={style.column}> */}
                                <p><span>Estado:&nbsp;</span>{vehicleDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {vehicleDetail.licensePlate && <p><span>Patente:&nbsp;</span>{vehicleDetail.licensePlate}</p>}
                                {vehicleDetail.brand && <p><span>Marca:&nbsp;</span>{vehicleDetail.brand}</p>}
                                {vehicleDetail.model && <p><span>Modelo:&nbsp;</span>{vehicleDetail.model}</p>}
                                {vehicleDetail.year && <p><span>Año:&nbsp;</span>{vehicleDetail.year}</p>}
                                {vehicleDetail.engine && <p><span>Motor:&nbsp;</span>{vehicleDetail.engine}</p>}    
                                {(vehicleDetail.personClient || vehicleDetail.companyClient) && (
                                    <p><span>Cliente:&nbsp;</span></p>
                                )}                 
                                {vehicleDetail.personClient ? (
                                    <div>
                                        {vehicleDetail.personClient.name && <p><span>Nombre:&nbsp;</span>{vehicleDetail.personClient.name}</p>}
                                        {vehicleDetail.personClient.dni && <p><span>DNI:&nbsp;</span>{vehicleDetail.personClient.dni}</p>}
                                        {vehicleDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{vehicleDetail.personClient.cuilCuit}</p>}
                                        {vehicleDetail.personClient.email && <p><span>Correo electrónico:&nbsp;</span>{vehicleDetail.personClient.email}</p>}
                                        {vehicleDetail.personClient.phones?.length > 0 ? (
                                            <div>
                                                <p><span>Teléfonos:&nbsp;</span></p>
                                                {vehicleDetail.personClient.phones?.map((phone, index) => (
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
                                {vehicleDetail.companyClient ? (
                                    <div>
                                        {vehicleDetail.companyClient.name && <p><span>Nombre:&nbsp;</span>{vehicleDetail.companyClient.name}</p>}
                                        {vehicleDetail.companyClient.cuit && <p><span>CUIT:&nbsp;</span>{vehicleDetail.companyClient.cuit}</p>}
                                        {vehicleDetail.companyClient.address && <p><span>Dirección:&nbsp;</span>{vehicleDetail.companyClient.address}</p>}
                                        {vehicleDetail.companyClient.email && <p><span>Correo electrónico:&nbsp;</span>{vehicleDetail.companyClient.email}</p>}
                                        {vehicleDetail.companyClient.phones?.length > 0 ? (
                                            <div>
                                                <p><span>Teléfonos:&nbsp;</span></p>
                                                {vehicleDetail.companyClient.phones?.map((phone, index) => (
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
                                {(vehicleDetail.serviceSheets?.length > 0 || vehicleDetail.mechanicalSheets?.length > 0) && (
                                    <p><span>Fichas:&nbsp;</span></p>
                                )}
                                {vehicleDetail.serviceSheets?.length > 0 ? (
                                    <div>
                                        <p><span>Service:&nbsp;</span></p>
                                        {vehicleDetail.serviceSheets?.map((serviceSheet, index) => (
                                            <ul key={index}>
                                                <li>
                                                    {serviceSheet.number && <p><span>Número de ficha:&nbsp;</span>{serviceSheet.number}</p>}
                                                    {serviceSheet.date && 
                                                        <p><span>{new Date(serviceSheet.date).toLocaleString('es-ES', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: '2-digit', 
                                                            hour: '2-digit', 
                                                            minute: '2-digit', 
                                                        })}</span></p>
                                                    }
                                                    {serviceSheet.kilometers && <p><span>Kilómetros:&nbsp;</span>{serviceSheet.kilometers}</p>}
                                                    {serviceSheet.kmsToNextService && <p><span>Kilómetros hasta el siguiente service:&nbsp;</span>{serviceSheet.kmsToNextService}</p>}
                                                    {serviceSheet.oil && <p><span>Aceite:&nbsp;</span>{serviceSheet.oil}</p>}
                                                    {serviceSheet.filters?.length > 0 ? (
                                                        <div>
                                                            <p><span>Filtros:&nbsp;</span></p>
                                                            {serviceSheet.filters?.map((filter, index) => (
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
                                                    {serviceSheet.notes && <p><span>Notas:&nbsp;</span>{serviceSheet.notes}</p>}
                                                    {serviceSheet.amount && <p><span>Monto:&nbsp;$&nbsp;</span>{serviceSheet.amount}</p>}                                                   
                                                    <p><span>{serviceSheet.vehicle?.licensePlate}</span></p>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay fichas de service registradas.</p>
                                )}
                                {vehicleDetail.mechanicalSheets?.length > 0 ? (
                                    <div>
                                        <p><span>Mecánica:&nbsp;</span></p>
                                        {vehicleDetail.mechanicalSheets?.map((mechanicalSheet, index) => (
                                            <ul key={index}>
                                                <li>
                                                    {mechanicalSheet.number && <p><span>Número de ficha:&nbsp;</span>{mechanicalSheet.number}</p>}
                                                    {mechanicalSheet.date && 
                                                        <p><span>{new Date(mechanicalSheet.date).toLocaleString('es-ES', { 
                                                            day: '2-digit', 
                                                            month: '2-digit', 
                                                            year: '2-digit', 
                                                            hour: '2-digit', 
                                                            minute: '2-digit', 
                                                        })}</span></p>
                                                    }
                                                    {mechanicalSheet.kilometers && <p><span>Kilómetros:&nbsp;</span>{mechanicalSheet.kilometers}</p>}
                                                    {mechanicalSheet.keyWords && <p><span>Palabras clave:&nbsp;</span>{mechanicalSheet.keyWords}</p>}
                                                    {mechanicalSheet.description && <p><span>Descripción:&nbsp;</span>{mechanicalSheet.description}</p>}
                                                    {mechanicalSheet.amount && <p><span>Monto:&nbsp;$&nbsp;</span>{mechanicalSheet.amount}</p>}                                                   
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay fichas de mecánica registradas.</p>
                                )} 
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

export default VehicleDetail;