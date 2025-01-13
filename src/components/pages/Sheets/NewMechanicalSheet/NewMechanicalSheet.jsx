import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMechanicalSheets, postMechanicalSheet } from "../../../../redux/mechanicalSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";

const NewMechanicalSheet = ({onMechanicalSheetAdded = () => {}}) => {

    const dispatch = useDispatch();

    const initialMechanicalSheetState = {
        personClient: null,
        companyClient: null,
        vehicle: null,
        kilometers: null,
        keyWords: '',
        description: '',
        amount: null
    }

    const [newMechanicalSheet, setNewMechanicalSheet] = useState(initialMechanicalSheetState);

    // ----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        const validFields = ['kilometers','amount', 'personClient', 'companyClient', 'vehicle', 'description', 'keyWords'];
    
        if (validFields.includes(name)) {
            setNewMechanicalSheet({
                ...newMechanicalSheet,
                [name]: ['kilometers', 'amount'].includes(name)
                    ? value === '' 
                        ? '' 
                        : parseInt(value, 10) || 0
                    : value,
            });
        }
    
        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') setDropdownVisibleClients(false);
        }
    
        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') setDropdownVisibleVehicles(false);
        }
    };

    //----- LOAD CLIENTS AND VEHICLES OPTIONS

    const personClients = useSelector(state => state.personClient.personClients);
    const companyClients = useSelector(state => state.companyClient.companyClients);
    const vehicles = useSelector(state => state.vehicle.vehicles);

    //----- HANDLE CLIENTS

    const [searchTermClients, setSearchTermClients] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchingPerson, setSearchingPerson] = useState(true);
    const [dropdownVisibleClients, setDropdownVisibleClients] = useState(false);
    const [selectedIndexClients, setSelectedIndexClients] = useState(-1);
    const [showNewClient, setShowNewClient] = useState(false);

    useEffect(() => {
        const clients = searchingPerson ? personClients : companyClients;
        setFilteredClients(
        clients.filter(client => 
            client.name.toLowerCase().includes(searchTermClients.toLowerCase()) || 
            (client.dni && client.dni.toString().includes(searchTermClients))
        )
        );
    }, [searchTermClients, searchingPerson, personClients, companyClients]);

    const handleClientSelection = (client) => {
        const clientName = client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`;
        setSearchTermClients(clientName);
        setDropdownVisibleClients(false);
        if (searchingPerson) {
            setNewMechanicalSheet({ ...newMechanicalSheet, personClient: client._id, companyClient: null });
        } else {
            setNewMechanicalSheet({ ...newMechanicalSheet, companyClient: client._id, personClient: null });
        }
    };

    //----- HANDLE VEHICLES
    

    const [searchTermVehicles, setSearchTermVehicles] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisibleVehicles, setDropdownVisibleVehicles] = useState(false);
    const [selectedIndexVehicles, setSelectedIndexVehicles] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    useEffect(() => {
        setFilteredVehicles(
            vehicles.filter(vehicle => 
                vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase())
            )
        );
    }, [searchTermVehicles, vehicles]);

    const handleVehicleSelection = (vehicle) => {
        setSearchTermVehicles(vehicle.licensePlate);
        setDropdownVisibleVehicles(false);
        setNewMechanicalSheet((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));
    
        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setNewMechanicalSheet((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setNewMechanicalSheet((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setNewMechanicalSheet((prevState) => ({
                ...prevState,
                personClient: null,
                companyClient: null
            }));
            setSearchingPerson(true);
        }
    };
    
    //----- DROPDOWN

    const handleSearchBlur = (event) => {
        const { name } = event.target;
    
        setTimeout(() => {
            if (name === "searchTermClients") {
                setDropdownVisibleClients(false);
                setSelectedIndexClients(-1);
            } else if (name === "searchTermVehicles") {
                setDropdownVisibleVehicles(false);
                setSelectedIndexVehicles(-1);
            }
        }, 150);
    };

    const handleKeyDown = (event) => {
        const { name } = event.target;
        let setSelectedIndex, setDropdownVisible, filteredItems, handleSelection, selectedIndex;
    
        // Determinar qué input está invocando la función
        if (name === "searchTermClients") {
            setSelectedIndex = setSelectedIndexClients;
            setDropdownVisible = setDropdownVisibleClients;
            filteredItems = filteredClients;
            handleSelection = handleClientSelection;
            selectedIndex = selectedIndexClients;
        } else if (name === "searchTermVehicles") {
            setSelectedIndex = setSelectedIndexVehicles;
            setDropdownVisible = setDropdownVisibleVehicles;
            filteredItems = filteredVehicles;
            handleSelection = handleVehicleSelection;
            selectedIndex = selectedIndexVehicles;
        }
    
        // Lógica común
        if (event.key === 'ArrowDown') {
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (event.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
            handleSelection(filteredItems[selectedIndex]);
            setDropdownVisible(false);
        } else {
            setDropdownVisible(true);
        }
    };

    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const mechanicalSheetToSubmit = {
            ...newMechanicalSheet,
            kilometers: parseInt(newMechanicalSheet.kilometers, 10) || 0,
            amount: parseInt(newMechanicalSheet.amount, 10) || 0
        }

        try {
            const response = await dispatch(postMechanicalSheet(mechanicalSheetToSubmit));
            console.log("Mechanical sheet successfully saved");

            if(newMechanicalSheet.personClient){
                dispatch(getPersonClients());
            }

            if(newMechanicalSheet.companyClient){
                dispatch(getCompanyClients());
            }

            dispatch(getVehicles());

            setNewMechanicalSheet(initialMechanicalSheetState);
            setSearchTermClients('');
            setSearchTermVehicles('');
            dispatch(getMechanicalSheets());
            onMechanicalSheetAdded(response);
        } catch (error) {
            console.error("Error saving mechanical sheet:", error.message);
        }
    };

    return(
        <div className="formContainer">
            <div className="titleForm">
                <h2>Nueva ficha mecánica</h2>
                <div className="titleButtons">
                    {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
                </div>
            </div>
            <div className="container">
                <div className="clientSelection">
                    <label className="formRow">Vehículo</label>
                    <div className="searchRow">
                        <input
                            type="text"
                            name="searchTermVehicles"
                            placeholder="Buscar vehículo"
                            value={searchTermVehicles}
                            onChange={handleInputChange}
                            onFocus={() => setSelectedIndexVehicles(-1)}
                            onBlur={handleSearchBlur}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button" disabled={newMechanicalSheet.vehicle}>
                            {showNewVehicle ? '-' : '+'}
                        </button>                                  
                    </div>
                    <div className="searchRow">
                        {filteredVehicles.length > 0 && dropdownVisibleVehicles && (
                            <ul className="dropdown">
                                {filteredVehicles.map((vehicle, index) => (
                                    <li
                                    key={vehicle._id}
                                    onClick={() => handleVehicleSelection(vehicle)}
                                    className={index === selectedIndexVehicles ? 'highlight' : ''}
                                    >
                                    {vehicle.licensePlate}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true} personClientId={newMechanicalSheet.personClient} companyClientId={newMechanicalSheet.companyClient}/>}
                <div className="clientSelection">
                        <label className="formRow">Cliente</label>
                            <div className="clientSelectionInputs">
                                <label>
                                    <input
                                        type="radio"
                                        name="clientType"
                                        value="person"
                                        checked={searchingPerson}
                                        onChange={() => {
                                            setSearchingPerson(true);
                                            setSearchTermClients('');
                                        }}
                                    />
                                    Persona
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="clientType"
                                        value="company"
                                        checked={!searchingPerson}
                                        onChange={() => {
                                            setSearchingPerson(false);
                                            setSearchTermClients('');
                                        }}
                                    />
                                    Empresa
                                </label>
                            </div>
                        <div className="searchRow">
                            <input
                                type="text"
                                name="searchTermClients"
                                placeholder={`Buscar ${searchingPerson ? 'persona' : 'empresa'}`}
                                value={searchTermClients}
                                onChange={handleInputChange}
                                onFocus={() => setSelectedIndexClients(-1)}
                                onBlur={handleSearchBlur}
                                onKeyDown={handleKeyDown}
                            />
                            <button onClick={() => setShowNewClient(!showNewClient)} type="button" disabled={newMechanicalSheet.personClient || newMechanicalSheet.companyClient}>
                                {showNewClient ? '-' : '+'}
                            </button>                                 
                        </div>
                        <div className="searchRow">
                            {filteredClients.length > 0 && dropdownVisibleClients && (
                                <ul className="dropdown">
                                    {filteredClients.map((client, index) => (
                                        <li
                                        key={client._id}
                                        onClick={() => handleClientSelection(client)}
                                        className={index === selectedIndexClients ? 'highlight' : ''}
                                        >
                                        {client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                </div>
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newMechanicalSheet.vehicle}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newMechanicalSheet.vehicle}/>}
                <div className="formRow"></div>
                <form id="mechanicalSheetForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                    <div className="formRow">
                        <label htmlFor="kilometers">Kilómetros</label>
                        <input type="text" name="kilometers" value={newMechanicalSheet.kilometers} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="amount">Monto</label>
                        <input type="text" name="amount" value={newMechanicalSheet.amount} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="keyWords">Palabras clave</label>
                        <input type="text" name="keyWords" value={newMechanicalSheet.keyWords} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label htmlFor="description">Descripción</label></div>
                    <div className="formRow"><textarea name="description" value={newMechanicalSheet.description} onChange={handleInputChange}/></div>
                    <div className="submit">
                        <button type='submit' form="mechanicalSheetForm">Crear ficha</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default NewMechanicalSheet;