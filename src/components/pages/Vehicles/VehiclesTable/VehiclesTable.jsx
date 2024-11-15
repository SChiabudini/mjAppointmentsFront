import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../../../../redux/vehicleActions.js";

const VehiclesTable = () => {

    const vehicles = useSelector(state => state.vehicle.vehicles);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 20;

    useEffect(() => {

        if(vehicles.length === 0){
            dispatch(getVehicles());
        }

    }, [dispatch]);

    const paginatedVehicles = vehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
        <div className="component">
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
            </div>
            <div className="container">
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    Patente
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
                                    Cliente    
                                </th>
                                <th>
                                    Detalle    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedVehicles.map(vehicle => (
                                <tr key={vehicle._id}>
                                    <td>{vehicle.licensePlate}</td>
                                    <td>{vehicle.brand}</td>
                                    <td>{vehicle.model}</td>
                                    <td>{vehicle.year}</td>
                                    <td>{vehicle.engine}</td>
                                    <td>{vehicle.personClient ? vehicle.personClient.name : vehicle.companyClient ? vehicle.companyClient.name : 'N/A'}</td>
                                    <td>Detalle</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default VehiclesTable;