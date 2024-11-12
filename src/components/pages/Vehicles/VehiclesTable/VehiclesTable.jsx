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

        dispatch(getVehicles());
        console.log(vehicles);

    }, [dispatch]);

    return(
        <div>

        </div>
    )
};

export default VehiclesTable;