import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonClientById, getPersonClients, postPersonClient } from "../../../../../redux/personClientActions.js";
import { getVehicles } from "../../../../../redux/vehicleActions.js";
import NewVehicle from '../../../Vehicles/NewVehicle/NewVehicle.jsx';

const PutPersonClient = ({ onClientAdded = () => {}, isNested = false, vehicleId = null }) => {
    
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const personClientDetail = useSelector(state => state.personClient.personClientDetail); 

    const [editPersonClient, setEditPersonClient] = useState({});
    const [alreadyExist, setAlreadyExist] = useState(false);
    // console.log(editPersonClient);
      

    useEffect(() => {
        dispatch(getPersonClientById(id));
    }, [dispatch, id])

    useEffect(() => {    
        if (personClientDetail && personClientDetail._id === id) {        
            const updatedEditPersonClient = {
                _id: personClientDetail._id,
                cuilCuit: personClientDetail.cuilCuit,
                dni: personClientDetail.dni,
                name: personClientDetail.name,
                email: personClientDetail.email,
                phones: personClientDetail.phones,
                vehicles: personClientDetail.vehicles,
                active: personClientDetail.active
            };
            setEditPersonClient(updatedEditPersonClient);
        }
    }, [dispatch, id, personClientDetail]);    

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        setEditPersonClient(prevState => ({ ...prevState, [name]: value }));
        if (name === 'dni') setAlreadyExist(false);
        if(name === 'searchTerm') setSearchTerm(value);
        if(name === 'searchTerm' && value === '') setDropdownVisible(false); 
    };

    //----- HANDLE PHONES

    const [currentPhone, setCurrentPhone] = useState("");
    
    const addPhone = () => {
        if (currentPhone.trim() !== "") {
            setEditPersonClient(prevState => ({
                ...prevState,
                phones: [...prevState.phones, currentPhone.trim()]
            }));
            setCurrentPhone("");
        }
    };

    const removePhone = (index) => {
        setEditPersonClient(prevState => ({
            ...prevState,
            phones: prevState.phones.filter((_, i) => i !== index)
        }));
    };

    //----- HANDLE VEHÍCLES

    const vehicles = useSelector(state => state.vehicle.vehicles);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    useEffect(() => {
        setFilteredVehicles(
            vehicles.filter(vehicle => 
                // vehicle.personClient === null &&
                // vehicle.companyClient === null &&
                vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, vehicles]);

    const handleVehicleSelection = (vehicle) => {
        if (!editPersonClient.vehicles.some(v => v.licensePlate === vehicle.licensePlate)) {
            setEditPersonClient(prevState => ({
                ...prevState,
                vehicles: [...prevState.vehicles, vehicle]
            }));
        }
        setSearchTerm('');
    };

    const removeVehicle = (index) => {
        setEditPersonClient(prevState => ({
            ...prevState,
            vehicles: prevState.vehicles.filter((_, i) => i !== index)
        }));
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setDropdownVisible(false);
            setSelectedIndex(-1);
        }, 150);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev + 1) % filteredVehicles.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev - 1 + filteredVehicles.length) % filteredVehicles.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            handleVehicleSelection(filteredVehicles[selectedIndex]);
            setDropdownVisible(false);
        } else {
            setDropdownVisible(true);
        }
    };

    //----- SUBMIT

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // const response = await dispatch(postPersonClient(editPersonClient));
            // console.log("Client successfully saved");

            // if(editPersonClient.vehicles.length > 0){
            //     dispatch(getVehicles());
            // }

            // setEditPersonClient(initialPutPersonClientState);
            // dispatch(getPersonClients());
            // onClientAdded(response);

        } catch (error) {
            console.error("Error saving person client:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
            <div className="titleForm">
                <h2>Editar cliente</h2>
            </div>
            <div className="container">
                <form id="personClientForm" onSubmit={handleSubmit}>                    
                    <div className="formRow">
                        <label>DNI</label>
                        <input 
                        type="number" 
                        name="dni" 
                        min='0'
                        value={editPersonClient.dni} 
                        onChange={handleInputChange} />
                        {alreadyExist && <p>Ya existe un cliente con ese DNI.</p>}
                    </div>
                    <div className="formRow">
                        <label>Nombre</label>
                        <input type="text" name="name" value={editPersonClient.name} onChange={handleInputChange} />
                    </div>
                    <div className="formRow">
                        <label>Email</label>
                        <input type="text" name="email" value={editPersonClient.email} onChange={handleInputChange} />
                    </div>
                    <div className="formRow">
                        <label>Teléfono(s)</label>
                        <input 
                            type="number" 
                            value={currentPhone} 
                            min='0'
                            onChange={(e) => setCurrentPhone(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') addPhone();
                            }} 
                        />
                    </div>
                    {editPersonClient.phones?.length > 0 ? (
                        <div className="formRow">
                            <ul>
                                {editPersonClient.phones?.map((phone, index) => (
                                    <li key={index}>
                                        <div>{phone}</div>
                                        <button type="button" onClick={() => removePhone(index)}>x</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : ( 
                        <></>
                    )}                    
                    <div className="formRow">
                        <label>CUIL/CUIT</label>
                        <input type="text" name="cuilCuit" value={editPersonClient.cuilCuit} onChange={handleInputChange} />
                    </div>
                    {!isNested ? (
                        <div>
                            <div className="formRow">
                                <label>Vehículo(s)</label>
                            </div>
                            <div className="searchRow">
                                <input 
                                type="text" 
                                name="searchTerm" 
                                value={searchTerm} 
                                onChange={handleInputChange} 
                                onFocus={() => setSelectedIndex(-1)} 
                                onBlur={handleSearchBlur} 
                                onKeyDown={handleKeyDown} 
                                placeholder="Buscar vehículo" 
                                />
                                <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button">
                                    {showNewVehicle ? '-' : '+'}
                                </button>                                
                            </div>
                            <div className="searchRow">
                                {dropdownVisible && filteredVehicles?.length > 0 && (
                                    <ul className="dropdown">
                                        {filteredVehicles?.map((vehicle, index) => (
                                            <li 
                                            className={index === selectedIndex ? 'highlight' : ''}
                                            key={vehicle._id} 
                                            onClick={() => handleVehicleSelection(vehicle)} 
                                            >
                                                {vehicle.licensePlate}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="formRow">
                                <ul>
                                    {editPersonClient.vehicles?.map((vehicle, index) => (
                                        <li key={index}>
                                            {vehicle.licensePlate}
                                            <button type="button" onClick={() => removeVehicle(index)}>x</button>
                                        </li>
                                    ))}
                                </ul> 
                            </div>        
                        </div>
                    ) : (
                        <></>
                    )}
                </form>
                <div className={isNested ? "submitNested" : "submit"}>                    
                    {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true}/>}
                    <button type="submit" form="personClientForm">Editar cliente</button>
                </div>
            </div>
        </div>
    );
};

export default PutPersonClient;