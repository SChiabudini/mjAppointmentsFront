import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import { getServiceSheetById, getServiceSheets, putServiceSheet } from "../../../../redux/serviceSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";


const PutServiceSheet = ({onServiceSheetAdded = () => {}}) => {
    
    let { id } = useParams();
    const dispatch = useDispatch();

    const serviceSheetDetail = useSelector(state => state.serviceSheet?.serviceSheetDetail || {}); 

    const [editServiceSheet, setEditServiceSheet] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    // console.log(editServiceSheet);
      
    useEffect(() => {
        dispatch(getServiceSheetById(id));
    }, [dispatch, id])

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
            setEditServiceSheet({
                _id: serviceSheetDetail._id,
                date: serviceSheetDetail.date,
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
            });
        }
    }, [dispatch, id, serviceSheetDetail]);    

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        const validFields = ['kilometers', 'kmsToNextService', 'amount', 'personClient', 'companyClient', 'vehicle', 'oil', 'filters', 'notes'];
    
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
    
        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') setDropdownVisibleClients(false);
        };
    
        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') setDropdownVisibleVehicles(false);
        };

        setEditServiceSheet((prevState) => ({
            ...prevState,
            ...(name === 'searchTermClients' && value === '' && {
                personClient: null,
                companyClient: null,
            }),
            ...(name === 'searchTermVehicles' && value === '' && {
                vehicle: null,
            }),
        }));
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
    };

    //----- VEHICLES

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

    //----- SUBMIT

    const handleSubmit = async (event) => {
        event.preventDefault();

        const serviceSheetToSubmit = {
            ...editServiceSheet,
            kilometers: parseInt(editServiceSheet.kilometers, 10) || 0,
            kmsToNextService: parseInt(editServiceSheet.kmsToNextService, 10) || 0,
            amount: parseInt(editServiceSheet.amount, 10) || 0
        };

        try {
            console.log(serviceSheetToSubmit);
            const response = await dispatch(putServiceSheet(serviceSheetToSubmit));
            console.log("Service sheet successfully updated");

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
            dispatch(getServiceSheetById(id));
            onServiceSheetAdded(response);

        } catch (error) {
            console.error("Error updating service sheet:", error.message);
        }
    };

    return(
        <div className="formContainer">
            <div className="titleForm">
                <h2>Editar ficha service</h2>
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
                                    setEditServiceSheet({ ...editServiceSheet, personClient: null, companyClient: null });
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
                                    setEditServiceSheet({ ...editServiceSheet, personClient: null, companyClient: null });
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
                <form id="serviceSheetForm" onSubmit={handleSubmit}>
                    <div className="formRow">
                        <label htmlFor="kilometers">Kilómetros</label>
                        <input type="text" name="kilometers" value={editServiceSheet.kilometers} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="kmsToNextService">Kms próximo service</label>
                        <input type="text" name="kmsToNextService" value={editServiceSheet.kmsToNextService} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="oil">Aceite</label>
                        <input type="text" name="oil" value={editServiceSheet.oil} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label>Filtros</label></div>
                    <div className="filterSelectionInputs">
                        <label>
                            <input
                                type="checkbox"
                                name="filter"
                                value="Aceite"
                                checked={editServiceSheet.filters?.includes("Aceite")} // Verificar si está seleccionado
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
                        <label htmlFor="amount">Monto</label>
                        <input type="text" name="amount" value={editServiceSheet.amount} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label htmlFor="notes">Notas</label></div>
                    <div className="formRow"><textarea name="notes" value={editServiceSheet.notes} onChange={handleInputChange}/></div>
                    <div className="submit">
                        <button type='submit' form="serviceSheetForm">Editar ficha</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default PutServiceSheet;