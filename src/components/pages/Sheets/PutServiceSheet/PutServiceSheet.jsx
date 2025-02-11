import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import { getServiceSheetById, getServiceSheets, getAllServiceSheets, putServiceSheet } from "../../../../redux/serviceSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import reboot from  "../../../../assets/img/reboot.png";
import rebootHover from "../../../../assets/img/rebootHover.png";
import loadingGif from "../../../../assets/img/loading.gif";

const PutServiceSheet = ({onServiceSheetAdded = () => {}}) => {
    
    let { id } = useParams();
    const dispatch = useDispatch();

    const serviceSheetDetail = useSelector(state => state.serviceSheet?.serviceSheetDetail || {}); 

    const [editServiceSheet, setEditServiceSheet] = useState({});
    const [initialServiceSheet, setInitialServiceSheet] = useState({});
    const [errorMessage, setErrorMessage] = useState(""); 
    const [loading, setLoading] = useState(false);
      
    useEffect(() => {
        dispatch(getServiceSheetById(id));
    }, [dispatch, id])

    const formatDate = (date) => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours());
    
        return newDate.toISOString().slice(0, 16);
    }

    useEffect(() => {    
        if (serviceSheetDetail && serviceSheetDetail._id === id) {     
            if (serviceSheetDetail.personClient) {
                setSearchingPerson(true);
                setSearchTermClients(`${serviceSheetDetail.personClient.dni} - ${serviceSheetDetail.personClient.name}`);
            } else if (serviceSheetDetail.companyClient) {
                setSearchingPerson(false);
                setSearchTermClients(`${serviceSheetDetail.companyClient.cuit} - ${serviceSheetDetail.companyClient.name}`);
            } else {
                setSearchTermClients('');
            }   
            if (serviceSheetDetail.vehicle) {
                setSearchTermVehicles(`${serviceSheetDetail.vehicle.licensePlate}`);
            }

            const updatedEditServicelSheet = {
                _id: serviceSheetDetail._id,
                date: formatDate(serviceSheetDetail.date),
                personClient: serviceSheetDetail.personClient ? serviceSheetDetail.personClient._id : null,
                companyClient: serviceSheetDetail.companyClient ? serviceSheetDetail.companyClient._id : null,
                vehicle: serviceSheetDetail.vehicle ? serviceSheetDetail.vehicle._id : null,
                kilometers: serviceSheetDetail.kilometers,
                kmsToNextService: serviceSheetDetail.kmsToNextService,
                oil: serviceSheetDetail.oil,
                filters: serviceSheetDetail.filters || [],
                notes: serviceSheetDetail.notes,
                amount: serviceSheetDetail.amount,
                number: serviceSheetDetail.number,
                active: serviceSheetDetail.active,
            };

            setEditServiceSheet(updatedEditServicelSheet);
            setInitialServiceSheet(updatedEditServicelSheet);
        }
    }, [dispatch, id, serviceSheetDetail]);    

    //----- DISABLE BUTTON

    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(editServiceSheet.vehicle && editServiceSheet.kilometers && editServiceSheet.kmsToNextService && editServiceSheet.oil !== '' && editServiceSheet.filters?.length > 0 && editServiceSheet.amount){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [editServiceSheet]);

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        const validFields = ['kilometers', 'kmsToNextService', 'amount', 'personClient', 'companyClient', 'vehicle', 'oil', 'filters', 'notes', 'date', 'time'];
    
        if (validFields.includes(name)) {
            setEditServiceSheet({
                ...editServiceSheet,
                [name]: ['kilometers', 'kmsToNextService', 'amount'].includes(name)
                    ? value === '' 
                        ? '' 
                        : parseInt(value, 10) || 0
                    : value,
            });
        };

        if(name === "date"){
            setEditServiceSheet({
                ...editServiceSheet,
                date: `${value}T${editServiceSheet.date.split("T")[1]}`
            });
        };

        if(name === "time"){
            setEditServiceSheet({
                ...editServiceSheet,
                date: `${editServiceSheet.date.split("T")[0]}T${value}`
            });
        };
    
        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') {
                setDropdownVisibleClients(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setEditServiceSheet({ ...editServiceSheet, personClient: null, companyClient: null, vehicle: null });
            };
        };
    
        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') {
                setDropdownVisibleVehicles(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setEditServiceSheet({ ...editServiceSheet, personClient: null, companyClient: null, vehicle: null });
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

    const [searchingPerson, setSearchingPerson] = useState(true);
    const [searchTermClients, setSearchTermClients] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
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
            setEditServiceSheet({ ...editServiceSheet, personClient: client._id, companyClient: null });
        } else {
            setEditServiceSheet({ ...editServiceSheet, companyClient: client._id, personClient: null });
        }

        setShowNewClient(false);
    };

    //----- VEHICLES

    const [searchTermVehicles, setSearchTermVehicles] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisibleVehicles, setDropdownVisibleVehicles] = useState(false);
    const [selectedIndexVehicles, setSelectedIndexVehicles] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    useEffect(() => {
        const filteredVehicles = vehicles.filter(vehicle => {
            if (editServiceSheet.personClient) {
                if (vehicle.personClient && vehicle.personClient._id ===editServiceSheet.personClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else if (editServiceSheet.companyClient) {
                if (vehicle.companyClient && vehicle.companyClient._id ===editServiceSheet.companyClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else {
                return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
            }
            return false; // Si no coincide con ningún filtro, no mostrar el vehículo
        });
    
        setFilteredVehicles(filteredVehicles);
    }, [searchTermVehicles, vehicles,editServiceSheet.personClient,editServiceSheet.companyClient]);

    const handleVehicleSelection = (vehicle) => {
        setSearchTermVehicles(vehicle.licensePlate);
        setDropdownVisibleVehicles(false);
        setEditServiceSheet((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));
    
        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setEditServiceSheet((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setEditServiceSheet((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setEditServiceSheet((prevState) => ({
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

        setEditServiceSheet((prevState) => {
            const updatedFilters = checked
                ? [...prevState.filters, value] // Agregar el valor si está seleccionado
                : prevState.filters.filter((filter) => filter !== value); // Quitar el valor si no está seleccionado

            return { ...prevState, filters: updatedFilters };
        });
    };

    //----- RESET

    const resetForm = () => {
        setEditServiceSheet(initialServiceSheet);
        if (serviceSheetDetail.personClient) {
            setSearchTermClients(`${serviceSheetDetail.personClient.dni} - ${serviceSheetDetail.personClient.name}`);
        } else if (serviceSheetDetail.companyClient) {
            setSearchTermClients(`${serviceSheetDetail.companyClient.cuit} - ${serviceSheetDetail.companyClient.name}`);
        } else {
            setSearchTermClients('');
        }

        setSearchingPerson(serviceSheetDetail.personClient ? true : false);
    
        if (serviceSheetDetail.vehicle) {
            setSearchTermVehicles(serviceSheetDetail.vehicle?.licensePlate || '');
        } else {
            setSearchTermVehicles('');
        }
    };

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
            ...editServiceSheet,
            kilometers: parseInt(editServiceSheet.kilometers, 10) || 0,
            kmsToNextService: parseInt(editServiceSheet.kmsToNextService, 10) || 0,
            amount: parseInt(editServiceSheet.amount, 10) || 0
        };

        try {
            const response = await dispatch(putServiceSheet(serviceSheetToSubmit));
            console.log("Service sheet successfully updated");
            setLoading(false);

            if(editServiceSheet.personClient){
                dispatch(getPersonClients());
            }

            if(editServiceSheet.companyClient){
                dispatch(getCompanyClients());
            }

            dispatch(getVehicles());

            setEditServiceSheet(editServiceSheet);
            setSearchTermClients('');
            setSearchTermVehicles('');
            dispatch(getServiceSheets());
            dispatch(getAllServiceSheets());
            dispatch(getServiceSheetById(id));
            onServiceSheetAdded(response);

        } catch (error) {
            setErrorMessage("*Error al editar ficha service, revise los datos ingresados e intente nuevamente.");
            console.error("Error updating service sheet:", error.message);
            setLoading(false);
        }
    };

    return(
        <div className="formContainer">
            <div className="titleForm">
                <h2>Editar ficha service</h2>
                <div className="titleButtons">
                    <button 
                        onClick={resetForm} 
                        onMouseEnter={(e) => e.currentTarget.firstChild.src = rebootHover} 
                        onMouseLeave={(e) => e.currentTarget.firstChild.src = reboot}
                    >
                        <img src={reboot} alt="reboot"/>
                    </button>
                </div>
            </div>
            <div className="container">
                <div className="formRow">Los campos con (*) son obligatorios.</div>
                <div className="clientSelection">
                    <div className="formRow">
                        <label>Vehículo*</label>
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
                        <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button" disabled={editServiceSheet.vehicle}>
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
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true} personClientId={editServiceSheet.personClient} companyClientId={editServiceSheet.companyClient}/>}
                <div className="clientSelection">
                    <div className="formRow">
                        <label>Cliente</label>
                    </div>
                    {editServiceSheet.personClient || editServiceSheet.companyClient ? 
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
                                            setSearchTermVehicles('');
                                            setEditServiceSheet({ 
                                                ...editServiceSheet, 
                                                personClient: null, 
                                                companyClient: null,
                                                vehicle: null
                                            });
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
                                            setSearchTermVehicles('');
                                            setEditServiceSheet({ 
                                                ...editServiceSheet, 
                                                personClient: null, 
                                                companyClient: null,
                                                vehicle: null
                                            });
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
                        <button onClick={() => setShowNewClient(!showNewClient)} type="button" disabled={editServiceSheet.personClient || editServiceSheet.companyClient}>
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
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true} vehicleId={editServiceSheet.vehicle}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true} vehicleId={editServiceSheet.vehicle}/>}
                <div className="formRow"></div>
                <form id="serviceSheetForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                    <div className="formRowDate">
                        <label htmlFor="date">Fecha*</label>
                        <div>
                            <input 
                                type="date" 
                                name="date"
                                value={editServiceSheet.date?.split("T")[0]}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="time" 
                                name="time"
                                value={editServiceSheet.date?.split("T")[1]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="formRow">
                        <label htmlFor="kilometers">Kilómetros*</label>
                        <input type="number" name="kilometers" value={editServiceSheet.kilometers} onChange={handleInputChange} min={0} onWheel={(event) => event.target.blur()}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="kmsToNextService">Kms próximo service*</label>
                        <input type="number" name="kmsToNextService" value={editServiceSheet.kmsToNextService} onChange={handleInputChange} min={0} onWheel={(event) => event.target.blur()}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="oil">Aceite*</label>
                        <input type="text" name="oil" value={editServiceSheet.oil} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label>Filtros*</label></div>
                    <div className="filterSelectionInputs">
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Aceite"
                                checked={editServiceSheet.filters?.includes("Aceite")}
                                onChange={handleFilterChange}
                            />
                            Aceite
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Aire"
                                checked={editServiceSheet.filters?.includes("Aire")}
                                onChange={handleFilterChange}
                            />
                            Aire
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Habitáculo"
                                checked={editServiceSheet.filters?.includes("Habitáculo")}
                                onChange={handleFilterChange}
                            />
                            Habitáculo
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Combustible"
                                checked={editServiceSheet.filters?.includes("Combustible")}
                                onChange={handleFilterChange}
                            />
                            Combustible
                        </label>
                    </div>
                    <div className="formRow">
                        <label htmlFor="amount">Monto*</label>
                        <input type="number" name="amount" value={editServiceSheet.amount} onChange={handleInputChange} min={0} onWheel={(event) => event.target.blur()}/>
                    </div>
                    <div className="formRow"><label htmlFor="notes">Notas</label></div>
                    <div className="formRow"><textarea name="notes" value={editServiceSheet.notes} onChange={handleInputChange} onKeyDown={handleTextareaKeyDown}/></div>
                    <div className="submit">
                        <button type='submit' form="serviceSheetForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Editar ficha"}</button>
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
};

export default PutServiceSheet;