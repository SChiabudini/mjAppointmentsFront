import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonClients, postPersonClient } from "../../../../../redux/personClientActions.js";
import { getVehicles } from "../../../../../redux/vehicleActions.js";
import NewVehicle from '../../../Vehicles/NewVehicle/NewVehicle.jsx';

const NewPersonClient = ({ onClientAdded = () => {}, isNested = false, vehicleId = null }) => {
    
    const dispatch = useDispatch();
    
    const initialPersonClientState = {
        dni: '',
        name: '',
        email: '',
        phones: [],
        cuilCuit: '',
        vehicles: vehicleId ? [vehicleId] : []
    };
    
    const [newPersonClient, setNewPersonClient] = useState(initialPersonClientState);
    const [alreadyExist, setAlreadyExist] = useState(false);

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPersonClient(prevState => ({ ...prevState, [name]: value }));
        if (name === 'dni') setAlreadyExist(false);
        if(name === 'searchTerm') setSearchTerm(value);
        if(name === 'searchTerm' && value === '') setDropdownVisible(false); 
    };

    //----- HANDLE PHONES

    const [currentPhone, setCurrentPhone] = useState("");
    
    const addPhone = () => {
        if (currentPhone.trim() !== "") {
            setNewPersonClient(prevState => ({
                ...prevState,
                phones: [...prevState.phones, currentPhone.trim()]
            }));
            setCurrentPhone("");
        }
    };

    const removePhone = (index) => {
        setNewPersonClient(prevState => ({
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
                vehicle.personClient === null &&
                vehicle.companyClient === null &&
                vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, vehicles]);

    const handleVehicleSelection = (vehicle) => {
        if (!newPersonClient.vehicles.some(v => v.licensePlate === vehicle.licensePlate)) {
            setNewPersonClient(prevState => ({
                ...prevState,
                vehicles: [...prevState.vehicles, vehicle]
            }));
        }
        setSearchTerm('');
    };

    const removeVehicle = (index) => {
        setNewPersonClient(prevState => ({
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

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
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
            const response = await dispatch(postPersonClient(newPersonClient));
            console.log("Client successfully saved");

            if(newPersonClient.vehicles.length > 0){
                dispatch(getVehicles());
            }

            setNewPersonClient(initialPersonClientState);
            dispatch(getPersonClients());
            onClientAdded(response);

        } catch (error) {
            console.error("Error saving person client:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
            <div className="titleForm">
                <h2>Nuevo cliente</h2>
                <div className="titleButtons">
                    {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
                </div>
            </div>
            <div className="container">
                <form id="personClientForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>                    
                    <div className="formRow">
                        <label>DNI</label>
                        <input type="text" name="dni" value={newPersonClient.dni} onChange={handleInputChange} />
                        {alreadyExist && <p>Ya existe un cliente con ese DNI.</p>}
                    </div>
                    <div className="formRow">
                        <label>Nombre</label>
                        <input type="text" name="name" value={newPersonClient.name} onChange={handleInputChange} />
                    </div>
                    <div className="formRow">
                        <label>Email</label>
                        <input type="text" name="email" value={newPersonClient.email} onChange={handleInputChange} />
                    </div>
                    <div className="formRow">
                        <label>Teléfono(s)</label>
                        <input 
                            type="text" 
                            value={currentPhone} 
                            onChange={(e) => setCurrentPhone(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') addPhone();
                            }} 
                        />

                    </div>
                    {newPersonClient.phones.length > 0 ? (
                        <div className="formRow">
                            <ul>
                                {newPersonClient.phones.map((phone, index) => (
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
                        <input type="text" name="cuilCuit" value={newPersonClient.cuilCuit} onChange={handleInputChange} />
                    </div>
                    {!isNested ? (
                        <div>
                            <div className="formRow">
                                <label>Vehículo(s)</label>
                            </div>
                            <div className="searchRow">
                                <input type="text" name="searchTerm" value={searchTerm} onChange={handleInputChange} onFocus={() => setSelectedIndex(-1)} onBlur={handleSearchBlur} onKeyDown={handleKeyDown} placeholder="Buscar vehículo" />
                                <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button">
                                    {showNewVehicle ? '-' : '+'}
                                </button>                                
                            </div>
                            <div className="searchRow">
                                {dropdownVisible && filteredVehicles.length > 0 && (
                                    <ul className="dropdown">
                                        {filteredVehicles.map((vehicle, index) => (
                                            <li key={vehicle._id} onClick={() => handleVehicleSelection(vehicle)} className={index === selectedIndex ? 'highlight' : ''}>
                                                {vehicle.licensePlate}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="formRow">
                                <ul>
                                    {newPersonClient.vehicles.map((vehicle, index) => (
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
                    <button type="submit" form="personClientForm">Crear cliente</button>
                </div>
            </div>
        </div>
    );
};

export default NewPersonClient;