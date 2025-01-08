import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyClientById } from '../../../../../redux/companyClientActions';
import PutCompanyClient from '../PutCompanyClient/PutCompanyClient.jsx';

const CompanyClientDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const companyClientDetail = useSelector(state => state.companyClient.companyClientDetail); 

    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);    

    useEffect(() => {
        dispatch(getCompanyClientById(id))
    }, [dispatch, id]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(getCompanyClientById(id));
            setLoading(false);
        };
        fetchData();
    }, [dispatch, id]);

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
                            <h2>Detalle de la empresa</h2>
                            <div className="titleButtons">
                                {companyClientDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                {!companyClientDetail.active ? <button className="add" onClick={toggleShowDeleteModal}>Activar</button> : <button className="delete" onClick={toggleShowDeleteModal}>Desactivar</button>}
                                <button onClick={() => navigate(`/main_window/clientes/empresas`)}>Atrás</button>
                            </div>
                        </div>
                        {/* <div className={!companyClientDetail.active ? `container ${style.contentInactive}` : `container ${style.content}`}> */}
                        <div>
                            <div>
                            {/* <div className={style.column}> */}
                                <p><span>Estado:&nbsp;</span>{companyClientDetail.active ? 'Activo' : 'Inactivo'}</p>
                                {companyClientDetail.cuit && <p><span>CUIT:&nbsp;</span>{companyClientDetail.cuit}</p>}
                                {companyClientDetail.name && <p><span>Nombre:&nbsp;</span>{companyClientDetail.name}</p>}
                                {companyClientDetail.phones && <p><span>Teléfono:&nbsp;</span></p>}
                                {companyClientDetail.phones?.length > 0 ? (
                                    <div>
                                        {companyClientDetail.phones?.map((phone, index) => (
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
                                {companyClientDetail.email && <p><span>Correo electrónico:&nbsp;</span>{companyClientDetail.email}</p>}
                                {companyClientDetail.address && <p><span>Dirección:&nbsp;</span>{companyClientDetail.address}</p>}
                                {companyClientDetail.vehicles && <p><span>Vehículos:&nbsp;</span></p>}
                                {companyClientDetail.vehicles?.length > 0 ? (
                                    <div>
                                        {companyClientDetail.vehicles?.map((vehicle) => (
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
                                {(companyClientDetail.serviceSheets?.length > 0 || companyClientDetail.mechanicalSheets?.length > 0) && (
                                    <p><span>Fichas:&nbsp;</span></p>
                                )}
                                {companyClientDetail.serviceSheets?.length > 0 ? (
                                    <div>
                                        <p><span>Service:&nbsp;</span></p>
                                        {companyClientDetail.serviceSheets?.map((serviceSheet, index) => (
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
                                {companyClientDetail.mechanicalSheets?.length > 0 ? (
                                    <div>
                                        <p><span>Mecánica:&nbsp;</span></p>
                                        {companyClientDetail.mechanicalSheets?.map((mechanicalSheet, index) => (
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
                <PutCompanyClient onClientAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
    )
};

export default CompanyClientDetail;