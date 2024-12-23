import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewCompanyClient from '../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx';
import NewPersonClient from '../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx';
import NewVehicle from '../../Vehicles/NewVehicle/NewVehicle.jsx';
import { getAppointments, postAppointment } from '../../../../redux/appointmentActions.js';
import { getVehicles } from '../../../../redux/vehicleActions.js';
import { getPersonClients } from '../../../../redux/personClientActions.js';
import { getCompanyClients } from '../../../../redux/companyClientActions.js';

const NewAppointment = ({ onAppointmentAdded = () => {}, isNested = false }) => {
    
    const dispatch = useDispatch();

    const personClients = useSelector(state => state.personClient.personClients);
    const companyClients = useSelector(state => state.companyClient.companyClients);
    const vehicles = useSelector(state => state.vehicle.vehicles);

    const initialAppointmentState = {
        start: null,
        end: null,
        personClient: null,
        companyClient: null,
        vehicle: null,
        procedure: null
    };

    const initialProcedure = {
        title: '',       
        description: '',  
        service: false,
        mechanical: false,
    };

    const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
    const [newProcedure, setNewProcedure] = useState(initialProcedure);
    const [dropdownClientsVisible, setDropdownClientsVisible] = useState(false);
    const [showNewClient, setShowNewClient] = useState(false);
    const [searchingPerson, setSearchingPerson] = useState(true);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchClient, setSearchClient] = useState('');
    const [selectedClientIndex, setSelectedClientIndex] = useState(-1);
    const [dropdownVehiclesVisible, setDropdownVehicleVisible] = useState(false);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [searchVehicle, setSearchVehicle] = useState('');
    const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);
    // const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
