import style from './NewAppointment.module.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewCompanyClient from '../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx';
import NewPersonClient from '../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx';
import NewVehicle from '../../Vehicles/NewVehicle/NewVehicle.jsx';
import { getAppointments, postAppointment } from '../../../../redux/appointmentActions.js';

const NewAppointment = ({ onAppointmentAdded = () => {}, isNested = false }) => {
    
    const dispatch = useDispatch();

    // const appointments = useSelector(state => state.appointment.appointments);
    const personClients = useSelector(state => state.personClient.personClients);
    const companyClients = useSelector(state => state.companyClient.companyClients);
    const vehicles = useSelector(state => state.vehicle.vehicles);
    // console.log(vehicles);    

    const initialAppointmentState = {
        start: null,
        end: null,
        personClient: null,
        companyClient: null,
        vehicle: null,
        mechanical: false,
        service: false,
        procedure: ''
    };

    const initialPersonClientState = {
        dni: '',
        name: '',
        email: '',
        phones: [],
        cuilCuit: '',
        vehicles: []
    };

    const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [newPersonClient, setNewPersonClient] = useState(initialPersonClientState);
    const [selectedOptionClient, setSelectedOptionClient] = useState('personClient');
    const [showCompanyClientPopup, setShowCompanyClientPopup] = useState(false);
    const [showPersonClientPopup, setShowPersonClientPopup] = useState(false);
    const [showNewClient, setShowNewClient] = useState(false);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchingPerson, setSearchingPerson] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showVehiclePopup, setShowVehiclePopup] = useState(false);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    // const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
