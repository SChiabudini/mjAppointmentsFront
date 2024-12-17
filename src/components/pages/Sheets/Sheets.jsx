import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getServiceSheets, searchServiceSheets } from "../../../redux/serviceSheetActions.js";
import { getProcedureSheets, searchProcedureSheets } from "../../../redux/procedureSheetActions.js";
import { clearServiceSheetsReducer } from "../../../redux/serviceSheetSlice.js";
import { clearProcedureSheetsReducer } from '../../../redux/procedureSheetSlice.js';
import detail from "../../../assets/img/detail.png";

const Sheets = () => {

    const serviceSheets = useSelector(state => state.serviceSheet.serviceSheets);
    const procedureSheets = useSelector(state => state.procedureSheet.procedureSheets);
    const sheets = [...serviceSheets, ...procedureSheets].sort((a, b) => new Date(b.date) - new Date(a.date));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [number, setNumber] = useState('');
    const [date, setDate] = useState('');
    const [client, setClient] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [keyWords, setKeyWords] = useState('');

    useEffect(() => {

        if(!number && !date && !client && !vehicle && !keyWords && serviceSheets.length === 0 && procedureSheets.length === 0){
            dispatch(getServiceSheets());
            dispatch(getProcedureSheets());
        };

        return () => {
            dispatch(clearServiceSheetsReducer());
            dispatch(clearProcedureSheetsReducer());
        };

    }, [number, date, client, vehicle, keyWords, dispatch]);

    //----- ABRIR POPUP

    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- BUSCAR FICHA

    const handleChangeNumber = (event) => {

    };

    const handleChangeVehicle = (event) => {

    };

    const handleChangeClient = (event) => {

    };

    const handleChangeKeyWords = (event) => {

    };

    const handleSearch = (event) => {

    };

    const handleInputChange = (event) => {

    };

    //----- PAGINADO
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const paginatedSheets = Array.isArray(sheets) 
    ? sheets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];
    const totalPages = Math.ceil(sheets.length / itemsPerPage);

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

    //----- FORMATO

    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };

    return (
        <div className="page">
            <div className="title">
                <h2>Fichas</h2>
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
                                    Tipo
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Número</span>
                                        <input
                                            type="search"
                                            name="searchNumber"
                                            onChange={handleChangeNumber}
                                            onKeyDown={handleSearch}
                                            onInput={handleInputChange}
                                            value={number}
                                            placeholder="Buscar"
                                            autoComplete="off"
                                            className="filterSearch"
                                        />
                                    </div>
                                </th>
                                <th>
                                    Fecha
                                </th>
                                <th>
                                    <div className="withFilter">
                                        <span>Vehículo</span>
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
                                <th>
                                    <div className="withFilter">
                                        <span>Proceso</span>
                                        <input
                                            type="search"
                                            name="searchKeyWords"
                                            onChange={handleChangeKeyWords}
                                            onKeyDown={handleSearch}
                                            onInput={handleInputChange}
                                            value={keyWords}
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
                            {paginatedSheets?.map(sheet => (
                                <tr key={sheet._id}>
                                    <td>{sheet.oil ? "Service" : "Mecánica"}</td>
                                    <td>{sheet.number}</td>
                                    <td>{formatDate(sheet.date)}</td>
                                    <td>{sheet.vehicle.licensePlate}</td>
                                    <td>{sheet.personClient ? sheet.personClient.name : sheet.companyClient ? sheet.companyClient.name : 'N/A'}</td>
                                    <td>{sheet.keyWords ? sheet.keyWords : 'N/A'}</td>
                                    <td className='center'>
                                        <a onClick={() => navigate(`/main_window/fichas/${sheet._id}`)}>
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
}

export default Sheets;