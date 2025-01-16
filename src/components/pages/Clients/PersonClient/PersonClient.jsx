import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPersonClients, searchPersonClients } from "../../../../redux/personClientActions.js";
import { clearPersonClientsReducer } from "../../../../redux/personClientSlice.js";
import NewPersonClient from './NewPersonClient/NewPersonClient.jsx';
import detail from "../../../../assets/img/detail.png";

const PersonClients = () => {

    const personClients = useSelector(state => state.personClient.personClients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [dni, setDni] = useState('');
    const [name, setName] = useState('');
    const [vehicle, setVehicle] = useState('');

    useEffect(() => {

        if(!dni && !name && !vehicle){
            dispatch(getPersonClients());
        };

        return () => {
            dispatch(clearPersonClientsReducer());
        };

    }, [dni, name, vehicle, dispatch]);

    //----- ABRIR POPUP

    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- BUSCAR CLIENTE

    const handleChangeDni = (event) => {
        setDni(event.target.value);
    };

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeVehicle = (event) => {
        setVehicle(event.target.value);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            if (dni.trim() || name.trim() || vehicle.trim()) {
                dispatch(searchPersonClients(dni.trim(), name.trim(), vehicle.trim()));
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
    const paginatedPersonClients = Array.isArray(personClients)
    ? personClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];
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

    return(
        <div className="page">
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
                <button onClick={() => setPopUpOpen(true)}>Nuevo</button>
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
                                            onChange={handleChangeDni}
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
                                            onChange={handleChangeName}
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
                                            onChange={handleChangeVehicle}
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
                            {paginatedPersonClients?.map(personClient => (
                                <tr key={personClient._id}>
                                    <td>{personClient.dni}</td>
                                    <td>{personClient.name}</td>
                                    <td>{personClient.email}</td>
                                    <td>{personClient.phoneWsp}</td>
                                    <td>
                                        {personClient.phones?.length 
                                            ? personClient.phones.join(', ') 
                                            : 'N/A'}
                                    </td>
                                    <td>{personClient.cuilCuit ? personClient.cuilCuit : 'N/A'}</td>
                                    <td>
                                        {personClient.vehicles?.length 
                                            ? personClient.vehicles.map(vehicle => vehicle.licensePlate).join(', ') 
                                            : 'N/A'}
                                    </td>
                                    <td className="center">
                                        <a onClick={() => navigate(`/main_window/clientes/personas/${personClient._id}`)}>
                                            <img src={detail} alt="" className="detailImg" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
              <div onClick={(e) => e.stopPropagation()}>
                <NewPersonClient onClientAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
    )
};

export default PersonClients;