import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getBudgetById } from "../../../../redux/budgetActions.js";
import { clearBudgetDetailReducer } from "../../../../redux/budgetSlice.js";
import logo from "./logoBG.png";
import loadingGif from "../../../../assets/img/loading.gif";
import style from "./BudgetDetail.module.css";

const BudgetDetail = () => {

    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const budgetDetail = useSelector(state => state.budget.budgetDetail);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        dispatch(getBudgetById(id)).then(() => setLoading(false));


        return () => {
            dispatch(clearBudgetDetailReducer());
        };

    }, [dispatch, id]);

    useEffect(() => {

        console.log(budgetDetail);

    }, [budgetDetail]);

    const total = budgetDetail.items?.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0) || 0;

    const handlePrint = () => {
        window.print();
    };

    return(
        <div>
            {loading ? 
                <div className="loadingPage">
                    <img src={loadingGif} alt=""/>
                    <p>Cargando</p>
                </div>
            :
                <div>
                    <div id="printable-section" className={style.budget}>
                        <div className={style.header}>
                            <div className={style.header1}>
                                <img src={logo} alto=""/>
                                <p><span>MJ PRO OIL</span></p>
                                <p>Razón Social</p>
                                <p>Nombre completo</p>
                                <p>CUIL</p>
                                <p>Teléfono</p>
                            </div>
                            <div className={style.header2}>
                                <p><span>P</span></p>
                                <p>DOCUMENTO</p>
                                <p>NO VÁLIDO</p>
                                <p>COMO FACTURA</p>
                            </div>
                            <div className={style.header3}>
                                <p>PRESUPUESTO</p>
                                <p>N° {budgetDetail.number}</p>
                                <p>Fecha de emisión: {budgetDetail.start}</p>
                                <p>Fecha de vencimiento: {budgetDetail.end}</p>
                            </div>
                        </div>
                        <div className={style.body}>
                            <div>
                                <p>Datos del cliente</p>
                                <p>{budgetDetail.personClient ? `DNI: ${budgetDetail.personClient.dni}` : `CUIT: ${budgetDetail.companyClient.cuit}`}</p>
                                <p>{`Nombre: ${budgetDetail.personClient ? budgetDetail.personClient.name : budgetDetail.companyClient.name}`}</p>
                                <p>{`Email: ${budgetDetail.personClient ? budgetDetail.personClient.email : budgetDetail.companyClient.email}`}</p>
                                <p>{budgetDetail.personClient ? `CUIL/CUIT: ${budgetDetail.personClient.cuilCuit ? budgetDetail.personClient.cuilCuit : "N/A"}` : `Dirección: ${budgetDetail.companyClient.address ? budgetDetail.companyClient.address : "N/A"}`}</p>
                                <p>{`Teléfonos: ${budgetDetail.personClient ? budgetDetail.personClient.phones.length ? budgetDetail.personClient.phones.join(', ') : "N/A" : budgetDetail.companyClient.phones.length ? budgetDetail.companyClient.phones.join(', ') : "N/A" }`}</p>
                                {budgetDetail.vehicle && `Vehículo: ${budgetDetail.vehicle.licensePlate}`}
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
                                            <th>{item.quantity}</th>
                                            <th>{item.description}</th>
                                            <th>{item.price}</th>
                                            <th>{item.price * item.quantity}</th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={style.footer}>Total: ${total}</div>
                    </div>
                    <button onClick={handlePrint}>Imprimir</button>
                </div>
            }
        </div>
    );
};

export default BudgetDetail;