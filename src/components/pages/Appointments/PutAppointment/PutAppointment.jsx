import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import { getAppointmentById, getAppointments, getAllAppointments, putAppointment } from "../../../../redux/appointmentActions.js";
import reboot from  "../../../../assets/img/reboot.png";
import rebootHover from "../../../../assets/img/rebootHover.png";
import loadingGif from "../../../../assets/img/loading.gif";

const PutAppointment = ({ onAppointmentAdded = () => {}}) => {
    
    let { id } = useParams();
    const dispatch = useDispatch();

    const appointmentDetail = useSelector(state => state.appointment?.appointmentDetail || {}); 

    const [editAppointment, setEditAppointment] = useState({});
    const [initialAppointment, setInitialAppointment] = useState({});
    const [errorMessage, setErrorMessage] = useState(""); 
    const [loading, setLoading] = useState(false);
      
    useEffect(() => {
        dispatch(getAppointmentById(id));
    }, [dispatch, id])

    useEffect(() => {    
        if (appointmentDetail && appointmentDetail._id === id) {     
            if (appointmentDetail.personClient) {
                setSearchingPerson(true);
                setSearchTermClients(`${appointmentDetail.personClient.dni} - ${appointmentDetail.personClient.name}`);
            } else if (appointmentDetail.companyClient) {
                setSearchingPerson(false);
                setSearchTermClients(`${appointmentDetail.companyClient.cuit} - ${appointmentDetail.companyClient.name}`);
            } else {
                setSearchTermClients('');
            }   
            if (appointmentDetail.vehicle) {
                setSearchTermVehicles(`${appointmentDetail.vehicle.licensePlate}`);
            } else {
                setSearchTermVehicles('');
            }

            const initialData = {
                _id: appointmentDetail._id,
                start: formatToLocalDateTime(appointmentDetail.start),
                end: formatToLocalDateTime(appointmentDetail.end),
                personClient: appointmentDetail.personClient ? appointmentDetail.personClient._id : null,
                companyClient: appointmentDetail.companyClient ? appointmentDetail.companyClient._id : null,
                vehicle: appointmentDetail.vehicle ? appointmentDetail.vehicle._id : null,
                procedure: appointmentDetail.procedure || {},
                active: appointmentDetail.active,
            };
            setEditAppointment(initialData);
            setInitialAppointment(initialData);
        }
    }, [dispatch, id, appointmentDetail]);

    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000).toISOString().split("T")[0];
    const minDateTime = localDate + "T00:00";

    //----- DISABLE BUTTON
        
    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(editAppointment.start !== "" && editAppointment.end !== "" && editAppointment.vehicle && (editAppointment.personClient || editAppointment.companyClient) && editAppointment.procedure.title !== "" && (editAppointment.procedure.service || editAppointment.procedure.mechanical)){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [editAppointment]);

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'start' || name === 'end') {
            setEditAppointment({
                ...editAppointment,
                [name]: value,
            });
        }
        
        setEditAppointment((prevState) => ({
            ...prevState,
            ...(name === 'searchTermClients' && value === '' && {
                personClient: null,
                companyClient: null,
            }),
            ...(name === 'searchTermVehicles' && value === '' && {
                vehicle: null,
            }),
        }));
        
        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') {
                setDropdownVisibleClients(false);
            }
        };

        if(name === 'searchTermClients' && value === '') setDropdownVisibleClients(false); 

        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') {
                setDropdownVisibleVehicles(false);
            }
        };
        if(name === 'searchTermVehicles') setSearchTermVehicles(value);
        if(name === 'searchTermVehicles' && value === '') setDropdownVisibleVehicles(false); 
    };

    //----- DATE

    const formatToLocalDateTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    };

    //----- HANDLE PROCEDURE

    const handleProcedureChange = (event) => {
        const { name, value, type, checked } = event.target;

        setEditAppointment((prevState) => ({
            ...prevState,
            procedure: {
                ...prevState.procedure,
                [name]: type === 'checkbox' ? checked : value,
            },
        }));
    }; 

    //----- LOAD CLIENTS AND VEHICLES OPTIONS
    
    const personClients = useSelector(state => state.personClient.personClients);
    const companyClients = useSelector(state => state.companyClient.companyClients);
    const vehicles = useSelector(state => state.vehicle.vehicles);

    //----- HANDLE CLIENT

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
            setEditAppointment({ ...editAppointment, personClient: client._id, companyClient: null });
        } else {
            setEditAppointment({ ...editAppointment, companyClient: client._id, personClient: null });
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

        setEditAppointment((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));

        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setEditAppointment((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setEditAppointment((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setEditAppointment((prevState) => ({
                ...prevState,
                personClient: null,
                companyClient: null
            }));
            setSearchingPerson(true);
        }
    };
    
    //----- ATRIBUTES INPUTS
    const handleSearchFocus = (event) => {
        const { name } = event.target;

        if(name === 'searchTermClients') {
            setSelectedIndexClients(-1);
        };
        if(name === 'searchTermVehicles') {
            setSelectedIndexVehicles(-1);
        };
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setDropdownVisibleClients(false);
            setDropdownVisibleVehicles(false);
            setSelectedIndexClients(-1);
            setSelectedIndexVehicles(-1);
        }, 150);
    };

    const handleKeyDown = (event) => {
        const { name } = event.target;

        if(name === 'searchTermClients') {
            if (event.key === 'ArrowDown') {
                setSelectedIndexClients((prev) => (prev + 1) % filteredClients.length);
            } else if (event.key === 'ArrowUp') {
                setSelectedIndexClients((prev) => (prev - 1 + filteredClients.length) % filteredClients.length);
            } else if (event.key === 'Enter' && selectedIndexClients >= 0) {
                handleClientSelection(filteredClients[selectedIndexClients]);
                setDropdownVisibleClients(false);
            } else {
                setDropdownVisibleClients(true);
            }
        };
        if(name === 'searchTermVehicles') {
            if (event.key === 'ArrowDown') {
                setSelectedIndexVehicles((prev) => (prev + 1) % filteredVehicles.length);
            } else if (event.key === 'ArrowUp') {
                setSelectedIndexVehicles((prev) => (prev - 1 + filteredVehicles.length) % filteredVehicles.length);
            } else if (event.key === 'Enter' && selectedIndexVehicles >= 0) {
                handleVehicleSelection(filteredVehicles[selectedIndexVehicles]);
                setDropdownVisibleVehicles(false);
            } else {
                setDropdownVisibleVehicles(true);
            }
        };
    }; 

    //----- RESET
    
    const resetForm = () => {
        setEditAppointment(initialAppointment);
    
        // Actualizar los valores de búsqueda del cliente y vehículo
        if (appointmentDetail.personClient) {
            setSearchTermClients(`${appointmentDetail.personClient.dni} - ${appointmentDetail.personClient.name}`);
        } else if (appointmentDetail.companyClient) {
            setSearchTermClients(`${appointmentDetail.companyClient.cuit} - ${appointmentDetail.companyClient.name}`);
        } else {
            setSearchTermClients('');
        }

        setSearchingPerson(appointmentDetail.personClient ? true : false);
    
        if (appointmentDetail.vehicle) {
            setSearchTermVehicles(appointmentDetail.vehicle?.licensePlate || '');
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

        try {

            console.log(editAppointment);

            const response = await dispatch(putAppointment(editAppointment));
            
            setLoading(false);

            console.log("Appointment successfully updated");

            setEditAppointment(editAppointment);
            dispatch(getAppointments());
            dispatch(getAllAppointments());
            dispatch(getAppointmentById(id));
            onAppointmentAdded(response);

        } catch (error) {
            setErrorMessage("*Error al editar turno, revise los datos ingresados e intente nuevamente.");
            console.error("Error updating appointment:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
            setLoading(false);
        }
    };

    return (
        <div className={"formContainer"}>
            <div className="titleForm">
                <h2>Editar turno</h2>
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
                            value={searchTermVehicles} 
                            onChange={handleInputChange}
                            // onChange={(e) => setSearchTermVehicles(e.target.value)}
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
                                    <li className={index === selectedIndexClients ? 'highlight' : ''} 
                                    key={vehicle._id} 
                                    onClick={() => handleVehicleSelection(vehicle)} 
                                    >
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
                            onChange={() => {
                                setSearchingPerson(true);
                                setSearchTermClients('');
                                setEditAppointment({ ...editAppointment, personClient: null, companyClient: null });
                            }}
                            />
                            Persona
                        </label>
                        <label htmlFor="companyClient">
                            <input 
                                type="radio" 
                                name="clientType" 
                                value="company"
                                checked={!searchingPerson}
                                onChange={() => {
                                    setSearchingPerson(false);
                                    setSearchTermClients('');
                                    setEditAppointment({ ...editAppointment, personClient: null, companyClient: null });
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
                            // onChange={(e) => setSearchTermClients(e.target.value)}
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                            onKeyDown={handleKeyDown}
                        />
                        <button type="button" onClick={() => setShowNewClient(!showNewClient)}>
                            {showNewClient ? '-' : '+'}
                        </button>                                 
                    </div>
                    <div className="searchRow">
                        {filteredClients.length > 0 && dropdownVisibleClients && (
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
                        <div className="formRow">
                            <label htmlFor="start">Inicio*</label>
                            <input 
                                type="datetime-local" 
                                name="start" 
                                value={editAppointment.start} 
                                onChange={handleInputChange}
                                min={minDateTime} 
                            />
                        </div>
                        <div className="formRow">
                            <label htmlFor="end">Finalización*</label>
                            <input 
                                type="datetime-local" 
                                name="end" 
                                value={editAppointment.end} 
                                onChange={handleInputChange}
                                min={minDateTime}
                            />
                        </div>
                        <div className="formRow"><label>Procedimiento*</label></div>

                            <div className="procedureSelectionInputs">
                                <label htmlFor="service">
                                    <input 
                                        type="checkbox" 
                                        name="service" 
                                        id="service" 
                                        checked={editAppointment.procedure?.service || false} 
                                        onChange={handleProcedureChange}
                                    />
                                    Service
                                </label>                               
                                <label htmlFor="mechanical">
                                    <input 
                                        type="checkbox" 
                                        name="mechanical" 
                                        id="mechanical" 
                                        checked={editAppointment.procedure?.mechanical || false} 
                                        onChange={handleProcedureChange}
                                    />
                                    Mecánica
                                </label>    
                            
                        </div>
                        <div className="formRow">
                                <label htmlFor="title">Título*</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={editAppointment.procedure?.title || ''} 
                                    onChange={handleProcedureChange} 
                                />
                            </div>               
                            <div className="formRow">
                                <label htmlFor="description">Descripción</label>
                            </div>
                            <div className="formRow">
                                <textarea
                                    name="description" 
                                    value={editAppointment.procedure?.description || ''} 
                                    onChange={handleProcedureChange} 
                                />
                            </div> 
                       
                    </div>
                    <div className="submit">  
                        <button type='submit' form="appointmentForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Editar turno"}</button>
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PutAppointment;