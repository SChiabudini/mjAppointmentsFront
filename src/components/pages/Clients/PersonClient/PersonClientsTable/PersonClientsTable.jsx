import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPersonClients } from "../../../../../redux/personClientActions.js";

const PersonClientsTable = () => {

    const personClients = useSelector(state => state.personClient.personClients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 20;

    useEffect(() => {

        if(personClients.length === 0){
            dispatch(getPersonClients());
        }

    }, [dispatch]);

    const paginatedPersonClients = personClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
        <div className="component">
            <div className="title">
                <h2>Clientes (Personas)</h2>
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
                                    DNI
                                </th>
                                <th>
                                    Nombre
                                </th>
                                <th>
                                    Email    
                                </th>
                                <th>
                                    Teléfonos    
                                </th>
                                <th>
                                    Cuit/Cuil    
                                </th>
                                <th>
                                    Vehículos    
                                </th>
                                <th>
                                    Detalle    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPersonClients.map(personClient => (
                                <tr key={personClient._id}>
                                    <td>{personClient.dni}</td>
                                    <td>{personClient.name}</td>
                                    <td>{personClient.email}</td>
                                    <td>
                                        {personClient.phones.length 
                                            ? personClient.phones.join(', ') 
                                            : 'N/A'}
                                    </td>
                                    <td>{personClient.cuilCuit ? cpersonClient.cuilCuit : 'N/A'}</td>
                                    <td>
                                        {personClient.vehicles.length 
                                            ? personClient.vehicles.map(vehicle => vehicle.licensePlate).join(', ') 
                                            : 'N/A'}
                                    </td>
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

export default PersonClientsTable;