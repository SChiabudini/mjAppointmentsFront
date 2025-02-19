import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMechanicalSheets, getAllMechanicalSheets, postMechanicalSheet } from "../../../../redux/mechanicalSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import clear from "../../../../assets/img/clear.png";
import clearHover from "../../../../assets/img/clearHover.png";
import loadingGif from "../../../../assets/img/loading.gif";

const NewMechanicalSheet = ({onMechanicalSheetAdded = () => {}}) => {

    const dispatch = useDispatch();

    const nowDate = new Date();

    const today = nowDate.toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' });
    
    const now = nowDate.toLocaleTimeString('es-AR', { 
        timeZone: 'America/Argentina/Buenos_Aires', 
        hour: '2-digit', 
        minute: '2-digit',
        hourCycle: 'h23'
    });

    const initialMechanicalSheetState = {
        date: `${today}T${now}`,
        personClient: null,
        companyClient: null,
        vehicle: null,
        kilometers: 0,
        keyWords: '',
        description: '',
        amount: 0
    }

    const [newMechanicalSheet, setNewMechanicalSheet] = useState(initialMechanicalSheetState);
    const [errorMessage, setErrorMessage] = useState(""); 
    const [loading, setLoading] = useState(false);

    //----- DISABLE BUTTON

    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(newMechanicalSheet.vehicle && newMechanicalSheet.kilometers && newMechanicalSheet.keyWords !== '' && newMechanicalSheet.description !== '' && newMechanicalSheet.amount){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [newMechanicalSheet]);

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

        if(name === "date"){
            setNewMechanicalSheet({
                ...newMechanicalSheet,
                date: `${value}T${newMechanicalSheet.date.split("T")[1]}`
            });
        };

        if(name === "time"){
            setNewMechanicalSheet({
                ...newMechanicalSheet,
                date: `${newMechanicalSheet.date.split("T")[0]}T${value}`
            });
        };
    
        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') {
                setDropdownVisibleClients(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setNewMechanicalSheet({ ...newMechanicalSheet, personClient: null, companyClient: null, vehicle: null });
            };
        };
    
        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') {
                setDropdownVisibleVehicles(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setNewMechanicalSheet({ ...newMechanicalSheet, personClient: null, companyClient: null, vehicle: null });
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
        if (searchingPerson) {
            setNewMechanicalSheet({ ...newMechanicalSheet, personClient: client._id, companyClient: null });
        } else {
            setNewMechanicalSheet({ ...newMechanicalSheet, companyClient: client._id, personClient: null });
        }

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
            if (newMechanicalSheet.personClient) {
                if (vehicle.personClient && vehicle.personClient._id === newMechanicalSheet.personClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else if (newMechanicalSheet.companyClient) {
                if (vehicle.companyClient && vehicle.companyClient._id === newMechanicalSheet.companyClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else {
                return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
            }
            return false; // Si no coincide con ningún filtro, no mostrar el vehículo
        });
    
        setFilteredVehicles(filteredVehicles);
    }, [searchTermVehicles, vehicles, newMechanicalSheet.personClient, newMechanicalSheet.companyClient]);

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

    //----- RESET

    const resetForm = () => {
        setSearchingPerson(true);
        setNewMechanicalSheet(initialMechanicalSheetState);
        setSearchTermClients('');
        setSearchTermVehicles('');
    }

    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter' && event.target.name !== 'description') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage("");

        const mechanicalSheetToSubmit = {
            ...newMechanicalSheet,
            kilometers: parseInt(newMechanicalSheet.kilometers, 10) || 0,
            amount: parseInt(newMechanicalSheet.amount, 10) || 0
        }

        try {
            const response = await dispatch(postMechanicalSheet(mechanicalSheetToSubmit));
            console.log("Mechanical sheet successfully saved");
            setLoading(false);

            if(newMechanicalSheet.personClient){
                dispatch(getPersonClients());
            }

            if(newMechanicalSheet.companyClient){
                dispatch(getCompanyClients());
            }

            dispatch(getVehicles());

            resetForm();
            dispatch(getMechanicalSheets());
            dispatch(getAllMechanicalSheets());
            onMechanicalSheetAdded(response);
        } catch (error) {
            setErrorMessage("*Error al crear ficha mecánica, revise los datos ingresados e intente nuevamente.");
            console.error("Error saving mechanical sheet:", error.message);
            setLoading(false);
        }
    };

    return(
        <div className="formContainer">
            <div className="titleForm">
                <h2>Nueva ficha mecánica</h2>
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
                        <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button" disabled={newMechanicalSheet.vehicle}>
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
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true} personClientId={newMechanicalSheet.personClient} companyClientId={newMechanicalSheet.companyClient}/>}
                <div className="clientSelection">
                    <div className="formRow">
                        <label style={{fontWeight: '600'}}>Cliente</label>
                    </div>
                    {newMechanicalSheet.personClient || newMechanicalSheet.companyClient ? 
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
                        <button onClick={() => setShowNewClient(!showNewClient)} type="button" disabled={newMechanicalSheet.personClient || newMechanicalSheet.companyClient}>
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
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newMechanicalSheet.vehicle}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newMechanicalSheet.vehicle}/>}
                <div className="formRow"></div>
                <form id="mechanicalSheetForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                <div className="formRowDate">
                    <label htmlFor="date">Fecha*</label>
                        <div>
                            <input 
                                type="date" 
                                name="date"
                                value={newMechanicalSheet.date.split("T")[0]}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="time" 
                                name="time"
                                value={newMechanicalSheet.date.split("T")[1]}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                    </div>
                    <div className="formRow">
                        <label htmlFor="kilometers">Kilómetros*</label>
                        <input type="number" name="kilometers" value={newMechanicalSheet.kilometers || ""} onChange={handleInputChange} min={0} onWheel={(event) => event.target.blur()}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="amount">Monto*</label>
                        <input type="number" name="amount" value={newMechanicalSheet.amount || ""} onChange={handleInputChange} min={0} onWheel={(event) => event.target.blur()}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="keyWords">Palabras clave*</label>
                        <input type="text" name="keyWords" value={newMechanicalSheet.keyWords} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label htmlFor="description">Descripción*</label></div>
                    <div className="formRow"><textarea name="description" value={newMechanicalSheet.description} onChange={handleInputChange} onKeyDown={handleTextareaKeyDown}/></div>
                    <div className="submit">
                        <button type='submit' form="mechanicalSheetForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Crear ficha"}</button>
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
};

export default NewMechanicalSheet;