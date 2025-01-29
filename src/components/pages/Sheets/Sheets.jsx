import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import NewServiceSheet from './NewServiceSheet/NewServiceSheet.jsx';
import NewMechanicalSheet from './NewMechanicalSheet/NewMechanicalSheet.jsx';
import Error from '../Error/Error.jsx';
import { getServiceSheets, getAllServiceSheets, searchServiceSheets, searchAllServiceSheets, searchAllServiceSheetsByDate, searchServiceSheetsByDate } from "../../../redux/serviceSheetActions.js";
import { getMechanicalSheets, getAllMechanicalSheets, searchMechanicalSheets, searchAllMechanicalSheets, searchAllMechanicalSheetsByDate, searchMechanicalSheetsByDate } from "../../../redux/mechanicalSheetActions.js";
import { clearServiceSheetsReducer } from "../../../redux/serviceSheetSlice.js";
import { clearMechanicalSheetsReducer } from '../../../redux/mechanicalSheetSlice.js';
import detail from "../../../assets/img/detail.png";
import loadingGif from "../../../assets/img/loading.gif";
import clear from "../../../assets/img/clear.png";
import clearHover from "../../../assets/img/clearHover.png";
import search from "../../../assets/img/search.png";
import searchHover from "../../../assets/img/searchHover.png";


const Sheets = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const serviceSheets = useSelector(state => state.serviceSheet.serviceSheets);
    const mechanicalSheets = useSelector(state => state.mechanicalSheet.mechanicalSheets);
    const allMechanicalSheets = useSelector(state => state.mechanicalSheet.mechanicalSheetsAll);
    const allServiceSheets = useSelector(state => state.serviceSheet.serviceSheetsAll);

    const sheets = [...serviceSheets, ...mechanicalSheets].sort((a, b) => new Date(b.date) - new Date(a.date));
    const allSheets = [...allServiceSheets, ...allMechanicalSheets].sort((a, b) => new Date(b.date) - new Date(a.date));
