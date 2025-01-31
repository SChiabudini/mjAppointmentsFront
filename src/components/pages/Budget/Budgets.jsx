import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import NewBudget from "./NewBudget/NewBudget.jsx";
import Error from "../Error/Error.jsx";
import { getBudgets, getAllBudgets, searchBudgets, searchAllBudgets } from "../../../redux/budgetActions.js";
import { clearBudgetsReducer } from "../../../redux/budgetSlice.js";
import detail from "../../../assets/img/detail.png";
import loadingGif from "../../../assets/img/loading.gif";

const Budgets = () => {

    const budgets = useSelector(state => state.budget.budgets);
    const allBudgets = useSelector(state => state.budget.budgetsAll);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ number, setNumber ] = useState('');
    const [ client, setClient ] = useState('');
    const [ vehicle, setVehicle ] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if(!number && !client && !vehicle){
            if(showAll){
                dispatch(getAllBudgets())
                .catch(() => setError(true));
            } else{
                dispatch(getBudgets())
                .catch(() => setError(true));
            }
        };

        return () => {
            dispatch(clearBudgetsReducer());
        };
    }, [number, client, vehicle, dispatch, showAll]);

    //----- ABRIR POPUP
    
    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- BUSCAR VEHÍCULO

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            if (number.trim() || client.trim() || vehicle.trim()) {
                setLoading(true);
                if(showAll){
                    dispatch(searchAllBudgets(number.trim(), client.trim(), vehicle.trim())).then(() => setLoading(false));
                } else{
                    dispatch(searchBudgets(number.trim(), client.trim(), vehicle.trim())).then(() => setLoading(false));
                }
                setCurrentPage(1);
            }
        }
    };

    const handleInputChange = (event) => {
        if (event.target.value === "") {
            dispatch(clearBudgetsReducer());
            setCurrentPage(1);
        }
    };

    //----- PAGINADO
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [paginatedBudgets, setPaginatedBudgets] = useState([]);

    useEffect(() => {
        if (Array.isArray(budgets)) {
            const newPaginatedBudgets = !showAll
                ? budgets?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                : allBudgets?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
            // Evita actualizar el estado si no hay cambios
            setPaginatedBudgets((prev) => {
                const prevStringified = JSON.stringify(prev);
                const newStringified = JSON.stringify(newPaginatedBudgets);
    
                return prevStringified === newStringified ? prev : newPaginatedBudgets;
            });
        }
    }, [budgets, showAll, currentPage, itemsPerPage, allBudgets]);

    const totalPages = Math.ceil(budgets.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    //----- FORMATO

    const formatDate = (date) => {        
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            timeZone: 'UTC' 
        };

        const formattedDate = new Date(date).toLocaleDateString('es-ES', options).replace(',', ' -');
        return formattedDate;
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
        if(allBudgets?.length === 0){
            setLoading(true);
            dispatch(getAllBudgets()).then(() => setLoading(false));
        }
        setShowAll(!showAll);
    };

    //----- FORMAT NUMBER

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return(
        <div className="page">
            {error ? (
                <Error />
            ) : (
                <>
                    <div className="title">
                        <h2>Presupuestos</h2>
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
                                                <span>Número</span>
                                                <input 
                                                    type="search"
                                                    name="searchNumber"
                                                    onChange={(event) => setNumber(event.target.value)}
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
                                            Fecha de creación
                                        </th>
                                        <th>
                                            Fecha de vencimiento    
                                        </th>
                                        <th>
                                            <div className="withFilter">
                                                <span>Cliente</span>
                                                <input 
                                                    type="search"
                                                    name="searchClient"
                                                    onChange={(event) => setClient(event.target.value)}
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
                                                <span>Vehículo</span>
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
                                        <th>
                                            Total    
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
                                            {paginatedBudgets?.map(budget => (
                                                <tr key={budget._id} className={`${!budget.active ? 'disabled' : ''}`}>
                                                    <td>{budget.number}</td>
                                                    <td>{formatDate(budget.start)}</td>
                                                    <td>{formatDate(budget.end)}</td>
                                                    <td>{budget.personClient ? budget.personClient.name : budget.companyClient ? budget.companyClient.name : 'No disponible'}</td>
                                                    <td>{budget.vehicle ? budget.vehicle.licensePlate : 'No disponible'}</td>
                                                    <td>${formatNumber(budget.total)}</td>
                                                    <td className='center'>
                                                        <a onClick={() => navigate(`/main_window/presupuestos/${budget._id}`)}>
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
                            <NewBudget onBudgetAdded={() => setPopUpOpen(false)}/>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
};

export default Budgets;