import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyClients, postCompanyClient } from "../../../../../redux/companyClientActions";
import { getVehicles } from "../../../../../redux/vehicleActions";
import NewVehicle from '../../../Vehicles/NewVehicle/NewVehicle.jsx';

const NewCompanyClient = ({ onClientAdded = () => {}, isNested = false }) => {

    const dispatch = useDispatch();

    const initialCompanyClientState = {
    cuit: '',
    name: '',
    email: '',
    phones: [],
    address: '',
    vehicles: []   
    };

    const [newCompanyClient, setNewCompanyClient] = useState(initialCompanyClientState);
    const [alreadyExist, setAlreadyExist] = useState(false);

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
    };

    //----- HANDLE PHONES

    const [currentPhone, setCurrentPhone] = useState("");

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

    //----- HANDLE VEHICLES

    const vehicles = useSelector(state => state.vehicle.vehicles);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    useEffect(() => {
    if (vehicles.length === 0) {
        dispatch(getVehicles());
    }
    }, [vehicles, dispatch]);

    useEffect(() => {
    setFilteredVehicles(
        vehicles.filter(vehicle => 
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

    const handleSearchFocus = () => {
        setDropdownVisible(true);
        setSelectedIndex(-1);
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
                {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
            </div>
        </div>
        <div className="container">
            <form id="companyClientForm" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="cuit">CUIT</label>
                    <input type="text" name="cuit" value={newCompanyClient.cuit} onChange={handleInputChange}/>
                    {alreadyExist && <p>Ya existe un cliente con ese CUIT.</p>}
                </div>
                <div>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" value={newCompanyClient.name} onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={newCompanyClient.email} onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="phones">Teléfono</label>
                    <div>
                        <input
                            type="text"
                            value={currentPhone}
                            onChange={(e) => setCurrentPhone(e.target.value)}
                            placeholder="Añadir teléfono"
                        />
                        <button type="button" onClick={addPhone}>Añadir</button>
                    </div>
                    <ul>
                        {newCompanyClient.phones.map((phone, index) => (
                            <li key={index}>
                                {phone}
                                <button type="button" onClick={() => removePhone(index)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <label htmlFor="address">Dirección</label>
                    <input type="text" name="address" value={newCompanyClient.address} onChange={handleInputChange}/>
                </div>
                {!isNested ? (
                    <div>
                        <label>Vehículo(s)</label>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={handleSearchFocus} onBlur={handleSearchBlur} onKeyDown={handleKeyDown} placeholder="Buscar vehículo" />
                        {showNewVehicle ? (
                                <button type='button' onClick={() => setShowNewVehicle(false)}>˄</button>
                            ) : (
                                <button type='button' onClick={() => setShowNewVehicle(true)}>+</button>
                            )
                        }      
                        {dropdownVisible && filteredVehicles.length > 0 && (
                            <ul>
                                {filteredVehicles.map((vehicle, index) => (
                                    <li key={vehicle._id} onClick={() => handleVehicleSelection(vehicle)} className={index === selectedIndex ? 'highlight' : ''}>
                                        {vehicle.licensePlate}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <ul>
                            {newCompanyClient.vehicles.map((vehicle, index) => (
                                <li key={index}>
                                    {vehicle.licensePlate}
                                    <button type="button" onClick={() => removeVehicle(index)}>Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <></>
                )}                
            </form>
            <div>
                {showNewVehicle && <NewVehicle onClientAdded={handleVehicleSelection} isNested={true}/>}
                <button type='submit' form="companyClientForm">Crear</button>
            </div>
        </div>
        </div>
    )
};

export default NewCompanyClient;