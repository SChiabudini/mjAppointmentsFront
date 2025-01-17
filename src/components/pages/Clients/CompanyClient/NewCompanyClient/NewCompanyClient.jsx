import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyClients, postCompanyClient } from "../../../../../redux/companyClientActions";
import { getVehicles } from "../../../../../redux/vehicleActions";
import NewVehicle from '../../../Vehicles/NewVehicle/NewVehicle.jsx';
import clear from "../../../../../assets/img/clear.png";
import clearHover from "../../../../../assets/img/clearHover.png";

const NewCompanyClient = ({ onClientAdded = () => {}, isNested = false, vehicleId = null }) => {

    const dispatch = useDispatch();

    const initialCompanyClientState = {
        cuit: '',
        name: '',
        email: '',
        phones: [],
        phoneWsp: '',
        address: '',
        vehicles: vehicleId ? [vehicleId] : []   
    };

    const [newCompanyClient, setNewCompanyClient] = useState(initialCompanyClientState);
    const [alreadyExist, setAlreadyExist] = useState(false);

    //----- DISABLE BUTTON

    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(newCompanyClient.cuit !== '' && newCompanyClient.name !== '' && newCompanyClient.email !== '' && (newCompanyClient?.phones?.length > 0 || phoneWsp !== '')){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [newCompanyClient]);

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setNewCompanyClient({
            ...newCompanyClient,
            [name]: value,
        });

        if(name === 'cuit'){
            setAlreadyExist(false);
        }
        if(name === 'searchTerm') setSearchTerm(value);
        if(name === 'searchTerm' && value === '') setDropdownVisible(false); 
    };

    //----- HANDLE PHONES

    const [currentPhone, setCurrentPhone] = useState("");
    const [phoneWsp, setPhoneWsp] = useState('');
    const [phonePrefix, setPhonePrefix] = useState('549');

    useEffect(() => {
        setNewCompanyClient(prevState => ({
            ...prevState,
            phoneWsp: '+' + phonePrefix + phoneWsp
        }));
    }, [phonePrefix, phoneWsp]); 

    const addPhone = () => {
    if (currentPhone.trim() !== "") {
        setNewCompanyClient((prevState) => ({
            ...prevState,
            phones: [...prevState.phones, currentPhone.trim()]
        }));
        setCurrentPhone("");
    }
    };

    const removePhone = (index) => {
        setNewCompanyClient((prevState) => ({
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

    //----- HANDLE VEHICLES

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
    if (!newCompanyClient.vehicles.some(v => v.licensePlate === vehicle.licensePlate)) {
        setNewCompanyClient(prevState => ({
            ...prevState,
            vehicles: [...prevState.vehicles, vehicle]
        }));
    }
    setSearchTerm('');
    };

    const removeVehicle = (index) => {
        setNewCompanyClient(prevState => ({
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
        setNewCompanyClient(initialCompanyClientState);
        setCurrentPhone('');
        setSearchTerm('');
    }


    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await dispatch(postCompanyClient(newCompanyClient));
            console.log("Client successfully saved");

            if(newCompanyClient.vehicles.length > 0){
                dispatch(getVehicles());
            }

            setNewCompanyClient(initialCompanyClientState);
            dispatch(getCompanyClients());
            onClientAdded(response);
        } catch (error) {
            console.error("Error saving company client:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
        <div className="titleForm">
            <h2>Nuevo cliente empresa</h2>
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
            <form id="companyClientForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                <div className="formRow">
                    <label htmlFor="cuit">CUIT</label>
                    <input type="text" name="cuit" value={newCompanyClient.cuit} onChange={handleInputChange}/>
                    {alreadyExist && <p>Ya existe un cliente con ese CUIT.</p>}
                </div>
                <div className="formRow">
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" value={newCompanyClient.name} onChange={handleInputChange}/>
                </div>
                <div className="formRow">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={newCompanyClient.email} onChange={handleInputChange}/>
                </div>
                <div className="formRow">
                    <label>Whatsapp</label>
                    <span>+</span>
                    <input
                        type="text"
                        name="phonePrefix"
                        value={phonePrefix}
                        onChange={handlePhoneWspChange}
                    />
                    <input
                        type="text"
                        name="phoneWsp"
                        value={phoneWsp}
                        onChange={handlePhoneWspChange}
                    />
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
                {newCompanyClient.phones?.length > 0 ? (
                    <div className="formRow">
                        <ul>
                            {newCompanyClient.phones?.map((phone, index) => (
                                <li key={index}>
                                    {phone}
                                    <button type="button" onClick={() => removePhone(index)}>x</button>
                                </li>
                            ))}
                        </ul>
                    </div>                    
                ) : (
                    <></>
                )}  
                <div className="formRow">
                    <label htmlFor="address">Dirección</label>
                    <input type="text" name="address" value={newCompanyClient.address} onChange={handleInputChange}/>
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
                                {newCompanyClient.vehicles?.map((vehicle, index) => (
                                    <li key={index}>
                                        {vehicle.licensePlate}
                                        <button type="button" onClick={() => removeVehicle(index)}>Eliminar</button>
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
                {showNewVehicle && <NewVehicle onClientAdded={handleVehicleSelection} isNested={true}/>}
                <button type='submit' form="companyClientForm" disabled={disabled}>Crear cliente</button>
            </div>
        </div>
        </div>
    )
};

export default NewCompanyClient;