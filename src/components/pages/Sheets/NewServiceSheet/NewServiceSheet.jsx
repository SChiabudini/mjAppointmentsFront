import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServiceSheets, getAllServiceSheets, postServiceSheet } from "../../../../redux/serviceSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import clear from "../../../../assets/img/clear.png";
import clearHover from "../../../../assets/img/clearHover.png";
import loadingGif from "../../../../assets/img/loading.gif";

const NewServiceSheet = ({onServiceSheetAdded = () => {}}) => {

    const dispatch = useDispatch();

    const nowDate = new Date();
    const today = nowDate.toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' });
    
    const now = nowDate.toLocaleTimeString('es-AR', { 
        timeZone: 'America/Argentina/Buenos_Aires', 
        hour: '2-digit', 
        minute: '2-digit',
        hourCycle: 'h23'
    });

    const initialServiceSheetState = {
        date: `${today}T${now}`,
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
    const [errorMessage, setErrorMessage] = useState(""); 
    const [loading, setLoading] = useState(false);

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
    
        const validFields = ['kilometers', 'kmsToNextService', 'amount', 'personClient', 'companyClient', 'vehicle', 'oil', 'filters', 'notes', 'date'];
    
        if (validFields.includes(name)) {
            setNewServiceSheet({
                ...newServiceSheet,
                [name]: ['kilometers', 'kmsToNextService', 'amount'].includes(name)
                    ? value === '' 
                        ? '' 
                        : parseInt(value, 10) || 0
                    : value,
            });
        };

        if(name === "date"){
            setNewServiceSheet({
                ...newServiceSheet,
                date: `${value}T${newServiceSheet.date.split("T")[1]}`
            });
        };

        if(name === "time"){
            setNewServiceSheet({
                ...newServiceSheet,
                date: `${newServiceSheet.date.split("T")[0]}T${value}`
            });
        };
    
        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') {
                setDropdownVisibleClients(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setNewServiceSheet({ ...newServiceSheet, personClient: null, companyClient: null, vehicle: null });
            };
        };
    
        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') {
                setDropdownVisibleVehicles(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setNewServiceSheet({ ...newServiceSheet, personClient: null, companyClient: null, vehicle: null });
            }
        };
    };

    const handleTextareaKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.stopPropagation();
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

        setNewServiceSheet({
            ...newServiceSheet,
            personClient: searchingPerson ? client._id : null,
            companyClient: searchingPerson ? null : client._id,
        });

        setShowNewClient(false);
    };

    //----- HANDLE VEHICLES

    const [searchTermVehicles, setSearchTermVehicles] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisibleVehicles, setDropdownVisibleVehicles] = useState(false);
    const [selectedIndexVehicles, setSelectedIndexVehicles] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    useEffect(() => {
        const filteredVehicles = vehicles.filter(vehicle => {
            if (newServiceSheet.personClient) {
                if (vehicle.personClient && vehicle.personClient._id === newServiceSheet.personClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else if (newServiceSheet.companyClient) {
                if (vehicle.companyClient && vehicle.companyClient._id === newServiceSheet.companyClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else {
                return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
            }
            return false; // Si no coincide con ningún filtro, no mostrar el vehículo
        });
    
        setFilteredVehicles(filteredVehicles);
    }, [searchTermVehicles, vehicles, newServiceSheet.personClient, newServiceSheet.companyClient]);

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

        setShowNewVehicle(false);
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
            setSelectedIndex((prev) => (prev + 1) % filteredItems?.length);
        } else if (event.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev - 1 + filteredItems?.length) % filteredItems?.length);
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
        if (event.key === 'Enter' && event.target.name !== 'notes') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage("");

        const serviceSheetToSubmit = {
            ...newServiceSheet,
            kilometers: parseInt(newServiceSheet.kilometers, 10) || 0,
            kmsToNextService: parseInt(newServiceSheet.kmsToNextService, 10) || 0,
            amount: parseInt(newServiceSheet.amount, 10) || 0
        };

        try {
            const response = await dispatch(postServiceSheet(serviceSheetToSubmit));
            console.log("Service sheet successfully saved");
            setLoading(false);

            if(newServiceSheet.personClient){
                dispatch(getPersonClients());
            }

            if(newServiceSheet.companyClient){
                dispatch(getCompanyClients());
            }

            dispatch(getVehicles());

            resetForm();
            dispatch(getServiceSheets());
            dispatch(getAllServiceSheets());
            onServiceSheetAdded(response);
        } catch (error) {
            setErrorMessage("*Error al crear ficha service, revise los datos ingresados e intente nuevamente.");
            console.error("Error saving service sheet:", error.message);
            setLoading(false);
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
                    <div className="formRow">
                        <label style={{fontWeight: '600'}}>Vehículo*</label>
                    </div>
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
                        {filteredVehicles?.length > 0 && dropdownVisibleVehicles && (
                            <ul className="dropdown">
                                {filteredVehicles?.map((vehicle, index) => (
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
                    <div className="formRow">
                        <label style={{fontWeight: '600'}}>Cliente</label>
                    </div>
                    {newServiceSheet.personClient || newServiceSheet.companyClient ? 
                        ( 
                            <></> 
                        ) : (
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
                        {filteredClients?.length > 0 && dropdownVisibleClients && (
                            <ul className="dropdown">
                                {filteredClients?.map((client, index) => (
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
                    <div className="formRowDate">
                        <label htmlFor="date">Fecha*</label>
                        <div>
                            <input 
                                type="date" 
                                name="date"
                                value={newServiceSheet.date.split("T")[0]}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="time" 
                                name="time"
                                value={newServiceSheet.date.split("T")[1]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="formRow">
                        <label htmlFor="kilometers">Kilómetros*</label>
                        <input type="number" name="kilometers" value={newServiceSheet.kilometers || ""} onChange={handleInputChange} min={0} onWheel={(event) => event.target.blur()}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="kmsToNextService">Kms próximo service*</label>
                        <input type="number" name="kmsToNextService" value={newServiceSheet.kmsToNextService || ""} min={0} onChange={handleInputChange} onWheel={(event) => event.target.blur()}/>
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
                        <input type="number" name="amount" value={newServiceSheet.amount || ""} min={0} onChange={handleInputChange} onWheel={(event) => event.target.blur()}/>
                    </div>
                    <div className="formRow"><label htmlFor="notes">Notas</label></div>
                    <div className="formRow"><textarea name="notes" value={newServiceSheet.notes} onChange={handleInputChange} onKeyDown={handleTextareaKeyDown}/></div>
                    <div className="submit">
                        <button type='submit' form="serviceSheetForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Crear ficha"}</button>
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
};

export default NewServiceSheet;