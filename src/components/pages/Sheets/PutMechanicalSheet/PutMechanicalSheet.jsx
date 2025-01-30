import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import { getMechanicalSheetById, getMechanicalSheets, getAllMechanicalSheets, putMechanicalSheet } from "../../../../redux/mechanicalSheetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import reboot from  "../../../../assets/img/reboot.png";
import rebootHover from "../../../../assets/img/rebootHover.png";
import loadingGif from "../../../../assets/img/loading.gif";

const PutMechanicalSheet = ({onMechanicalSheetAdded = () => {}}) => {

    let { id } = useParams();
    const dispatch = useDispatch();

    const mechanicalSheetDetail = useSelector(state => state.mechanicalSheet?.mechanicalSheetDetail || {}); 

    const [editMechanicalSheet, setEditMechanicalSheet] = useState({});
    const [initialMechanicalSheet, setInitialMechanicalSheet] = useState({});
    const [errorMessage, setErrorMessage] = useState(""); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(getMechanicalSheetById(id));
    }, [dispatch, id])

    const formatDate = (date) => {
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours());
    
        return newDate.toISOString().slice(0, 16);
    }
    
    useEffect(() => {    
        if (mechanicalSheetDetail && mechanicalSheetDetail._id === id) {     
            if (mechanicalSheetDetail.personClient) {
                setSearchingPerson(true);
                setSearchTermClients(`${mechanicalSheetDetail.personClient.dni} - ${mechanicalSheetDetail.personClient.name}`);
            } else if (mechanicalSheetDetail.companyClient) {
                setSearchingPerson(false);
                setSearchTermClients(`${mechanicalSheetDetail.companyClient.cuit} - ${mechanicalSheetDetail.companyClient.name}`);
            } else {
                setSearchTermClients('');
            }   
            if (mechanicalSheetDetail.vehicle) {
                setSearchTermVehicles(`${mechanicalSheetDetail.vehicle.licensePlate}`);
            } else {
                setSearchTermVehicles('');
            }

            const updatedEditMechanicalSheet = {
                _id: mechanicalSheetDetail._id,
                date: formatDate(mechanicalSheetDetail.date),
                personClient: mechanicalSheetDetail.personClient ? mechanicalSheetDetail.personClient._id : null,
                companyClient: mechanicalSheetDetail.companyClient ? mechanicalSheetDetail.companyClient._id : null,
                vehicle: mechanicalSheetDetail.vehicle ? mechanicalSheetDetail.vehicle._id : null,
                kilometers: mechanicalSheetDetail.kilometers,
                keyWords: mechanicalSheetDetail.keyWords,
                description: mechanicalSheetDetail.description,
                amount: mechanicalSheetDetail.amount,
                number: mechanicalSheetDetail.number,
                active: mechanicalSheetDetail.active,
            };

            setEditMechanicalSheet(updatedEditMechanicalSheet);
            setInitialMechanicalSheet(updatedEditMechanicalSheet);
        }

    }, [dispatch, id, mechanicalSheetDetail]);   

    //----- DISABLE BUTTON
    
    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(editMechanicalSheet.vehicle && editMechanicalSheet.kilometers && editMechanicalSheet.keyWords !== '' && editMechanicalSheet.description !== '' && editMechanicalSheet.amount){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [editMechanicalSheet]);

    // ----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        const validFields = ['kilometers','amount', 'personClient', 'companyClient', 'vehicle', 'description', 'keyWords', 'date', 'time'];
    
        if (validFields.includes(name)) {
            setEditMechanicalSheet({
                ...editMechanicalSheet,
                [name]: ['kilometers', 'amount'].includes(name)
                    ? value === '' 
                        ? '' 
                        : parseInt(value, 10) || 0
                    : value,
            });
        };
    
        if(name === "date"){
            setEditMechanicalSheet({
                ...editMechanicalSheet,
                date: `${value}T${editMechanicalSheet.date.split("T")[1]}`
            });
        };

        if(name === "time"){
            setEditMechanicalSheet({
                ...editMechanicalSheet,
                date: `${editMechanicalSheet.date.split("T")[0]}T${value}`
            });
        };

        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') {
                setDropdownVisibleClients(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setEditMechanicalSheet({ ...editMechanicalSheet, personClient: null, companyClient: null, vehicle: null });
            };
        };
    
        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') {
                setDropdownVisibleVehicles(false);
                setSearchTermClients('');
                setSearchTermVehicles('');
                setEditMechanicalSheet({ ...editMechanicalSheet, personClient: null, companyClient: null, vehicle: null });
            }
        };
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
            setEditMechanicalSheet({ ...editMechanicalSheet, personClient: client._id, companyClient: null });
        } else {
            setEditMechanicalSheet({ ...editMechanicalSheet, companyClient: client._id, personClient: null });
        }
    };

    //----- HANDLE VEHICLES

    const [searchTermVehicles, setSearchTermVehicles] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisibleVehicles, setDropdownVisibleVehicles] = useState(false);
    const [selectedIndexVehicles, setSelectedIndexVehicles] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    useEffect(() => {
        const filteredVehicles = vehicles.filter(vehicle => {
            if (edieditMechanicalSheet.personClient) {
                if (vehicle.personClient && vehicle.personClient._id ===editMechanicalSheet.personClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else if (edieditMechanicalSheet.companyClient) {
                if (vehicle.companyClient && vehicle.companyClient._id ===editMechanicalSheet.companyClient) {
                    return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
                }
            } else {
                return vehicle.licensePlate.toLowerCase().includes(searchTermVehicles.toLowerCase());
            }
            return false; // Si no coincide con ningún filtro, no mostrar el vehículo
        });
    
        setFilteredVehicles(filteredVehicles);
    }, [searchTermVehicles, vehicles,editMechanicalSheet.personClient,editMechanicalSheet.companyClient]);

    const handleVehicleSelection = (vehicle) => {
        setSearchTermVehicles(vehicle.licensePlate);
        setDropdownVisibleVehicles(false);
        setEditMechanicalSheet((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));
    
        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setEditMechanicalSheet((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setEditMechanicalSheet((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setEditMechanicalSheet((prevState) => ({
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

    //----- RESET

    const resetForm = () => {
        setEditMechanicalSheet(initialMechanicalSheet);
        if (mechanicalSheetDetail.personClient) {
            setSearchTermClients(`${mechanicalSheetDetail.personClient.dni} - ${mechanicalSheetDetail.personClient.name}`);
        } else if (mechanicalSheetDetail.companyClient) {
            setSearchTermClients(`${mechanicalSheetDetail.companyClient.cuit} - ${mechanicalSheetDetail.companyClient.name}`);
        } else {
            setSearchTermClients('');
        }

        setSearchingPerson(mechanicalSheetDetail.personClient ? true : false);
    
        if (mechanicalSheetDetail.vehicle) {
            setSearchTermVehicles(mechanicalSheetDetail.vehicle?.licensePlate || '');
        } else {
            setSearchTermVehicles('');
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

        setLoading(true);
        setErrorMessage("");

        const mechanicalSheetToSubmit = {
            ...editMechanicalSheet,
            kilometers: parseInt(editMechanicalSheet.kilometers, 10) || 0,
            amount: parseInt(editMechanicalSheet.amount, 10) || 0
        }

        try {
            const response = await dispatch(putMechanicalSheet(mechanicalSheetToSubmit));
            console.log("Mechanical sheet successfully updated");
            setLoading(false);

            if(editMechanicalSheet.personClient){
                dispatch(getPersonClients());
            }

            if(editMechanicalSheet.companyClient){
                dispatch(getCompanyClients());
            }

            dispatch(getVehicles());

            setEditMechanicalSheet(editMechanicalSheet);
            setSearchTermClients('');
            setSearchTermVehicles('');
            dispatch(getMechanicalSheets());
            dispatch(getAllMechanicalSheets());
            dispatch(getMechanicalSheetById(id));
            onMechanicalSheetAdded(response);
        } catch (error) {
            setErrorMessage("*Error al editar ficha mecánica, revise los datos ingresados e intente nuevamente.");
            console.error("Error updating mechanical sheet:", error.message);
            setLoading(false);
        }
    };

    return(
        <div className="formContainer">
            <div className="titleForm">
                <h2>Editar ficha mecánica</h2>
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
                        <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button" disabled={editMechanicalSheet.vehicle}>
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
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true} personClientId={editMechanicalSheet.personClient} companyClientId={editMechanicalSheet.companyClient}/>}
                <div className="clientSelection">
                    <div className="formRow">
                        <label>Cliente</label>
                    </div>
                    {editMechanicalSheet.personClient || editMechanicalSheet.companyClient ? 
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
                                            setEditMechanicalSheet({ 
                                                ...editMechanicalSheet, 
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
                                            setEditMechanicalSheet({ 
                                                ...editMechanicalSheet, 
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
                        <button onClick={() => setShowNewClient(!showNewClient)} type="button" disabled={editMechanicalSheet.personClient || editMechanicalSheet.companyClient}>
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
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true} vehicleId={editMechanicalSheet.vehicle}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true} vehicleId={editMechanicalSheet.vehicle}/>}
                <div className="formRow"></div>
                <form id="mechanicalSheetForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                    <div className="formRowDate">
                        <label htmlFor="date">Fecha*</label>
                        <div>
                            <input 
                                type="date" 
                                name="date"
                                value={editMechanicalSheet.date?.split("T")[0]}
                                onChange={handleInputChange}
                            />
                            <input 
                                type="time" 
                                name="time"
                                value={editMechanicalSheet.date?.split("T")[1]}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="formRow">
                        <label htmlFor="kilometers">Kilómetros*</label>
                        <input type="number" name="kilometers" value={editMechanicalSheet.kilometers} onChange={handleInputChange} min={0}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="amount">Monto*</label>
                        <input type="number" name="amount" value={editMechanicalSheet.amount} onChange={handleInputChange} min={0}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="keyWords">Palabras clave*</label>
                        <input type="text" name="keyWords" value={editMechanicalSheet.keyWords} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow"><label htmlFor="description">Descripción*</label></div>
                    <div className="formRow"><textarea name="description" value={editMechanicalSheet.description} onChange={handleInputChange}/></div>
                    <div className="submit">
                        <button type='submit' form="mechanicalSheetForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Editar ficha"}</button>
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
};

export default PutMechanicalSheet;