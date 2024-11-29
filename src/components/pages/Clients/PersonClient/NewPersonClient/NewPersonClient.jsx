import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonClients, postPersonClient } from "../../../../../redux/personClientActions.js";
import { getVehicles } from "../../../../../redux/vehicleActions.js";
import NewVehicle from '../../../Vehicles/NewVehicle/NewVehicle.jsx';

const NewPersonClient = ({ onClientAdded = () => {}, isNested = false }) => {
    const dispatch = useDispatch();
    
    const initialPersonClientState = {
        dni: '',
        name: '',
        email: '',
        phones: [],
        cuilCuit: '',
        vehicles: [] // Ahora es un array
    };
    
    const vehicles = useSelector(state => state.vehicle.vehicles);
    
    const [newPersonClient, setNewPersonClient] = useState(initialPersonClientState);
    const [alreadyExist, setAlreadyExist] = useState(false);
    const [currentPhone, setCurrentPhone] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPersonClient(prevState => ({ ...prevState, [name]: value }));
        if (name === 'dni') setAlreadyExist(false);
    };

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await dispatch(postPersonClient(newPersonClient));
            onClientAdded(response);
            console.log("Client successfully saved");
            setNewPersonClient(initialPersonClientState);
            dispatch(getPersonClients());
            dispatch(getVehicles());
        } catch (error) {
            console.error("Error saving person client:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className="component">
            <div className="title">
                <h2>NUEVO CLIENTE</h2>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>DNI</label>
                        <input type="text" name="dni" value={newPersonClient.dni} onChange={handleInputChange} />
                        {alreadyExist && <p>Ya existe un cliente con ese DNI.</p>}

                        <label>Nombre</label>
                        <input type="text" name="name" value={newPersonClient.name} onChange={handleInputChange} />

                        <label>Email</label>
                        <input type="text" name="email" value={newPersonClient.email} onChange={handleInputChange} />

                        <label>Teléfono</label>
                        <input type="text" value={currentPhone} onChange={(e) => setCurrentPhone(e.target.value)} placeholder="Añadir teléfono" />
                        <button type="button" onClick={addPhone}>Añadir</button>
                        <ul>{newPersonClient.phones.map((phone, index) => (
                            <li key={index}>{phone}<button type="button" onClick={() => removePhone(index)}>Eliminar</button></li>
                        ))}</ul>

                        {!isNested ? (
                            <>
                                <label>Vehículo(s)</label>
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={handleSearchFocus} onBlur={handleSearchBlur} onKeyDown={handleKeyDown} placeholder="Buscar vehículo" />
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
                                    {newPersonClient.vehicles.map((vehicle, index) => (
                                        <li key={index}>
                                            {vehicle.licensePlate}
                                            <button type="button" onClick={() => removeVehicle(index)}>Eliminar</button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                        <></>
                        )}

                        <label>CUIL/CUIT</label>
                        <input type="text" name="cuilCuit" value={newPersonClient.cuilCuit} onChange={handleInputChange} />

                        <button type="submit">Crear</button>
                    </div>
                </form>
                <div>
                    {!isNested && <NewVehicle onClientAdded={handleVehicleSelection} isNested={true}/>}
                </div>
            </div>
        </div>
    );
};

export default NewPersonClient;