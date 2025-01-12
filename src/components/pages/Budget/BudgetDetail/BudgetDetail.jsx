import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getBudgetById } from "../../../../redux/budgetActions.js";
import { clearBudgetDetailReducer } from "../../../../redux/budgetSlice.js";
import loadingGif from "../../../../assets/img/loading.gif";

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

    return(
        <div className="page">
            {loading ? 
                <div className="loadingPage">
                    <img src={loadingGif} alt=""/>
                    <p>Cargando</p>
                </div>
            :
                <div>{budgetDetail.number}</div>
            }
        </div>
    );
};

export default BudgetDetail;