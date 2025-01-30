import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Error from "../../Error/Error.jsx";
import { getBudgetById, putBudgetStatus, getBudgets } from "../../../../redux/budgetActions.js";
import { clearBudgetDetailReducer } from "../../../../redux/budgetSlice.js";
import PutBudget from "../PutBudget/PutBudget.jsx";
import logo from "../../../../assets/img/logoMJ-BG.png";
import loadingGif from "../../../../assets/img/loading.gif";
import print from "../../../../assets/img/print.png";
import printHover from "../../../../assets/img/printHover.png";
import style from "./BudgetDetail.module.css";

const BudgetDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const budgetDetail = useSelector(state => state.budget.budgetDetail);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        dispatch(getBudgetById(id))
        .then(() => setLoading(false))
        .catch(() => setError(true));

        return () => {
            dispatch(clearBudgetDetailReducer());
        };

    }, [dispatch, id]);

    //----- ABRIR POPUP
    const [popUpOpen, setPopUpOpen] = useState(false);

    //----- DESACTIVAR ELEMENTO
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        dispatch(putBudgetStatus(id))
        .then(
            dispatch(getBudgets()).then(
                navigate(`/main_window/presupuestos`)
            )
        ).catch(
            dispatch(getBudgets()).then(
                navigate(`/main_window/presupuestos`)
            )
        );
    }

    const total = budgetDetail.items?.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0) || 0;

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

    return(
        <div className={style.budgetPage}>
            {error ? (
                <Error />
            ) : (
                loading ? 
                    <div className="loadingPage">
                        <img src={loadingGif} alt=""/>
                        <p>Cargando</p>
                    </div>
                :
                    <div>
                        <div className="page">
                            <div className="title">
                                <h2>Presupuesto n°{budgetDetail.number}</h2>
                                <div className="titleButtons">
                                    <button 
                                        onClick={() => window.print()} 
                                        onMouseEnter={(e) => e.currentTarget.firstChild.src = printHover} 
                                        onMouseLeave={(e) => e.currentTarget.firstChild.src = print}
                                    >
                                        <img src={print} alt="Print"/>
                                    </button>
                                    {budgetDetail.active ? <button onClick={() => setPopUpOpen(true)}>Editar</button> : ''}
                                    {!budgetDetail.active ? <button className="add" onClick={() => setShowDeleteModal(!showDeleteModal)}>Reactivar</button> : <button className="delete" onClick={() => setShowDeleteModal(!showDeleteModal)}>Archivar</button>}
                                    <button onClick={() => navigate(`/main_window/presupuestos`)}>Atrás</button>
                                </div>
                            </div>                    
                        </div>
                        <div id="printable-section" className={`${style.budget} ${!budgetDetail.active ? 'disabled' : ''}`}>
                            <div className={style.header}>
                                <div className={style.header1}>
                                    <img src={logo} alto=""/>
                                    <p><span>MJ PRO OIL</span></p>
                                    <p>Matías Nicolás Ezequiel</p>
                                    <p>CUIT: 20-41195480-4</p>
                                    <p>Av. 44 n° 1877 e/ 132 y 133</p>
                                    <p>Teléfono: (221) 6230285</p>
                                </div>
                                <div className={style.header2}>
                                    <p className={style.bigP}>P</p>
                                    <p>DOCUMENTO</p>
                                    <p>NO VÁLIDO</p>
                                    <p>COMO FACTURA</p>
                                </div>
                                <div className={style.header3}>
                                    <div>
                                        <p><span>PRESUPUESTO</span></p>
                                        <p>N° {budgetDetail.number}</p>
                                        <p>Emisión: {formatDate(budgetDetail.start)}</p>
                                        <p>Vencimiento: {formatDate(budgetDetail.end)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.body}>
                                <div className={style.clientData}>
                                    <p><span>DATOS DEL CLIENTE</span></p>
                                    {budgetDetail.personClient ? (
                                        <div className={style.columns}>
                                            <div>
                                                <p><span>DNI:</span> {budgetDetail.personClient.dni}</p>
                                                <p><span>Nombre:</span> {budgetDetail.personClient.name}</p>
                                                <p><span>Email:</span> {budgetDetail.personClient.email}</p>
                                            </div>
                                            <div>
                                                {budgetDetail.personClient.cuilCuit && <p><span>CUIL/CUIT:</span> {budgetDetail.personClient.cuilCuit}</p>}
                                                {budgetDetail.personClient.phoneWsp.numberPhone && <p><span>Whatsapp:&nbsp;</span>+{budgetDetail.personClient.phoneWsp.prefix}{budgetDetail.personClient.phoneWsp.numberPhone}</p>}
                                                {budgetDetail.personClient.phones?.length > 0 && <p><span>Teléfonos:</span> {budgetDetail.personClient.phones?.join(', ')}</p>}
                                                {budgetDetail.vehicle && <p><span>Vehículo:</span> {budgetDetail.vehicle.licensePlate}</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={style.columns}>
                                            <div>                                        
                                                <p><span>CUIT:</span> {budgetDetail.companyClient.cuit}</p>
                                                <p><span>Nombre:</span> {budgetDetail.companyClient.name}</p>
                                                <p><span>Email:</span> {budgetDetail.companyClient.email}</p>
                                            </div>

                                            <div>
                                                {budgetDetail.companyClient.address && <p><span>Dirección:</span> {budgetDetail.companyClient.address}</p>}
                                                {budgetDetail.companyClient.phoneWsp.numberPhone && <p><span>Whatsapp:&nbsp;</span>+{budgetDetail.companyClient.phoneWsp.prefix}{budgetDetail.companyClient.phoneWsp.numberPhone}</p>}
                                                {budgetDetail.companyClient.phones?.length > 0 && <p><span>Teléfonos:</span> {budgetDetail.companyClient.phones?.join(', ')}</p>}
                                                {budgetDetail.vehicle && <p><span>Vehículo:</span> {budgetDetail.vehicle.licensePlate}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                Cantidad
                                            </th>
                                            <th>
                                                Descripción
                                            </th>
                                            <th>
                                                Precio unitario
                                            </th>
                                            <th>
                                                Precio total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {budgetDetail.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.quantity}</td>
                                                <td>{item.description}</td>
                                                <td>${item.price}</td>
                                                <td>${item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className={style.footer}>Total: ${total}</div>
                        </div>

                    </div>
                )
            }
            <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
                <div onClick={(e) => e.stopPropagation()}>
                    <PutBudget onBudgetAdded={() => setPopUpOpen(false)}/>
                </div>
            </div>
            {showDeleteModal ?
                <div className="deleteModal">
                    <div className="deleteModalContainer">
                        <p>{budgetDetail.active ? "¿Está seguro que desea archivar este presupuesto?" : "¿Está seguro que desea reactivar este presupuesto?"}</p>
                        <div className="deleteModalButtons">
                            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                            {budgetDetail.active ?
                                <button onClick={handleDelete} className="delete">Archivar</button>
                            : 
                                <button onClick={handleDelete} className="add">Reactivar</button>
                            }
                        </div>
                    </div>
                </div>
                :
                <></>
            }
        </div>
    );
};

export default BudgetDetail;