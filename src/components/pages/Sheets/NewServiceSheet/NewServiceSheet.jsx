import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServiceSheets, postServiceSheet } from "../../../../redux/serviceSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";

const NewServiceSheet = ({onServiceSheetAdded = () => {}}) => {

    const dispatch = useDispatch();

    const initialServiceSheetState = {
        personClient: null,
        companyClient: null,
        vehicle: null,
        kilometers: null,
        kmsToNextService: null,
        oil: '',
        filters: [],
        notes: '',
        amount: null
    }

    const [newServiceSheet, setNewServiceSheet] = useState(initialServiceSheetState);

    // ----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        const validFields = ['kilometers', 'kmsToNextService', 'amount', 'personClient', 'companyClient', 'vehicle', 'oil', 'filters', 'notes'];
    
        if (validFields.includes(name)) {
            setNewServiceSheet({
                ...newServiceSheet,
                [name]: ['kilometers', 'kmsToNextService', 'amount'].includes(name)
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

    useEffect(() => {
        if(personClients.length === 0){
            dispatch(getPersonClients());
        };

        if(companyClients.length === 0){
            dispatch(getCompanyClients());
        };

        if (vehicles.length === 0) {
            dispatch(getVehicles());
        }

    }, [personClients, companyClients, vehicles, dispatch]);

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
            setNewServiceSheet({ ...newServiceSheet, personClient: client._id, companyClient: null });
        } else {
            setNewServiceSheet({ ...newServiceSheet, companyClient: client._id, personClient: null });
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
        setNewServiceSheet({ ...newServiceSheet, vehicle: vehicle._id });
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const serviceSheetToSubmit = {
            ...newServiceSheet,
            kilometers: parseInt(newServiceSheet.kilometers, 10) || 0,
            kmsToNextService: parseInt(newServiceSheet.kmsToNextService, 10) || 0,
            amount: parseInt(newServiceSheet.amount, 10) || 0
        }

        try {
            console.log(serviceSheetToSubmit);
            const response = await dispatch(postServiceSheet(serviceSheetToSubmit));
            console.log("Service sheet successfully saved");

            if(newServiceSheet.personClient){
                dispatch(getPersonClients());
            }

            if(newServiceSheet.companyClient){
                dispatch(getCompanyClients());
            }

            dispatch(getVehicles());

            setNewServiceSheet(initialServiceSheetState);
            setSearchTermClients('');
            setSearchTermVehicles('');
            dispatch(getServiceSheets());
            onServiceSheetAdded(response);
        } catch (error) {
            console.error("Error saving service sheet:", error.message);
        }
    };

    return(
        <div className="formContainer">
            <div className="titleForm">
                <h2>Nueva ficha service</h2>
                <div className="titleButtons">
                    {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
                </div>
            </div>
            <div className="container">
                <div className="clientSelection">
                        <label>Cliente</label>
                        <div className="clientSelectionInputs">
                            <label>
                                <input
                                    type="radio"
                                    name="clientType"
                                    value="person"
                                    checked={searchingPerson}
                                    onChange={() => (setSearchingPerson(true), setSearchTermClients(''))}
                                />
                                Persona
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="clientType"
                                    value="company"
                                    checked={!searchingPerson}
                                    onChange={() => (setSearchingPerson(false), setSearchTermClients(''))}
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
                            <button onClick={() => setShowNewClient(!showNewClient)} type="button">
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
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newServiceSheet.vehicle}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newServiceSheet.vehicle}/>}
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
                        <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button">
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
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true} personClientId={newServiceSheet.personClient} companyClientId={newServiceSheet.companyClient}/>}
                <form id="serviceSheetForm" onSubmit={handleSubmit}>
                    <div className="submit">
                        <button type='submit' form="serviceSheetForm">Crear ficha</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default NewServiceSheet;