console.log(sheets);

    const [number, setNumber] = useState('');
    const [client, setClient] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [keyWords, setKeyWords] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if(!number && !client && !vehicle && !keyWords && startDate === '' && endDate === ''){
            if(showAll){
                dispatch(getAllServiceSheets()).catch(() => setError(true));
                dispatch(getAllMechanicalSheets()).catch(() => setError(true));
            } else {
                dispatch(getServiceSheets()).catch(() => setError(true));
                dispatch(getMechanicalSheets()).catch(() => setError(true));
            }
        };

        return () => {
            dispatch(clearServiceSheetsReducer());
            dispatch(clearMechanicalSheetsReducer());
        };

    }, [number, client, vehicle, keyWords, dispatch, showAll, startDate, endDate]);

    //----- ABRIR POPUP

    const [popUpServiceOpen, setPopUpServiceOpen] = useState(false);
    const [popUpMechanicalOpen, setPopUpMechanicalOpen] = useState(false);

    //----- BUSCAR FICHA

    const [ toggle, setToggle ] = useState(false);

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            if (number.trim() || vehicle.trim() || client.trim() || keyWords.trim()) {
                setLoading(true);
                if(showAll){
                    dispatch(searchAllServiceSheets(number.trim(), vehicle.trim(), client.trim())).catch(() => setError(true));
                    dispatch(searchAllMechanicalSheets(number.trim(), vehicle.trim(), client.trim(), keyWords.trim())).then(() => setLoading(false)).catch(() => setError(true));
                } else{
                    dispatch(searchServiceSheets(number.trim(), vehicle.trim(), client.trim())).catch(() => setError(true));
                    dispatch(searchMechanicalSheets(number.trim(), vehicle.trim(), client.trim(), keyWords.trim())).then(() => setLoading(false)).catch(() => setError(true));
                }
                setCurrentPage(1);
                if(keyWords.trim()){
                    setToggle(true);
                }
            }
        }
    };

    const handleInputChange = (event) => {
        if (event.target.value === "") {
            dispatch(clearServiceSheetsReducer());
            dispatch(clearMechanicalSheetsReducer());
            setCurrentPage(1);
            setToggle(false);
        }
    };

    //----- FILTRO POR DATE

    const resetDate = () => {
        setStartDate('');
        setEndDate('');
    };

    const handleSearchByDate = async () => {
        if(startDate !== '' && endDate !== ''){

            setLoading(true);
            if(showAll){
                dispatch(searchAllServiceSheetsByDate(startDate, endDate)).catch(() => setError(true));
                dispatch(searchAllMechanicalSheetsByDate(startDate, endDate)).then(() => setLoading(false)).catch(() => setError(true));
            } else {
                dispatch(searchServiceSheetsByDate(startDate, endDate)).catch(() => setError(true));
                dispatch(searchMechanicalSheetsByDate(startDate, endDate)).then(() => setLoading(false)).catch(() => setError(true));
            }
        }
    };

    //----- PAGINADO
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [ paginatedSheets, setPaginatedSheets ] = useState([]);

    useEffect(() => {
        let sheetsToPaginate = [];
    
        if (!showAll && !toggle) {
            sheetsToPaginate = sheets;
        } else if (!showAll && toggle) {
            sheetsToPaginate = mechanicalSheets;
        } else if (showAll && !toggle) {
            sheetsToPaginate = allSheets; 
        } else if (showAll && toggle) {
            sheetsToPaginate = allMechanicalSheets;
        }
    
        if (Array.isArray(sheetsToPaginate)) {
            const newPaginatedSheets = sheetsToPaginate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
            
            setPaginatedSheets((prev) => {
                const prevStringified = JSON.stringify(prev);
                const newStringified = JSON.stringify(newPaginatedSheets);
                return prevStringified === newStringified ? prev : newPaginatedSheets;
            });
        }
    }, [sheets, toggle, currentPage, itemsPerPage, mechanicalSheets, showAll, allSheets, allMechanicalSheets]);    
    
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
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
    };

    //----- MOSTRAR TODOS
    
    const handleAll = async () => {
        if(allServiceSheets?.length === 0 || allMechanicalSheets?.length === 0){
            setLoading(true);
            dispatch(getAllServiceSheets()).catch(() => setError(true));
            dispatch(getAllMechanicalSheets()).then(() => setLoading(false)).catch(() => setError(true));;
        }
        setShowAll(!showAll);
    }

    return (
        <div className="page">
            {error ? (
                <Error />
            ) : (
                <>
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
                        <div className="dateSheet">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />

                                <button 
                                    onClick={handleSearchByDate} 
                                    onMouseEnter={(e) => e.currentTarget.firstChild.src = searchHover} 
                                    onMouseLeave={(e) => e.currentTarget.firstChild.src = search}
                                    disabled={startDate === '' || endDate === ''}
                                >
                                    <img src={search} alt="Print"/>
                                </button>

                                <button 
                                    onClick={resetDate} 
                                    onMouseEnter={(e) => e.currentTarget.firstChild.src = clearHover} 
                                    onMouseLeave={(e) => e.currentTarget.firstChild.src = clear}
                                    disabled={startDate === '' || endDate === ''}
                                >
                                    <img src={clear} alt="Print"/>
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
                            <button onClick={() => setPopUpServiceOpen(true)}>+ F. service</button>
                            <button onClick={() => setPopUpMechanicalOpen(true)}>+ F. mecánica</button>
                        </div>                
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
                                                    onChange={event => setNumber(event.target.value)}
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
                                                    onChange={event => setVehicle(event.target.value)}
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
                                                    onChange={event => setClient(event.target.value)}
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
                                                    onChange={event => setKeyWords(event.target.value)}
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
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="loadingCell">
                                                <div className="loadingPage">
                                                    <img src={loadingGif} alt="" />
                                                    <p>Cargando</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {paginatedSheets?.map(sheet => (
                                                <tr key={sheet._id} className={`${!sheet.active ? 'disabled' : ''}`}>
                                                    <td>{sheet.oil ? "Service" : "Mecánica"}</td>
                                                    <td>{sheet.number}</td>
                                                    <td>{formatDate(sheet.date)}</td>
                                                    <td>{sheet.vehicle.licensePlate}</td>
                                                    <td>{sheet.personClient ? sheet.personClient.name : sheet.companyClient ? sheet.companyClient.name : 'No disponible'}</td>
                                                    <td>{sheet.keyWords ? sheet.keyWords : 'No disponible'}</td>
                                                    <td className='center'>
                                                        {sheet.oil ? (
                                                            <a onClick={() => navigate(`/main_window/fichas/service/${sheet._id}`)}>
                                                                <img src={detail} alt="" className="detailImg" />
                                                            </a>
                                                        ):(
                                                            <a onClick={() => navigate(`/main_window/fichas/mecanica/${sheet._id}`)}>
                                                                <img src={detail} alt="" className="detailImg" />
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={popUpServiceOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpServiceOpen(false)}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <NewServiceSheet onServiceSheetAdded={() => setPopUpServiceOpen(false)}/>
                        </div>
                    </div>
                    <div className={popUpMechanicalOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpMechanicalOpen(false)}>
                        <div onClick={(e) => e.stopPropagation()}>
                            <NewMechanicalSheet onMechanicalSheetAdded={() => setPopUpMechanicalOpen(false)}/>
                        </div>
                    </div>
                </>
            )}
        </div>  
    )
};

export default Sheets;