// console.log(searchVehicle);

    useEffect(() => {
        const clients = searchingPerson ? personClients : companyClients;
        setFilteredClients(
        clients.filter(client => 
            client.name.toLowerCase().includes(searchClient.toLowerCase()) || 
            (client.dni && client.dni.toString().includes(searchClient))
        )
        );
    }, [searchClient, searchingPerson, personClients, companyClients]);    

    useEffect(() => {
        setFilteredVehicles(
            vehicles.filter(vehicle => 
                vehicle.licensePlate.toLowerCase().includes(searchVehicle.toLowerCase())
            )
        );
    }, [searchVehicle, vehicles]);
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        // if (event.target.value) {
        //     setIsClearDisabled(false);
        // }
    
        if (name === 'start' || name === 'end') {
            // Convertir la fecha a formato ISO 8601
            setNewAppointment({
                ...newAppointment,
                [name]: convertToISODate(value)
            });
        };
    };

    //-----------DATE-----------//
    // Función para convertir una fecha en formato ISO 8601
    const convertToISODate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString();
    };

    //-----------PROCEDURE-----------//
    const handleCheckboxProcedureChange = (option) => {

        setNewProcedure((prevProcedure) => {
            const updatedProcedure = {
                ...prevProcedure,
                [option]: !prevProcedure[option], // Cambiar el valor del procedimiento (service o mechanical)
            };
    
            // Actualizar el estado de newAppointment
            setNewAppointment((prevAppointment) => ({
                ...prevAppointment,
                procedure: updatedProcedure,
            }));
    
            return updatedProcedure;
        });
    };

    const handleProcedureChange = (event) => {
        const { name, value } = event.target;

        setNewProcedure((prevProcedure) => {
            const updatedProcedure = {
                ...prevProcedure,
                [name]: value, // Actualizar el campo correspondiente (title o description)
            };

            // Actualizar el estado de newAppointment
            setNewAppointment((prevAppointment) => ({
                ...prevAppointment,
                procedure: updatedProcedure,
            }));

            return updatedProcedure;
        });
    }; 

    //-----------CLIENT-----------//  
    const handleClientSelection = (client) => {
        const clientName = client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`;
    
        setSearchClient(clientName);
        setDropdownClientsVisible(false);

        setNewAppointment({
            ...newAppointment,
            personClient: searchingPerson ? client._id : null,
            companyClient: searchingPerson ? null : client._id,
        });
    };
    
    //-----------VEHICLE-----------//
    const handleVehicleSelection = (vehicle) => {
        setSearchVehicle(vehicle.licensePlate);
        setDropdownVehicleVisible(false);

        setNewAppointment({
            ...newAppointment,
            vehicle: vehicle._id,
        });
    };

    //-----------ATRIBUTES INPUTS-----------//
    const handleSearchFocus = (event) => {
        const { name } = event.target;

        if(name === 'searchClient') {
            setSelectedClientIndex(-1);
        };
        if(name === 'searchVehicle') {
            setSelectedVehicleIndex(-1);
        };
    };

    const handleSearchBlur = (event) => {
        const { name } = event.target;

        if(name === 'searchClient') {
            setTimeout(() => {
                setDropdownClientsVisible(false);
                setSelectedClientIndex(-1);
            }, 150);
        };
        if(name === 'searchVehicle') {
            setTimeout(() => {
                setDropdownVehicleVisible(false);
                setSelectedVehicleIndex(-1);
            }, 150);
        };

    };

    const handleKeyDown = (event) => {
        const { name } = event.target;

        if(name === 'searchClient') {
            if (event.key === 'ArrowDown') {
                setSelectedClientIndex((prev) => (prev + 1) % filteredClients.length);
            } else if (event.key === 'ArrowUp') {
                setSelectedClientIndex((prev) => (prev - 1 + filteredClients.length) % filteredClients.length);
            } else if (event.key === 'Enter' && selectedClientIndex >= 0) {
                handleClientSelection(filteredClients[selectedClientIndex]);
                setDropdownClientsVisible(false);
            } else {
                setDropdownClientsVisible(true);
            }
        };
        if(name === 'searchVehicle') {
            if (event.key === 'ArrowDown') {
                setSelectedVehicleIndex((prev) => (prev + 1) % filteredVehicles.length);
            } else if (event.key === 'ArrowUp') {
                setSelectedVehicleIndex((prev) => (prev - 1 + filteredVehicles.length) % filteredVehicles.length);
            } else if (event.key === 'Enter' && selectedVehicleIndex >= 0) {
                handleVehicleSelection(filteredVehicles[selectedVehicleIndex]);
                setDropdownVehicleVisible(false);
            } else {
                setDropdownVehicleVisible(true);
            }
        };
        
    };  

    //-----------VALIDATE-----------//
    const validateForm = () => {
        const isDateValid = newAppointment.start && newAppointment.end !== null;
        const isClientValid = newAppointment.personClient !== null || newAppointment.companyClient !== null;
        const isVehicleValid = newAppointment.vehicle !== null;
        const isProcedureValid = newAppointment.procedure !== '';

        setIsSubmitDisabled(!(isDateValid && isClientValid && isVehicleValid && isProcedureValid));
    };

    useEffect(() => {
        dispatch(getAppointments);
        validateForm();
    }, [newAppointment]);
    
    //-----------SUBMIT-----------//
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const appointmentData = {
            start: newAppointment.start,
            end: newAppointment.end, 
            personClient: newAppointment.personClient,
            companyClient: newAppointment.companyClient,
            vehicle: newAppointment.vehicle,
            procedure: newAppointment.procedure,
        };
    
        try {
            const response = await dispatch(postAppointment(appointmentData));
    
            if (response) {
                console.log("Appointment successfully saved");
                dispatch(getAppointments()); // Actualizar los turnos tras guardar
                setNewAppointment(initialAppointmentState); // Resetear el formulario
                onAppointmentAdded(response);
                setNewProcedure(initialProcedure);
                setSearchClient('');
                setSearchVehicle('');
                setShowNewClient(false);
                setShowNewVehicle(false);
            };

        } catch (error) {
            console.error("Error saving appointment:", error);
        }
    };
    
    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
            <div className="titleForm">
                <h2>Nuevo turno</h2>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit} id="appointmentForm">
                    <div>
                        <div className="formRow">
                            <div>Fecha y horario</div>
                        </div>
                        <div className="formRow">
                            <label htmlFor="start">Inicio</label>
                            <input 
                                type="datetime-local" 
                                name="start" 
                                value={newAppointment.start ? new Date(newAppointment.start).toISOString().slice(0, 16) : ''} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div className="formRow">
                            <label htmlFor="end">Finalización</label>
                            <input 
                                type="datetime-local" 
                                name="end" 
                                value={newAppointment.end ? new Date(newAppointment.end).toISOString().slice(0, 16) : ''} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div className="clientSelection">
                            <label>Procedimiento</label>
                            <div className="clientSelectionInputs">
                                <label htmlFor="service">
                                    <input 
                                        type="checkbox" 
                                        name="service" 
                                        id="service" 
                                        checked={newProcedure.service || false} 
                                        onChange={() => handleCheckboxProcedureChange('service')} 
                                    />
                                    Service
                                </label>                               
                                <label htmlFor="mechanical">
                                    <input 
                                        type="checkbox" 
                                        name="mechanical" 
                                        id="mechanical" 
                                        checked={newProcedure.mechanical || false} 
                                        onChange={() => handleCheckboxProcedureChange('mechanical')} 
                                    />
                                    Mecánica
                                </label>                                
                            </div>    
                            <div className="formRow">
                                <label htmlFor="title">Título</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={newProcedure.title || ''} 
                                    onChange={handleProcedureChange} 
                                />
                            </div>               
                            <div className="formRow">
                                <label htmlFor="description">Descripción</label>
                                <textarea
                                    name="description" 
                                    value={newProcedure.description || ''} 
                                    onChange={handleProcedureChange} 
                                />
                            </div> 
                        </div>
                        {!isNested ? (
                            <div className="clientSelection">                            
                                <label>Cliente</label>
                                <div className="clientSelectionInputs">
                                    <label htmlFor="personClient">
                                        <input 
                                        type="radio" 
                                        name="clientType" 
                                        value="person" 
                                        checked={searchingPerson}
                                        onChange={() => (setSearchingPerson(true), setSearchClient(''))}
                                        />
                                        Persona
                                    </label>
                                    <label htmlFor="companyClient">
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="company"
                                            checked={!searchingPerson}
                                            onChange={() => (setSearchingPerson(false), setSearchClient(''))}
                                        />
                                        Empresa
                                    </label>
                                </div>
                                <div className="searchRow">
                                    <input
                                        type="text"
                                        name="searchClient"
                                        placeholder={`Buscar ${searchingPerson ? 'persona' : 'empresa'}`}
                                        value={searchClient}
                                        // onChange={handleInputChange}
                                        onChange={(e) => setSearchClient(e.target.value)}
                                        onFocus={handleSearchFocus}
                                        onBlur={handleSearchBlur}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button type="button" onClick={() => setShowNewClient(!showNewClient)}>
                                        {showNewClient ? '-' : '+'}
                                    </button>                                 
                                </div>
                                <div className="searchRow">
                                    {filteredClients.length > 0 && dropdownClientsVisible && (
                                        <ul className="dropdown">
                                            {filteredClients.map((client, index) => (
                                                <li
                                                className={index === selectedClientIndex ? 'highlight' : ''}
                                                key={client._id}
                                                onClick={() => handleClientSelection(client)}
                                                >
                                                {client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>                               
                            </div>
                        ) : (<></>)} 
                        {!isNested ? (
                            <div>
                                <div className="formRow">
                                    <label>Vehículo(s)</label>
                                </div>
                                <div className="searchRow">
                                    <input 
                                        type="text" 
                                        name="searchVehicle" 
                                        value={searchVehicle} 
                                        // onChange={handleInputChange} 
                                        onChange={(e) => setSearchVehicle(e.target.value)}
                                        onFocus={handleSearchFocus} 
                                        onBlur={handleSearchBlur} 
                                        onKeyDown={handleKeyDown} 
                                        placeholder="Buscar vehículo" 
                                    />
                                    <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button">
                                        {showNewVehicle ? '-' : '+'}
                                    </button>                                
                                </div>
                                <div className="searchRow">
                                    {filteredVehicles.length > 0 && dropdownVehiclesVisible && (
                                        <ul className="dropdown">
                                            {filteredVehicles.map((vehicle, index) => (
                                                <li className={index === selectedClientIndex ? 'highlight' : ''} key={vehicle._id} onClick={() => handleVehicleSelection(vehicle)} >
                                                    {vehicle.licensePlate}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>     
                            </div>
                        ) : (
                            <></>
                        )}                 
                        {/* {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>} */}                       
                    </div>
                </form>
                <div className="submit">
                    {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true}/>}
                    {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true}/>}
                    {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true}/>}
                    <button type='submit' form="appointmentForm">Crear turno</button>
                </div>
            </div>
        </div>
    );
};

export default NewAppointment;