// console.log(newAppointment);
    
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
        if(name === 'procedure'){
          setNewAppointment({
                ...newAppointment,
                procedure: value
            });
        };
        if(name === 'searchTerm') setSearchTerm(value);
        if(name === 'searchTerm' && value === '') setDropdownVisible(false);
        // validateForm();
    };

    //-----------DATE-----------//
    // Función para convertir una fecha en formato ISO 8601
    const convertToISODate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString();
    };

    //-----------CLIENT-----------//
    const handleClientChange = (event) => {
        const { name, value } = event.target;
        
        // Actualiza el cliente o empresa en el estado dependiendo de la selección
        if (selectedOptionClient === 'personClient') {
            const selectedClient = personClients.find(client => client._id === value);
            setNewAppointment({
                ...newAppointment,
                personClient: selectedClient || null, // Asigna el cliente completo
                companyClient: null, // Resetea la empresa
            });
        } else if (selectedOptionClient === 'companyClient') {
            const selectedCompany = companyClients.find(company => company._id === value);
            setNewAppointment({
                ...newAppointment,
                companyClient: selectedCompany || null, // Asigna la empresa completa
                personClient: null, // Resetea el cliente
            });
        }
    };    

    const handleClientSelection = (client) => {
        const clientName = client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`;
        setSearchTerm(clientName);
        setDropdownVisible(false);
        if (searchingPerson) {
        setNewVehicle({ ...newVehicle, personClient: client._id, companyClient: null });
        } else {
        setNewVehicle({ ...newVehicle, companyClient: client._id, personClient: null });
        }
    };

    const handleSearchFocus = () => {
        setSelectedIndex(-1);
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setDropdownVisible(false);
            setSelectedIndex(-1);
        }, 150);
    };

    const handleCheckboxClientChange = (option) => {
        setSelectedOptionClient(option);
    
        if (option === 'companyClient') {
            // Si se selecciona 'companyClient', asignamos el cliente a 'companyClient' y vaciamos 'personClient'
            setNewAppointment({
                ...newAppointment,
                companyClient: newAppointment.companyClient || null, // Si ya había una empresa, la dejamos
                personClient: null // Reseteamos el cliente de persona
            });
        } else if (option === 'personClient') {
            // Si se selecciona 'personClient', asignamos el cliente a 'personClient' y vaciamos 'companyClient'
            setNewAppointment({
                ...newAppointment,
                personClient: newAppointment.personClient || null, // Si ya había un cliente persona, lo dejamos
                companyClient: null // Reseteamos la empresa
            });
        } else {
            setNewAppointment({
                ...newAppointment,
                personClient: null, // Ambos campos vacíos si no hay opción seleccionada
                companyClient: null
            });
        }
    }; 

    const handleCreateClient = () => {
        if (selectedOptionClient === 'companyClient') {
            setShowCompanyClientPopup(true);
            setShowPersonClientPopup(false);
        } else if (selectedOptionClient === 'personClient') {
            setShowPersonClientPopup(true);
            setShowCompanyClientPopup(false);
        } else {
            setShowCompanyClientPopup(false);
            setShowPersonClientPopup(false);
        }
    };

    // const clientsPerson = appointments.filter(appointment => appointment.personClient)?.map(appointment => appointment.personClient);
    // console.log(companyClients);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prev) => (prev + 1) % filteredClients.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev - 1 + filteredClients.length) % filteredClients.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            handleClientSelection(filteredClients[selectedIndex]);
            setDropdownVisible(false);
        } else {
            setDropdownVisible(true);
        }
    };
    

    //-----------VEHICLE-----------//
    const handleCreateVehicle = () => {
        setShowVehiclePopup(true);
    };

    const handleVehicleChange = (vehicleId) => {

        const vehicle = vehicles.find(vehicle => vehicle._id === vehicleId);
        
        setSelectedVehicle(vehicle);
    
        setNewAppointment({
            ...newAppointment,
            vehicle: vehicle || {}  // Add vehicle to the appointment data
        });
    };

    const handleVehicleSelection = (vehicle) => {
        if (!newPersonClient.vehicles.some(v => v.licensePlate === vehicle.licensePlate)) {
            setNewPersonClient(prevState => ({
                ...prevState,
                vehicles: [...prevState.vehicles, vehicle]
            }));
        }
        setSearchTerm('');
    };

    const removeVehicle = (index) => {
        setNewPersonClient(prevState => ({
            ...prevState,
            vehicles: prevState.vehicles.filter((_, i) => i !== index)
        }));
    };

    //-----------PROCEDURE-----------//
    // const handleCheckboxProcedureChange = (option) => {

    //     if (option === 'service') {
    //         setNewAppointment({
    //             ...newAppointment,
    //             service: true, 
    //             mechanical: false 
    //         });
    //     } else if (option === 'mechanical') {
    //         setNewAppointment({
    //             ...newAppointment,
    //             service: false, 
    //             mechanical: true 
    //         });
    //     } else {
    //         setNewAppointment({
    //             ...newAppointment,
    //             service: false, 
    //             mechanical: false
    //         });
    //     }
    // };
    const handleCheckboxProcedureChange = (option) => {
        if (option === 'service') {
            setNewAppointment({
                ...newAppointment,
                service: !newAppointment.service,  // Cambiar el valor de 'service' entre true y false
            });
        } else if (option === 'mechanical') {
            setNewAppointment({
                ...newAppointment,
                mechanical: !newAppointment.mechanical,  // Cambiar el valor de 'mechanical' entre true y false
            });
        };
    };    

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

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const appointmentData = {
            start: newAppointment.start,
            end: newAppointment.end, 
            personClient: newAppointment.personClient,
            companyClient: newAppointment.companyClient,
            vehicle: newAppointment.vehicle,
            mechanical: newAppointment.mechanical,
            service: newAppointment.service,
            procedure: newAppointment.procedure,
        };
    
        try {
            const response = await dispatch(postAppointment(appointmentData));
    
            if (response) {
                console.log("Appointment successfully saved");
                dispatch(getAppointments()); // Actualizar los turnos tras guardar
                setNewAppointment(initialAppointmentState); // Resetear el formulario
                setSelectedVehicle(null);
                onAppointmentAdded(response);
            }
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
                                        checked={newAppointment.service}
                                        onChange={() => handleCheckboxProcedureChange('service')} 
                                    />
                                    Service
                                </label>                               
                                <label htmlFor="mechanical">
                                    <input 
                                        type="checkbox" 
                                        name="mechanical" 
                                        id="mechanical" 
                                        checked={newAppointment.mechanical}
                                        onChange={() => handleCheckboxProcedureChange('mechanical')} 
                                    />
                                    Mecánica
                                </label>                                
                            </div>    
                            <div className="formRow">
                            <label htmlFor="titleProcedure">Título</label>
                            <input 
                                type="text" 
                                name="titleProcedure" 
                                // value={} 
                                // onChange={handleInputChange} 
                            />
                        </div>               
                        </div>                       
                        <span>Descripción</span>
                        <div className="formRow">
                            <textarea
                                name="procedure" 
                                value={newAppointment.procedure} 
                                onChange={handleInputChange} 
                            />
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
                                        // checked={selectedOptionClient === 'personClient'} 
                                        checked={searchingPerson}
                                        // onChange={() => handleCheckboxClientChange('personClient')} 
                                        onChange={() => (setSearchingPerson(true), setSearchTerm(''))}
                                        />
                                        Persona
                                    </label>
                                    <label htmlFor="companyClient">
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="company"
                                            checked={!searchingPerson}
                                            onChange={() => (setSearchingPerson(false), setSearchTerm(''))}
                                            // checked={selectedOptionClient === 'companyClient'} 
                                            // onChange={() => handleCheckboxClientChange('companyClient')} 
                                        />
                                        Empresa
                                    </label>
                                </div>
                                <div className="searchRow">
                                    <input
                                        type="text"
                                        name="searchTerm"
                                        placeholder={`Buscar ${searchingPerson ? 'persona' : 'empresa'}`}
                                        value={searchTerm}
                                        onChange={handleInputChange}
                                        onFocus={handleSearchFocus}
                                        onBlur={handleSearchBlur}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button onClick={() => setShowNewClient(!showNewClient)} type="button">
                                        {showNewClient ? '-' : '+'}
                                    </button>                                 
                                </div>
                                <div className="searchRow">
                                    {filteredClients.length > 0 && dropdownVisible && (
                                        <ul className="dropdown">
                                            {filteredClients.map((client, index) => (
                                                <li
                                                key={client._id}
                                                onClick={() => handleClientSelection(client)}
                                                className={index === selectedIndex ? 'highlight' : ''}
                                                >
                                                {client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className={isNested ? "submitNested" : "submit"}>
                                    {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true}/>}
                                    {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true}/>}
                                    {/* <button type='submit' form="appointmentForm">Crear cliente</button> */}
                                </div>
                            </div>
                        ) : (<></>)} 
                        {!isNested ? (
                            <div>
                                <div className="formRow">
                                    <label>Vehículo(s)</label>
                                </div>
                                <div className="searchRow">
                                    <input type="text" name="searchTerm" value={searchTerm} onChange={handleInputChange} onFocus={handleSearchFocus} onBlur={handleSearchBlur} onKeyDown={handleKeyDown} placeholder="Buscar vehículo" />
                                    <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button">
                                        {showNewVehicle ? '-' : '+'}
                                    </button>                                
                                </div>
                                <div className="searchRow">
                                    {dropdownVisible && filteredVehicles.length > 0 && (
                                        <ul className="dropdown">
                                            {filteredVehicles.map((vehicle, index) => (
                                                <li key={vehicle._id} onClick={() => handleVehicleSelection(vehicle)} className={index === selectedIndex ? 'highlight' : ''}>
                                                    {vehicle.licensePlate}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="formRow">
                                    <ul>
                                        {newPersonClient.vehicles.map((vehicle, index) => (
                                            <li key={index}>
                                                {vehicle.licensePlate}
                                                <button type="button" onClick={() => removeVehicle(index)}>x</button>
                                            </li>
                                        ))}
                                    </ul> 
                                </div>     
                                <div className={isNested ? "submitNested" : "submit"}>                    
                                    {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true}/>}
                                    {/* <button type="submit" form="personClientForm">Crear cliente</button> */}
                                </div>   
                            </div>
                        ) : (
                            <></>
                        )}                 
                        {/* {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>} */}
                        <div className="submit">
                            <button type="submit" form="appointmentForm" disabled={isSubmitDisabled}>Crear turno</button>
                        </div>
                    </div>
                </form>
            </div>
            {/* {showPersonClientPopup && <NewPersonClient />} */}
            {/* {showCompanyClientPopup && <NewCompanyClient />} */}
            {/* {showVehiclePopup && <NewVehicle />} */}
        </div>
    );
};

export default NewAppointment;