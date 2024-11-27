import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompanyClients } from "../../../../../redux/companyClientActions.js";
import detail from "../../../../../assets/img/detail.png";

const CompanyClientsTable = () => {

    const companyClients = useSelector(state => state.companyClient.companyClients);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    
    const itemsPerPage = 20;

    useEffect(() => {

        if(companyClients.length === 0){
            dispatch(getCompanyClients());
        }

    }, [dispatch]);

    const paginatedCompanyClients = companyClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
        <div className="component">
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
            </div>
            <div className="container">
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    CUIT
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
                                    Dirección    
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
        </div>
    )
};

export default CompanyClientsTable;