import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompanyClients, searchCompanyClients } from "../../../../redux/companyClientActions.js";
import { clearCompanyClientsReducer } from "../../../../redux/companyClientSlice.js";
import detail from "../../../../assets/img/detail.png";
import NewCompanyClient from './NewCompanyClient/NewCompanyClient.jsx';

const CompanyClients = () => {

    const companyClients = useSelector(state => state.companyClient.companyClients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cuit, setCuit] = useState('');
    const [name, setName] = useState('');
    const [vehicle, setVehicle] = useState('');

    useEffect(() => {

        if(!cuit && !name && !vehicle && companyClients.length === 0){
            dispatch(getCompanyClients());
        };

        return () => {
            dispatch(clearCompanyClientsReducer());
        };

    }, [cuit, name, vehicle, dispatch]);

    //----- ABRIR POPUP

    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- BUSCAR CLIENTE

    const handleChangeCuit = (event) => {
        setCuit(event.target.value);
    };

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeVehicle = (event) => {
        setVehicle(event.target.value);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            if (cuit.trim() || name.trim() || vehicle.trim()) {
                dispatch(searchCompanyClients(cuit.trim(), name.trim(), vehicle.trim()));
                setCurrentPage(1);
            }
        }
    };

    const handleInputChange = (event) => {
        if (event.target.value === "") {
            dispatch(clearCompanyClientsReducer());
            setCurrentPage(1);
        }
    };

    //----- PAGINADO

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const paginatedCompanyClients = Array.isArray(companyClients)
    ? companyClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];
    const totalPages = Math.ceil(companyClients.length / itemsPerPage);
    
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
                <h2>Clientes (Empresas)</h2>
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
                                        <span>CUIT</span>
                                        <input 
                                            type="search"
                                            name="searchCuit"
                                            onChange={handleChangeCuit}
                                            onKeyDown={handleSearch}
                                            onInput={handleInputChange}
                                            value={cuit}
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
                                    Teléfonos    
                                </th>
                                <th>
                                    Dirección    
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
                                <th>
                                    Detalle    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCompanyClients.map(companyClient => (
                                <tr key={companyClient._id}>
                                    <td>{companyClient.cuit}</td>
                                    <td>{companyClient.name}</td>
                                    <td>{companyClient.email}</td>
                                    <td>
                                        {companyClient.phones.length 
                                            ? companyClient.phones.join(', ') 
                                            : 'N/A'}
                                    </td>
                                    <td>{companyClient.address ? companyClient.address : 'N/A'}</td>
                                    <td>
                                        {companyClient.vehicles.length 
                                            ? companyClient.vehicles.map(vehicle => vehicle.licensePlate).join(', ') 
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        <a onClick={() => navigate(`/main_window/clientes/empresas/${companyClient._id}`)}>
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
                <NewCompanyClient onClientAdded={() => setPopUpOpen(false)}/>
              </div>
            </div>
        </div>
    )
};

export default CompanyClients;