import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getVehicles, postVehicle } from '../../../../redux/vehicleActions.js';
import { getPersonClients } from '../../../../redux/personClientActions.js';
import { getCompanyClients } from '../../../../redux/companyClientActions.js';
import NewPersonClient from '../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx';
import NewCompanyClient from '../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx';

const NewVehicle = ({ onClientAdded = () => {}, isNested = false }) => {

    const dispatch = useDispatch();

    const initialVehicleState = {
        licensePlate: '',
        brand: '',
        model: '',
        year: 0,
        engine: '',
        personClient: null,
        companyClient: null
    };

    const [newVehicle, setNewVehicle] = useState(initialVehicleState);
    const [alreadyExist, setAlreadyExist] = useState(false);

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setNewVehicle({
        ...newVehicle,
        [name]: name === 'year' ? parseInt(value, 10) || 0 : value,
        });

        if (name === 'licensePlate') {
        setAlreadyExist(false);
        }
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
        if(personClients.length === 0){
        dispatch(getPersonClients());
        };

        if(companyClients.length === 0){
        dispatch(getCompanyClients());
        };

    }, [personClients, companyClients, dispatch]);

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
        const clientName = client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`;
        setSearchTerm(clientName);
        setDropdownVisible(false);
        if (searchingPerson) {
        setNewVehicle({ ...newVehicle, personClient: client._id, companyClient: null });
        } else {
        setNewVehicle({ ...newVehicle, companyClient: client._id, personClient: null });
        }
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
        setSelectedIndex((prev) => (prev + 1) % filteredClients.length);
        } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + filteredClients.length) % filteredClients.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
        handleClientSelection(filteredClients[selectedIndex]);
        }
    };

    //----- SUBMIT

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
        const response = await dispatch(postVehicle(newVehicle));
        console.log("Vehicle successfully saved");

        if(newVehicle.personClient){
            dispatch(getPersonClients());
        }

        if(newVehicle.companyClient){
            dispatch(getCompanyClients());
        }

        setNewVehicle(initialVehicleState);
        setSearchTerm('');
        dispatch(getVehicles());
        onClientAdded(response);

        } catch (error) {
        console.error("Error saving vehicle:", error.message);
        if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className="formContainer">
            <div className="title">
                <h2>NUEVO VEHÍCULO</h2>
                <div className="titleButtons">
                    {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
                </div>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="licensePlate">Patente</label>
                    <input type="text" name="licensePlate" value={newVehicle.licensePlate} onChange={handleInputChange}/>
                    {alreadyExist && <p>Ya existe un vehículo con esa patente.</p>}
                </div>
                <div>
                    <label htmlFor="brand">Marca</label>
                    <input type="text" name="brand" value={newVehicle.brand} onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="model">Modelo</label>
                    <input type="text" name="model" value={newVehicle.model} onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="year">Año</label>
                    <input type="number" name="year" value={newVehicle.year} onChange={handleInputChange}/>
                </div>
                <div>
                    <label htmlFor="engine">Motor</label>
                    <input type="text" name="engine" value={newVehicle.engine} onChange={handleInputChange}/>
                </div>
                {!isNested ? (
                    <div>
                        <label>Cliente</label>
                        <div>
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
                        <input
                            type="text"
                            placeholder={`Buscar ${searchingPerson ? 'persona' : 'empresa'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            onKeyDown={handleKeyDown}
                        />
                        {showNewClient ? (
                                <button onClick={() => setShowNewClient(false)}>˄</button>
                            ) : (
                                <button onClick={() => setShowNewClient(true)}>+</button>
                            )
                        }    
                        {filteredClients.length > 0 && dropdownVisible && (
                            <ul className="dropdown">
                            {filteredClients.map((client, index) => (
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

                        {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true}/>}


                        {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true}/>}
                    </div>
                ) : (<></>)}  
                <div>
                    <button type='submit'>Crear</button>
                </div>
                </form>
            </div>
        </div>
    )
};

export default NewVehicle;