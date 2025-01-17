import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServiceSheets, postServiceSheet } from "../../../../redux/serviceSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import clear from "../../../../assets/img/clear.png";
import clearHover from "../../../../assets/img/clearHover.png";

const NewServiceSheet = ({onServiceSheetAdded = () => {}}) => {

    const dispatch = useDispatch();

    const initialServiceSheetState = {
        personClient: null,
        companyClient: null,
        vehicle: null,
        kilometers: 0,
        kmsToNextService: 0,
        oil: '',
        filters: [],
        notes: '',
        amount: 0
    }

    const [newServiceSheet, setNewServiceSheet] = useState(initialServiceSheetState);

    //----- DISABLE BUTTON

    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(newServiceSheet.vehicle && newServiceSheet.kilometers && newServiceSheet.kmsToNextService && newServiceSheet.oil !== '' && newServiceSheet.filters?.length > 0 && newServiceSheet.amount){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [newServiceSheet]);

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
        setNewServiceSheet((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));
    
        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setNewServiceSheet((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setNewServiceSheet((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setNewServiceSheet((prevState) => ({
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

    //----- HANDLE FILTERS

    const handleFilterChange = (event) => {
        const { value, checked } = event.target;

        setNewServiceSheet((prevState) => {
            const updatedFilters = checked
                ? [...prevState.filters, value] // Agregar el valor si está seleccionado
                : prevState.filters.filter((filter) => filter !== value); // Quitar el valor si no está seleccionado

            return { ...prevState, filters: updatedFilters };
        });
    };

    //----- RESET

    const resetForm = () => {
        setSearchingPerson(true);
        setNewServiceSheet(initialServiceSheetState);
        setSearchTermClients('');
        setSearchTermVehicles('');
    }

    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const serviceSheetToSubmit = {
            ...newServiceSheet,
            kilometers: parseInt(newServiceSheet.kilometers, 10) || 0,
            kmsToNextService: parseInt(newServiceSheet.kmsToNextService, 10) || 0,
            amount: parseInt(newServiceSheet.amount, 10) || 0
        };

        try {
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
            setSearchingPerson(true);
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
                <div className="clientSelection">
                    <label className="formRow">Vehículo*</label>
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
                        <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button" disabled={newServiceSheet.vehicle}>
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
                <div className="clientSelection">
                    <label className="formRow">Cliente</label>
                    {newServiceSheet.personClient || newServiceSheet.companyClient ? 
                        <></> :
                        (
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
                        )
                    }
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
                        <button onClick={() => setShowNewClient(!showNewClient)} type="button" disabled={newServiceSheet.personClient || newServiceSheet.companyClient}>
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
                <div className="formRow"></div>
                <form id="serviceSheetForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                    <div className="formRow">
                        <label htmlFor="kilometers">Kilómetros*</label>
                        <input type="number" name="kilometers" value={newServiceSheet.kilometers || ""} onChange={handleInputChange} min={0}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="kmsToNextService">Kms próximo service*</label>
                        <input type="number" name="kmsToNextService" value={newServiceSheet.kmsToNextService || ""} min={0} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="oil">Aceite*</label>
                        <input type="text" name="oil" value={newServiceSheet.oil} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label>Filtros*</label></div>
                    <div className="filterSelectionInputs">
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Aceite"
                                checked={newServiceSheet.filters.includes("Aceite")}
                                onChange={handleFilterChange}
                            />
                            Aceite
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Aire"
                                onChange={handleFilterChange}
                                checked={newServiceSheet.filters.includes("Aire")}
                            />
                            Aire
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Habitáculo"
                                onChange={handleFilterChange}
                                checked={newServiceSheet.filters.includes("Habitáculo")}
                            />
                            Habitáculo
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Combustible"
                                onChange={handleFilterChange}
                                checked={newServiceSheet.filters.includes("Combustible")}
                            />
                            Combustible
                        </label>
                    </div>
                    <div className="formRow">
                        <label htmlFor="amount">Monto*</label>
                        <input type="number" name="amount" value={newServiceSheet.amount || ""} min={0} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label htmlFor="notes">Notas</label></div>
                    <div className="formRow"><textarea name="notes" value={newServiceSheet.notes} onChange={handleInputChange}/></div>
                    <div className="submit">
                        <button type='submit' form="serviceSheetForm" disabled={disabled}>Crear ficha</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default NewServiceSheet;