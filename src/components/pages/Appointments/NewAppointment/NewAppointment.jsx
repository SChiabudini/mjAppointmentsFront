import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewCompanyClient from '../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx';
import NewPersonClient from '../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx';
import NewVehicle from '../../Vehicles/NewVehicle/NewVehicle.jsx';
import { getAppointments, getAllAppointments, postAppointment } from '../../../../redux/appointmentActions.js';
import clear from  "../../../../assets/img/clear.png";
import clearHover from "../../../../assets/img/clearHover.png";
import loadingGif from "../../../../assets/img/loading.gif";

const NewAppointment = ({ onAppointmentAdded = () => {} }) => {
    
    const dispatch = useDispatch();

    const initialProcedure = {
        title: '',       
        description: '',  
        service: false,
        mechanical: false,
    };

    const [newProcedure, setNewProcedure] = useState(initialProcedure);

    const initialAppointmentState = {
        start: '',
        end: '',
        personClient: null,
        companyClient: null,
        vehicle: null,
        procedure: {newProcedure}
    };

    const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
    const [errorMessage, setErrorMessage] = useState({
        startTime: '',
        endTime: '',
        submit: ''
    }); 
    const [loading, setLoading] = useState(false);

    //----- DISABLE BUTTON
    
    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(newAppointment.start !== "" && newAppointment.end !== "" && newAppointment.vehicle && (newAppointment.personClient || newAppointment.companyClient) && newAppointment.procedure.title !== "" && (newAppointment.procedure.service || newAppointment.procedure.mechanical)){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [newAppointment]);

    //----- DATE

    const [tempDates, setTempDates] = useState({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
    });

    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000).toISOString().split("T")[0];

    const handleInputDate = (event) => {
        const { name, value } = event.target;

        // Actualiza el estado temporal de las fechas y horas
        setTempDates((prev) => {
            const updatedDates = { ...prev, [name]: value };

            // Verifica si ambas partes (fecha y hora) están presentes para "start"
            if (name === "startDate" || name === "startTime") {
                if (updatedDates.startDate && updatedDates.startTime) {
                    setNewAppointment((prev) => ({
                        ...prev,
                        start: `${updatedDates.startDate}T${updatedDates.startTime}`,
                    }));
                }
            }

            // Verifica si ambas partes (fecha y hora) están presentes para "end"
            if (name === "endDate" || name === "endTime") {
                if (updatedDates.endDate && updatedDates.endTime) {
                    setNewAppointment((prev) => ({
                        ...prev,
                        end: `${updatedDates.endDate}T${updatedDates.endTime}`,
                    }));
                }
            }

            return updatedDates; // Devuelve el estado temporal actualizado
        });
    };

    const handleTimeInput = (e, type) => {
        const value = e.target.value;

        if (value < "07:00" || value > "16:59") {
            e.target.value = ""; // Limpia el input si el valor no es válido
            setErrorMessage(prevErrors => ({
                ...prevErrors,
                [type]: "Horario no válido. Selecciona entre 07:00 y 16:59."
            }));
        } else {
            setErrorMessage(prevErrors => ({
                ...prevErrors,
                [type]: ''
            }));
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

        setNewAppointment({
            ...newAppointment,
            personClient: searchingPerson ? client._id : null,
            companyClient: searchingPerson ? null : client._id,
        });
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

        setNewAppointment((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));

        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setNewAppointment((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setNewAppointment((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setNewAppointment((prevState) => ({
                ...prevState,
                personClient: null,
                companyClient: null
            }));
            setSearchingPerson(true);
        }
    };

    //----- DROPDOWN

    const handleSearchFocus = (event) => {
        const { name } = event.target;

        if(name === 'searchTermClients') {
            setSelectedIndexClients(-1);
        };
        if(name === 'searchTermVehicles') {
            setSelectedIndexVehicles(-1);
        };
    };

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

        if(name === 'searchTermClients') {
            if (event.key === 'ArrowDown') {
                setSelectedIndexClients((prev) => (prev + 1) % filteredClients?.length);
            } else if (event.key === 'ArrowUp') {
                setSelectedIndexClients((prev) => (prev - 1 + filteredClients?.length) % filteredClients?.length);
            } else if (event.key === 'Enter' && selectedIndexClients >= 0) {
                handleClientSelection(filteredClients[selectedIndexClients]);
                setDropdownVisibleClients(false);
            } else {
                setDropdownVisibleClients(true);
            }
        };
        if(name === 'searchTermVehicles') {
            if (event.key === 'ArrowDown') {
                setSelectedIndexVehicles((prev) => (prev + 1) % filteredVehicles?.length);
            } else if (event.key === 'ArrowUp') {
                setSelectedIndexVehicles((prev) => (prev - 1 + filteredVehicles?.length) % filteredVehicles?.length);
            } else if (event.key === 'Enter' && selectedIndexVehicles >= 0) {
                handleVehicleSelection(filteredVehicles[selectedIndexVehicles]);
                setDropdownVisibleVehicles(false);
            } else {
                setDropdownVisibleVehicles(true);
            }
        };
        
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

    //----- RESET

    const resetForm = () => {
        setNewAppointment(initialAppointmentState);
        setTempDates({
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: ''
        });
        setNewProcedure(initialProcedure);
        setSearchingPerson(true);
        setSearchTermClients('');
        setSearchTermVehicles('');
        setErrorMessage({
            startTime: '',
            endTime: '',
            submit: ''
        });
    };
    
    //-----------SUBMIT-----------//

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        setLoading(true);
        setErrorMessage({
            startTime: '',
            endTime: '',
            submit: ''
        });

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
                setLoading(false);
                console.log("Appointment successfully saved");
                dispatch(getAppointments());
                dispatch(getAllAppointments());
                onAppointmentAdded(response);
                resetForm();
            };

        } catch (error) {
            // setErrorMessage("*Error al crear turno, revise los datos ingresados e intente nuevamente.");
            setErrorMessage(prevErrors => ({
                ...prevErrors,
                submit: "*Error al crear turno, revise los datos ingresados e intente nuevamente."
            }));
            console.error("Error saving appointment:", error);
            setLoading(false);
        }
    };
    
    return (
        <div className="formContainer">
            <div className="titleForm">
                <h2>Nuevo turno</h2>
                <div className="titleButtons">
                    <button 
                        onClick={resetForm} 
                        onMouseEnter={(e) => e.currentTarget.firstChild.src = clearHover} 
                        onMouseLeave={(e) => e.currentTarget.firstChild.src = clear}
                    >
                        <img src={clear} alt="Clear"/>
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
                            value={searchTermVehicles} 
                            onChange={(e) => setSearchTermVehicles(e.target.value)}
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
                        {filteredVehicles?.length > 0 && dropdownVisibleVehicles && (
                            <ul className="dropdown">
                                {filteredVehicles?.map((vehicle, index) => (
                                    <li className={index === selectedIndexClients ? 'highlight' : ''} key={vehicle._id} onClick={() => handleVehicleSelection(vehicle)} >
                                        {vehicle.licensePlate}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>     
                </div>
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true}/>}
                <div className="clientSelection">                            
                    <label>Cliente*</label>
                    <div className="clientSelectionInputs">
                        <label htmlFor="personClient">
                            <input 
                            type="radio" 
                            name="clientType" 
                            value="person" 
                            checked={searchingPerson}
                            onChange={() => (setSearchingPerson(true), setSearchTermClients(''))}
                            />
                            Persona
                        </label>
                        <label htmlFor="companyClient">
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
                            onChange={(e) => setSearchTermClients(e.target.value)}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            onKeyDown={handleKeyDown}
                        />
                        <button type="button" onClick={() => setShowNewClient(!showNewClient)}>
                            {showNewClient ? '-' : '+'}
                        </button>                                 
                    </div>
                    <div className="searchRow">
                        {filteredClients?.length > 0 && dropdownVisibleClients && (
                            <ul className="dropdown">
                                {filteredClients?.map((client, index) => (
                                    <li
                                    className={index === selectedIndexClients ? 'highlight' : ''}
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
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true}/>}
                <form onSubmit={handleSubmit} id="appointmentForm" onKeyDown={handleNoSend}>
                    <div>
                        <div className="formRow">
                            <div>Fecha y horario</div>
                        </div>
                        <div className="formRowDate">
                            <label htmlFor="start">Inicio*</label>
                            <div>
                                <input 
                                    type="date" 
                                    name="startDate" 
                                    value={tempDates.startDate}
                                    min={localDate}
                                    onChange={handleInputDate}
                                />
                                <input 
                                    type="time" 
                                    name="startTime" 
                                    value={tempDates.startTime}
                                    onChange={handleInputDate}
                                    // onInput={(e) => {
                                    //     if (e.target.value < "07:00" || e.target.value > "16:59") {
                                    //         e.target.value = ""; // Limpia el input si el valor no es válido
                                    //         e.target.setCustomValidity("Horario no válido. Selecciona entre 07:00 y 16:59.");
                                    //         e.target.reportValidity();
                                    //     } else {
                                    //         e.target.setCustomValidity(''); // Limpiar cualquier mensaje de error anterior
                                    //     }
                                    // }}
                                    onInput={(e) => handleTimeInput(e, 'startTime')}
                                />
                            </div>
                        </div>
                        {errorMessage.startTime && <p className="errorMessage">{errorMessage.startTime}</p>}
                        <div className="formRowDate">
                            <label htmlFor="end">Finalización*</label>
                            <div>
                                <input 
                                    type="date" 
                                    name="endDate" 
                                    value={tempDates.endDate}
                                    min={localDate}
                                    onChange={handleInputDate}
                                />
                                <input 
                                    type="time" 
                                    name="endTime" 
                                    value={tempDates.endTime}
                                    onChange={handleInputDate}
                                    onInput={(e) => handleTimeInput(e, 'endTime')}
                                />
                            </div>
                        </div>
                        {errorMessage.endTime && <p className="errorMessage">{errorMessage.endTime}</p>}
                        <div className="formRow"><label>Procedimiento*</label></div>
                        <div className="procedureSelectionInputs">
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
                            <label htmlFor="title">Título*</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={newProcedure.title || ''} 
                                onChange={handleProcedureChange} 
                            />
                        </div>               
                        <div className="formRow"><label htmlFor="description">Descripción</label></div> 
                        <div className="formRow">
                            <textarea
                                name="description" 
                                value={newProcedure.description || ''} 
                                onChange={handleProcedureChange} 
                            />
                        </div>                        
                    </div>
                    <div className="submit">
                        <button type='submit' form="appointmentForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Crear turno"}</button>
                        {errorMessage.submit && <p className="errorMessage">{errorMessage.submit}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAppointment;