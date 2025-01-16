import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getVehicles, postVehicle } from '../../../../redux/vehicleActions.js';
import { getPersonClients } from '../../../../redux/personClientActions.js';
import { getCompanyClients } from '../../../../redux/companyClientActions.js';
import NewPersonClient from '../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx';
import NewCompanyClient from '../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx';
import clear from  "../../../../assets/img/clear.png";
import clearHover from "../../../../assets/img/clearHover.png";

const NewVehicle = ({ onVehicleAdded = () => {}, isNested = false, personClientId = null, companyClientId = null }) => {

    const dispatch = useDispatch();

    const initialVehicleState = {
        licensePlate: '',
        brand: '',
        model: '',
        year: 0,
        engine: '',
        personClient: personClientId,
        companyClient: companyClientId
    };

    const [newVehicle, setNewVehicle] = useState(initialVehicleState);
    const [alreadyExist, setAlreadyExist] = useState(false);

    //----- DISABLE BUTTON
    
    const [ disabled, setDisabled ] = useState(true);
    const [yearTooHigh, setYearTooHigh] = useState(false);

    useEffect(() => {

        const currentYear = new Date().getFullYear();

        if(newVehicle.licensePlate !== '' && newVehicle.brand !== '' && newVehicle.model !== '' && newVehicle.engine !== '' && newVehicle.year >= 1000 && newVehicle.year <= currentYear){
            setDisabled(false);
        } else {
            setDisabled(true);
        }

        if(newVehicle.year > currentYear){
            setYearTooHigh(true);
        } else {
            setYearTooHigh(false);
        }
    }, [newVehicle]);

    // ----- HANDLE INPUTS
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setNewVehicle({
            ...newVehicle,
            [name]: name === 'year' ? (value === '' ? '' : parseInt(value, 10) || 0) : value,
        });

        if (name === 'licensePlate') {
            setAlreadyExist(false);
        }

        if(name === 'searchTerm') setSearchTerm(value);
        if(name === 'searchTerm' && value === '') setDropdownVisible(false);
    };

    //----- HANDLE CLIENTS

    const personClients = useSelector(state => state.personClient.personClients);
    const companyClients = useSelector(state => state.companyClient.companyClients);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchingPerson, setSearchingPerson] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showNewClient, setShowNewClient] = useState(false);

    useEffect(() => {
        const clients = searchingPerson ? personClients : companyClients;
        setFilteredClients(
            clients.filter(client => 
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (client.dni && client.dni.toString().includes(searchTerm))
            )
        );
    }, [searchTerm, searchingPerson, personClients, companyClients]);

    const handleClientSelection = (client) => {
        console.log(client);
        
        const clientName = client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`;
        setSearchTerm(clientName);
        setDropdownVisible(false);
        if (searchingPerson) {
            setNewVehicle({ ...newVehicle, personClient: client._id, companyClient: null });
        } else {
            setNewVehicle({ ...newVehicle, companyClient: client._id, personClient: null });
        }
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setDropdownVisible(false);
            setSelectedIndex(-1);
        }, 150);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prev) => (prev + 1) % filteredClients.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev - 1 + filteredClients.length) % filteredClients.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            handleClientSelection(filteredClients[selectedIndex]);
            setDropdownVisible(false);
        } else {
            setDropdownVisible(true);
        }
    };

    //----- RESET

    const resetForm = () => {
        setNewVehicle(initialVehicleState);
        setSearchTerm('');
        setSearchingPerson(true);
    }

    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const vehicleToSubmit = {
            ...newVehicle,
            year: parseInt(newVehicle.year, 10) || 0,
        };

        try {
            const response = await dispatch(postVehicle(vehicleToSubmit));
            console.log("Vehicle successfully saved");

            if(newVehicle.personClient){
                dispatch(getPersonClients());
            }

            if(newVehicle.companyClient){
                dispatch(getCompanyClients());
            }

            setNewVehicle(initialVehicleState);
            setSearchTerm('');            
            setSearchingPerson(true);
            dispatch(getVehicles());
            onVehicleAdded(response);
        } catch (error) {
            console.error("Error saving vehicle:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
            <div className="titleForm">
                <h2>Nuevo vehículo</h2>
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
                <form id="vehicleForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                    <div className="formRow">
                        <label htmlFor="licensePlate">Patente*</label>
                        <input type="text" 
                        name="licensePlate" 
                        value={newVehicle.licensePlate} 
                        onChange={handleInputChange}/>
                    </div>
                    {alreadyExist && <div className="formRow"><p>Ya existe un vehículo con esa patente.</p></div>}
                    <div className="formRow">
                        <label htmlFor="brand">Marca*</label>
                        <input type="text" name="brand" value={newVehicle.brand} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="model">Modelo*</label>
                        <input type="text" name="model" value={newVehicle.model} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="year">Año*</label>
                        <input type="number" name="year" value={newVehicle.year || ''} onChange={(e) => {
                            const value = e.target.value;

                            if (value.length <= 4) {
                                handleInputChange(e);
                            }
                        }}/>
                    </div>
                    {yearTooHigh && <div className="formRow"><p>No puede ingresar un año superior al presente.</p></div>}
                    <div className="formRow">
                        <label htmlFor="engine">Motor*</label>
                        <input type="text" name="engine" value={newVehicle.engine} onChange={handleInputChange}/>
                    </div>
                    {!isNested ? (
                        <div className="clientSelection">
                            <label className="formRow">Cliente</label>
                            <div className="clientSelectionInputs">
                                <label>
                                    <input
                                        type="radio"
                                        name="clientType"
                                        value="person"
                                        checked={searchingPerson}
                                        onChange={() => (setSearchingPerson(true), setSearchTerm(''))}
                                    />
                                    Persona
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="clientType"
                                        value="company"
                                        checked={!searchingPerson}
                                        onChange={() => (setSearchingPerson(false), setSearchTerm(''))}
                                    />
                                    Empresa
                                </label>
                            </div>
                            <div className="searchRow">
                                <input
                                    type="text"
                                    name="searchTerm"
                                    placeholder={`Buscar ${searchingPerson ? 'persona' : 'empresa'}`}
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    onFocus={() => setSelectedIndex(-1)}
                                    onBlur={handleSearchBlur}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={() => setShowNewClient(!showNewClient)} type="button">
                                    {showNewClient ? '-' : '+'}
                                </button>                                 
                            </div>
                            <div className="searchRow">
                                {filteredClients?.length > 0 && dropdownVisible && (
                                    <ul className="dropdown">
                                        {filteredClients?.map((client, index) => (
                                            <li
                                            key={client._id}
                                            onClick={() => handleClientSelection(client)}
                                            className={index === selectedIndex ? 'highlight' : ''}
                                            >
                                            {client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ) : (<></>)}  
                </form>
                <div className={isNested ? "submitNested" : "submit"}>
                    {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true}/>}
                    {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true}/>}
                    <button type='submit' form="vehicleForm" disabled={disabled}>Crear vehículo</button>
                </div>
            </div>
        </div>
    )
};

export default NewVehicle;