import React,{ useState, useEffect } from 'react';
import NewVehicle from './NewVehicle/NewVehicle.jsx';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getVehicles, searchVehicles } from "../../../redux/vehicleActions.js";
import { clearVehiclesReducer } from "../../../redux/vehicleSlice.js";
import detail from "../../../assets/img/detail.png";

const Vehicles = () => {

    const vehicles = useSelector(state => state.vehicle.vehicles);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [licensePlate, setLicensePlate] = useState('');
    const [client, setClient] = useState('');

    useEffect(() => {

        if(!licensePlate && !client && vehicles.length === 0){
            dispatch(getVehicles());
        };

        return () => {
            dispatch(clearVehiclesReducer());
        };

    }, [licensePlate, client, dispatch]);

    //----- ABRIR POPUP

    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- BUSCAR VEHÍCULO

    const handleChangeLicensePlate = (event) => {
        setLicensePlate(event.target.value);
    };

    const handleChangeClient = (event) => {
        setClient(event.target.value);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            if (licensePlate.trim() || client.trim()) {
                dispatch(searchVehicles(licensePlate.trim(), client.trim()));
                setCurrentPage(1);
            }
        }
    };

    const handleInputChange = (event) => {
        if (event.target.value === "") {
            dispatch(clearVehiclesReducer());
            setCurrentPage(1);
        }
    };

    //----- PAGINADO

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const paginatedVehicles = Array.isArray(vehicles) 
    ? vehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

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
                <h2>Vehículos</h2>
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
                                        <span>Patente</span>
                                        <input 
                                            type="search"
                                            name="searchLicensePlate"
                                            onChange={handleChangeLicensePlate}
                                            onKeyDown={handleSearch}
                                            onInput={handleInputChange}
                                            value={licensePlate}
                                            placeholder="Buscar"
                                            autoComplete="off"
                                            className="filterSearch"
                                        />
                                    </div>
                                </th>
                                <th>
                                    Marca
                                </th>
                                <th>
                                    Modelo    
                                </th>
                                <th>
                                    Año    
                                </th>
                                <th>
                                    Motor    
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Cliente</span>
                                        <input 
                                            type="search"
                                            name="searchClient"
                                            onChange={handleChangeClient}
                                            onKeyDown={handleSearch}
                                            onInput={handleInputChange}
                                            value={client}
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
                            {paginatedVehicles?.map(vehicle => (
                                <tr key={vehicle._id}>
                                    <td>{vehicle.licensePlate}</td>
                                    <td>{vehicle.brand}</td>
                                    <td>{vehicle.model}</td>
                                    <td>{vehicle.year}</td>
                                    <td>{vehicle.engine}</td>
                                    <td>{vehicle.personClient ? vehicle.personClient.name : vehicle.companyClient ? vehicle.companyClient.name : 'N/A'}</td>
                                    <td className='center'>
                                        <a onClick={() => navigate(`/main_window/vehiculos/${vehicle._id}`)}>
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
                    <NewVehicle onVehicleAdded={() => setPopUpOpen(false)}/>
                </div>
            </div>
        </div>
    )
};

export default Vehicles;