import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import NewCompanyClient from './NewCompanyClient/NewCompanyClient.jsx';
import Error from "../../Error/Error.jsx";
import { clearCompanyClientsReducer } from "../../../../redux/companyClientSlice.js";
import { getCompanyClients, searchCompanyClients } from "../../../../redux/companyClientActions.js";
import detail from "../../../../assets/img/detail.png";
import loadingGif from "../../../../assets/img/loading.gif";

const CompanyClients = () => {

    const companyClients = useSelector(state => state.companyClient.companyClients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cuit, setCuit] = useState('');
    const [name, setName] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {

        if(!cuit && !name && !vehicle){
            dispatch(getCompanyClients())
            .catch(() => setError(true));
        };

        return () => {
            dispatch(clearCompanyClientsReducer());
        };

    }, [cuit, name, vehicle, dispatch]);

    //----- ABRIR POPUP

    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- BUSCAR CLIENTE

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            if (cuit.trim() || name.trim() || vehicle.trim()) {
                setLoading(true);
                dispatch(searchCompanyClients(cuit.trim(), name.trim(), vehicle.trim())).then(() => setLoading(false));
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
            {error ? (
                <Error />
            ) : (
                <>
                    <div className="title">
                        <h2>Empresas</h2>
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
                                                    onChange={(event) => setCuit(event.target.value)}
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
                                            Dirección    
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
                                            {paginatedCompanyClients?.map(companyClient => (
                                                <tr key={companyClient._id}>
                                                    <td>{companyClient.cuit}</td>
                                                    <td>{companyClient.name}</td>
                                                    <td>{companyClient.email}</td>
                                                    <td>+{companyClient.phoneWsp.prefix}{companyClient.phoneWsp.numberPhone}</td>
                                                    <td>
                                                        {companyClient.phones?.length 
                                                            ? companyClient?.phones.join(', ') 
                                                            : 'N/A'}
                                                    </td>
                                                    <td>{companyClient.address ? companyClient.address : 'N/A'}</td>
                                                    <td>
                                                        {companyClient.vehicles?.length 
                                                            ? companyClient.vehicles?.map(vehicle => vehicle.licensePlate).join(', ') 
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="center">
                                                        <a onClick={() => navigate(`/main_window/clientes/empresas/${companyClient._id}`)}>
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
                        <NewCompanyClient onClientAdded={() => setPopUpOpen(false)}/>
                    </div>
                    </div>
                </>
            )}
        </div>
    )
};

export default CompanyClients;