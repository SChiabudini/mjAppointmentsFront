import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonClients, getAllPersonClients, postPersonClient } from "../../../../../redux/personClientActions.js";
import { getVehicles } from "../../../../../redux/vehicleActions.js";
import NewVehicle from '../../../Vehicles/NewVehicle/NewVehicle.jsx';
import clear from "../../../../../assets/img/clear.png";
import clearHover from "../../../../../assets/img/clearHover.png";
import loadingGif from "../../../../../assets/img/loading.gif";

const NewPersonClient = ({ onClientAdded = () => {}, isNested = false, vehicleId = null }) => {
    
    const dispatch = useDispatch();
    
    const initialPersonClientState = {
        dni: '',
        name: '',
        email: '',
        phones: [],
        phoneWsp: {
            prefix: '',
            numberPhone: ''
        },
        cuilCuit: '',
        vehicles: vehicleId ? [vehicleId] : []
    };
    
    const [newPersonClient, setNewPersonClient] = useState(initialPersonClientState);
    const [errorMessage, setErrorMessage] = useState(""); 
    const [alreadyExist, setAlreadyExist] = useState(false);
    const [loading, setLoading] = useState(false);

    //----- DISABLE BUTTON

    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(newPersonClient.dni !== '' && newPersonClient.name !== '' && newPersonClient.email !== '' && (newPersonClient.phones?.length > 0 || phoneWsp !== '')){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [newPersonClient]);

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
    const [phonePrefix, setPhonePrefix] = useState('549');
    const [phoneWsp, setPhoneWsp] = useState('');

    useEffect(() => {
        setNewPersonClient(prevState => ({
            ...prevState,
            phoneWsp: {
                prefix: phonePrefix,  
                numberPhone: phoneWsp 
            }
        }));
    }, [phonePrefix, phoneWsp]);
    
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

    const handlePhoneWspChange = (event) => {
        const { name, value } = event.target;
    
        if (name === 'phoneWsp') {
            setPhoneWsp(value);
        } else if (name === 'phonePrefix') {
            setPhonePrefix(value);
        }
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

    //----- RESET

    const resetForm = () => {
        setNewPersonClient(initialPersonClientState);
        setCurrentPhone('');
        setSearchTerm('');
        setPhoneWsp('');
        setPhonePrefix('549');
    }

    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await dispatch(postPersonClient(newPersonClient));
            console.log("Client successfully saved");
            setLoading(false);

            if(newPersonClient.vehicles.length > 0){
                dispatch(getVehicles());
            }

            resetForm();
            dispatch(getPersonClients());
            dispatch(getAllPersonClients());
            onClientAdded(response);

        } catch (error) {
            setErrorMessage("*Error al crear cliente, revise los datos ingresados e intente nuevamente.");
            console.error("Error saving person client:", error.message);
            setLoading(false);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
            <div className="titleForm">
                <h2>Nuevo cliente</h2>
                <div className="titleButtons">
                    <button 
                        onClick={resetForm} 
                        onMouseEnter={(e) => e.currentTarget.firstChild.src = clearHover} 
                        onMouseLeave={(e) => e.currentTarget.firstChild.src = clear}
                    >
                        <img src={clear} alt="Print"/>
                    </button>
                </div>
            </div>
            <div className="container">
                <div className="formRow">Los campos con (*) son obligatorios.</div>
                <form id="personClientForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>                    
                    <div className="formRow">
                        <label>DNI*</label>
                        <input type="text" name="dni" value={newPersonClient.dni} onChange={handleInputChange} />
                    </div>
                    {alreadyExist && <div className="formRow"><p className="errorMessage">Ya existe un cliente con ese DNI, corroborar que no esté archivado.</p></div>}
                    <div className="formRow">
                        <label>Nombre*</label>
                        <input type="text" name="name" value={newPersonClient.name} onChange={handleInputChange} />
                    </div>
                    <div className="formRow">
                        <label>Email*</label>
                        <input type="text" name="email" value={newPersonClient.email} onChange={handleInputChange} />
                    </div>
                    <div className="formRowWithButton">
                        <label>Whatsapp</label>
                        <div>
                            <span>+</span>
                            <input
                                type="text"
                                name="phonePrefix"
                                value={phonePrefix}
                                onChange={handlePhoneWspChange}
                                className="phonePrefix"
                            />
                            <input
                                type="text"
                                name="phoneWsp"
                                value={phoneWsp}
                                onChange={handlePhoneWspChange}
                            />
                        </div>
                    </div> 
                    <div className="formRowWithButton">
                        <label>Teléfono(s)</label>
                        <div>
                            <input 
                                type="text" 
                                value={currentPhone} 
                                onChange={(e) => setCurrentPhone(e.target.value)} 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') addPhone();
                                }} 
                            />
                            <button onClick={() => addPhone()} type="button">+</button>
                        </div>
                    </div>
                    {newPersonClient.phones?.length > 0 ? (
                        <div className="formRow">
                            <ul>
                                {newPersonClient.phones?.map((phone, index) => (
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
                                {dropdownVisible && filteredVehicles?.length > 0 && (
                                    <ul className="dropdown">
                                        {filteredVehicles?.map((vehicle, index) => (
                                            <li key={vehicle._id} onClick={() => handleVehicleSelection(vehicle)} className={index === selectedIndex ? 'highlight' : ''}>
                                                {vehicle.licensePlate}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="formRow">
                                <ul>
                                    {newPersonClient.vehicles?.map((vehicle, index) => (
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
                    <button type="submit" form="personClientForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Crear cliente"}</button>
                    {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default NewPersonClient;