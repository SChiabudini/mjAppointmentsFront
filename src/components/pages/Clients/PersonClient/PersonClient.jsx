import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import NewPersonClient from './NewPersonClient/NewPersonClient.jsx';
import Error from "../../Error/Error.jsx";
import { clearPersonClientsReducer } from "../../../../redux/personClientSlice.js";
import { getAllPersonClients, getPersonClients, searchPersonClients, searchAllPersonClients } from "../../../../redux/personClientActions.js";
import detail from "../../../../assets/img/detail.png";
import loadingGif from "../../../../assets/img/loading.gif";

const PersonClients = () => {

    const personClients = useSelector(state => state.personClient.personClients);
    const allPersonClients = useSelector(state => state.personClient.personClientsAll);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [dni, setDni] = useState('');
    const [name, setName] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {

        if(!dni && !name && !vehicle){
            if(showAll){
                dispatch(getAllPersonClients())
                .catch(() => setError(true));
            } else{
                dispatch(getPersonClients())
                .catch(() => setError(true));
            }
        };

        return () => {
            dispatch(clearPersonClientsReducer());
        };

    }, [dni, name, vehicle, dispatch, showAll]);

    //----- ABRIR POPUP

    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- BUSCAR CLIENTE

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            if (dni.trim() || name.trim() || vehicle.trim()) {
                setLoading(true);
                if(showAll){
                    dispatch(searchAllPersonClients(dni.trim(), name.trim(), vehicle.trim())).then(() => setLoading(false));
                } else{
                    dispatch(searchPersonClients(dni.trim(), name.trim(), vehicle.trim())).then(() => setLoading(false));
                }                
                setCurrentPage(1);
            }
        }
    };

    const handleInputChange = (event) => {
        if (event.target.value === "") {
            dispatch(clearPersonClientsReducer());
            setCurrentPage(1);
        }
    };

    //----- PAGINADO

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [paginatedPersonClients, setPaginatedPersonClients] = useState([]);
    
    useEffect(() => {
        if (Array.isArray(personClients)) {
            const newPaginatedPersonClients = !showAll
                ? personClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                : allPersonClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
            // Evita actualizar el estado si no hay cambios
            setPaginatedPersonClients((prev) => {
                const prevStringified = JSON.stringify(prev);
                const newStringified = JSON.stringify(newPaginatedPersonClients);
    
                return prevStringified === newStringified ? prev : newPaginatedPersonClients;
            });
        }
    }, [personClients, showAll, currentPage, itemsPerPage, allPersonClients]);
    const totalPages = Math.ceil(personClients.length / itemsPerPage);
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPageButtons = () => {
        const buttons = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pageButton ${currentPage === i ? 'currentPage' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    //----- MOSTRAR TODOS
    
    const handleAll = async () => {
        if(allPersonClients?.length === 0){
            setLoading(true);
            dispatch(getAllPersonClients()).then(() => setLoading(false));
        }
        setShowAll(!showAll);
    }

    return(
        <div className="page">
            {error ? (
                <Error />
            ) : (
                <>
                    <div className="title">
                        <h2>Personas</h2>
                        <div className="pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                ◂
                            </button>
                            {getPageButtons()}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                ▸
                            </button>
                            
                        </div>
                        <div className="titleButtons">
                            <label className="showAll">
                                <input
                                    type="checkbox"
                                    name="showAll"
                                    onChange={handleAll}
                                />
                                Mostrar todos
                            </label>
                            <button onClick={() => setPopUpOpen(true)}>Nuevo</button>
                        </div>
                    </div>
                    <div className="container">
                        <div className="tableContainer">
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="withFilter">
                                                <span>DNI</span>
                                                <input 
                                                    type="search"
                                                    name="searchDni"
                                                    onChange={(event) => setDni(event.target.value)}
                                                    onKeyDown={handleSearch}
                                                    onInput={handleInputChange}
                                                    value={dni}
                                                    placeholder="Buscar"
                                                    autoComplete="off"
                                                    className="filterSearch"
                                                />
                                            </div>
                                        </th>
                                        <th>
                                            <div className="withFilter">
                                                <span>Nombre</span>
                                                <input 
                                                    type="search"
                                                    name="searchName"
                                                    onChange={(event) => setName(event.target.value)}
                                                    onKeyDown={handleSearch}
                                                    onInput={handleInputChange}
                                                    value={name}
                                                    placeholder="Buscar"
                                                    autoComplete="off"
                                                    className="filterSearch"
                                                />
                                            </div>
                                        </th>
                                        <th>
                                            Email    
                                        </th>
                                        <th>
                                            Whatsapp    
                                        </th>
                                        <th>
                                            Teléfonos    
                                        </th>
                                        <th>
                                            Cuit/Cuil    
                                        </th>
                                        <th>
                                            <div className="withFilter">
                                                <span>Vehículos</span>
                                                <input 
                                                    type="search"
                                                    name="searchVehicle"
                                                    onChange={(event) => setVehicle(event.target.value)}
                                                    onKeyDown={handleSearch}
                                                    onInput={handleInputChange}
                                                    value={vehicle}
                                                    placeholder="Buscar"
                                                    autoComplete="off"
                                                    className="filterSearch"
                                                />
                                            </div>
                                        </th>
                                        <th className="center">
                                            Detalle    
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="loadingCell">
                                                <div className="loadingPage">
                                                    <img src={loadingGif} alt="" />
                                                    <p>Cargando</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {paginatedPersonClients?.map(personClient => (
                                                <tr key={personClient._id} className={`${!personClient.active ? 'disabled' : ''}`}>
                                                    <td>{personClient.dni}</td>
                                                    <td>{personClient.name}</td>
                                                    <td>{personClient.email}</td>
                                                    <td>
                                                        {personClient.phoneWsp.numberPhone ? (
                                                            `+${personClient.phoneWsp.prefix}${personClient.phoneWsp.numberPhone}`
                                                        ) : (
                                                            'Sin Whatsapp'
                                                        )} 
                                                    </td>
                                                    <td>
                                                        {personClient.phones?.length 
                                                            ? personClient.phones.join(', ') 
                                                            : 'No disponible'}
                                                    </td>
                                                    <td>{personClient.cuilCuit ? personClient.cuilCuit : 'No disponible'}</td>
                                                    <td>
                                                        {personClient.vehicles?.length 
                                                            ? personClient.vehicles?.map(vehicle => vehicle.licensePlate).join(', ') 
                                                            : 'No disponible'}
                                                    </td>
                                                    <td className="center">
                                                        <a onClick={() => navigate(`/main_window/clientes/personas/${personClient._id}`)}>
                                                            <img src={detail} alt="" className="detailImg" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <NewPersonClient onClientAdded={() => setPopUpOpen(false)}/>
                    </div>
                    </div>
                </>
            )}
        </div>
    )
};

export default PersonClients;