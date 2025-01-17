import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonClientById } from '../../../../../redux/personClientActions.js';
import PutPersonClient from '../PutPersonClient/PutPersonClient.jsx';

const PersonClientDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const personClientDetail = useSelector(state => state.personClient.personClientDetail); 

    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);    
    const [popUpOpen, setPopUpOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(getPersonClientById(id));
            setLoading(false);
        };
        fetchData();
    }, [dispatch, id]);

    // if (loading) {
    //     return <div>Cargando...</div>;
    // };

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
                            <h2>Detalle del Cliente</h2>
                            <div className="titleButtons">
                                {/* {personClientDetail.active ? <button onClick={() => navigate(`/main_window/clientes/personas/edit/${id}`)}>Editar</button> : ''} */}
                                {personClientDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                {!personClientDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                                <button onClick={() => navigate(`/main_window/clientes/personas`)}>Atrás</button>
                            </div>
                        </div>
                        {/* <div className={!personClientDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                        <div>
                            <div>
                            {/* <div className={style.column}> */}
                                <p><span>Estado:&nbsp;</span>{personClientDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {personClientDetail.dni && <p><span>DNI:&nbsp;</span>{personClientDetail.dni}</p>}
                                {personClientDetail.cuilCuit && <p><span>CUIL/CUIT:&nbsp;</span>{personClientDetail.cuilCuit}</p>}
                                {personClientDetail.name && <p><span>Nombre:&nbsp;</span>{personClientDetail.name}</p>}
                                {personClientDetail.phoneWsp ? (
                                    <p><span>Whatsapp:&nbsp;</span>+{personClientDetail.phoneWsp}</p>
                                ) : (
                                    <p>No hay teléfono con Whatsapp registrado.</p>
                                )}  
                                {personClientDetail.phones && <p><span>Teléfono:&nbsp;</span></p>}
                                {personClientDetail.phones?.length > 0 ? (
                                    <div>
                                        {personClientDetail.phones?.map((phone, index) => (
                                            <ul key={index}>
                                                <li> 
                                                    <p><span>{phone}</span></p>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay teléfono registrado.</p>
                                )}       
                                {personClientDetail.email && <p><span>Correo electrónico:&nbsp;</span>{personClientDetail.email}</p>}
                                {personClientDetail.vehicles && <p><span>Vehículos:&nbsp;</span></p>}
                                {personClientDetail.vehicles?.length > 0 ? (
                                    <div>
                                        {personClientDetail.vehicles?.map((vehicle) => (
                                            <ul key={vehicle.licensePlate}>
                                                <li> 
                                                    <p><span>{vehicle.licensePlate}</span></p>
                                                    <p><span>{vehicle.brand}</span></p>
                                                    <p><span>{vehicle.model}</span></p>
                                                    <p><span>{vehicle.year}</span></p>
                                                    <p><span>{vehicle.engine}</span></p>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay vehículos disponibles.</p>
                                )}  
                                {(personClientDetail.serviceSheets?.length > 0 || personClientDetail.mechanicalSheets?.length > 0) && (
                                    <p><span>Fichas:&nbsp;</span></p>
                                )}
                                {personClientDetail.serviceSheets?.length > 0 ? (
                                    <div>
                                        <p><span>Service:&nbsp;</span></p>
                                        {personClientDetail.serviceSheets?.map((serviceSheet, index) => (
                                            <ul key={index}>
                                                <li>
                                                    <p><span>{new Date(serviceSheet.date).toLocaleString('es-ES', { 
                                                        day: '2-digit', 
                                                        month: '2-digit', 
                                                        year: '2-digit', 
                                                        hour: '2-digit', 
                                                        minute: '2-digit', 
                                                    })}</span></p>
                                                    <p><span>{serviceSheet.vehicle?.licensePlate}</span></p>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay fichas de service registradas.</p>
                                )}
                                {personClientDetail.mechanicalSheets?.length > 0 ? (
                                    <div>
                                        <p><span>Mecánica:&nbsp;</span></p>
                                        {personClientDetail.mechanicalSheets?.map((mechanicalSheet, index) => (
                                            <ul key={index}>
                                                <li>
                                                    <p><span>{new Date(mechanicalSheet.date).toLocaleString('es-ES', { 
                                                        day: '2-digit', 
                                                        month: '2-digit', 
                                                        year: '2-digit', 
                                                        hour: '2-digit', 
                                                        minute: '2-digit', 
                                                    })}</span></p>
                                                    <p><span>{mechanicalSheet.vehicle?.licensePlate}</span></p>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No hay fichas mecánicas registradas.</p>
                                )} 
                            </div>
                        </div>
                    </div>
                {/* ) */}
            {/* } */}
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <PutPersonClient onClientAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
    )
};

export default PersonClientDetail;