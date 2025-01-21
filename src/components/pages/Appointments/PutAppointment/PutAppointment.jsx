import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import { getAppointmentById, getAppointments, putAppointment } from "../../../../redux/appointmentActions.js";
import loadingGif from "../../../../assets/img/loading.gif";

const PutAppointment = ({ onAppointmentAdded = () => {}, isNested = false }) => {
    
    let { id } = useParams();
    const dispatch = useDispatch();

    const appointmentDetail = useSelector(state => state.appointment?.appointmentDetail || {}); 

    const [editAppointment, setEditAppointment] = useState({});
    const [loading, setLoading] = useState(false);
      
    useEffect(() => {
        dispatch(getAppointmentById(id));
    }, [dispatch, id])

    useEffect(() => {    
        if (appointmentDetail && appointmentDetail._id === id) {     
            if (appointmentDetail.personClient) {
                setSearchingPerson(true);
                setSearchClient(`${appointmentDetail.personClient.dni} - ${appointmentDetail.personClient.name}`);
            } else if (appointmentDetail.companyClient) {
                setSearchingPerson(false);
                setSearchClient(`${appointmentDetail.companyClient.cuit} - ${appointmentDetail.companyClient.name}`);
            } else {
                setSearchClient('');
            }   
            if (appointmentDetail.vehicle) {
                setSearchVehicle(`${appointmentDetail.vehicle.licensePlate}`);
            }
            setEditAppointment({
                _id: appointmentDetail._id,
                start: formatToLocalDateTime(appointmentDetail.start),
                end: formatToLocalDateTime(appointmentDetail.end),
                personClient: appointmentDetail.personClient ? appointmentDetail.personClient._id : null,
                companyClient: appointmentDetail.companyClient ? appointmentDetail.companyClient._id : null,
                vehicle: appointmentDetail.vehicle ? appointmentDetail.vehicle._id : null,
                procedure: appointmentDetail.procedure || {},
                active: appointmentDetail.active,
            });
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
            ...(name === 'searchClient' && value === '' && {
                personClient: null,
                companyClient: null,
            }),
            ...(name === 'searchVehicle' && value === '' && {
                vehicle: null,
            }),
        }));
        
        if (name === 'searchClient') {
            setSearchClient(value);
            if (value === '') {
                setDropdownClientsVisible(false);
            }
        };

        if(name === 'searchClient' && value === '') setDropdownClientsVisible(false); 

        if (name === 'searchVehicle') {
            setSearchVehicle(value);
            if (value === '') {
                setDropdownVehicleVisible(false);
            }
        };
        if(name === 'searchVehicle') setSearchVehicle(value);
        if(name === 'searchVehicle' && value === '') setDropdownVehicleVisible(false); 
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

    //----- HANDLE CLIENT

    const personClients = useSelector(state => state.personClient.personClients);
    const companyClients = useSelector(state => state.companyClient.companyClients);

    const [searchingPerson, setSearchingPerson] = useState(true);
    const [searchClient, setSearchClient] = useState('');
    const [selectedClientIndex, setSelectedClientIndex] = useState(-1);
    const [filteredClients, setFilteredClients] = useState([]);
    const [showNewClient, setShowNewClient] = useState(false);
    const [dropdownClientsVisible, setDropdownClientsVisible] = useState(false);

    useEffect(() => {
        const clients = searchingPerson ? personClients : companyClients;
        setFilteredClients(
            clients.filter(client => 
                client.name.toLowerCase().includes(searchClient.toLowerCase()) || 
                (client.dni && client.dni.toString().includes(searchClient))
            )
        );  
    }, [searchClient, searchingPerson, personClients, companyClients]);

    const handleClientSelection = (client) => {
        const clientName = client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`;
        setSearchClient(clientName);
        setDropdownClientsVisible(false);
        if (searchingPerson) {
            setEditAppointment({ ...editAppointment, personClient: client._id, companyClient: null });
        } else {
            setEditAppointment({ ...editAppointment, companyClient: client._id, personClient: null });
        }
    };

    //----- VEHICLES

    const vehicles = useSelector(state => state.vehicle.vehicles);
    
    const [searchVehicle, setSearchVehicle] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);
    const [dropdownVehiclesVisible, setDropdownVehicleVisible] = useState(false);

    useEffect(() => {
        setFilteredVehicles(
            vehicles.filter(vehicle => 
                vehicle.licensePlate.toLowerCase().includes(searchVehicle.toLowerCase())
            )
        );
    }, [searchVehicle, vehicles]);

    const handleVehicleSelection = (vehicle) => {
        const vehicleLicencePlate = vehicle.licensePlate
        setSearchVehicle(vehicleLicencePlate);
        setDropdownVehicleVisible(false);
        setEditAppointment({ ...editAppointment, vehicle: vehicle._id });
    };
    
    //----- ATRIBUTES INPUTS
    const handleSearchFocus = (event) => {
        const { name } = event.target;

        if(name === 'searchClient') {
            setSelectedClientIndex(-1);
        };
        if(name === 'searchVehicle') {
            setSelectedVehicleIndex(-1);
        };
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setDropdownClientsVisible(false);
            setDropdownVehicleVisible(false);
            setSelectedClientIndex(-1);
            setSelectedVehicleIndex(-1);
        }, 150);
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

    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            const response = await dispatch(putAppointment(editAppointment));
            
            setLoading(false);

            console.log("Appointment successfully updated");

            // if(editAppointment.personClient){
            //     dispatch(getPersonClients());
            // }

            // if(editAppointment.companyClient){
            //     dispatch(getCompanyClients());
            // }

            setEditAppointment(editAppointment);
            dispatch(getAppointments());
            dispatch(getAppointmentById(id));
            onAppointmentAdded(response);

        } catch (error) {
            console.error("Error updating appointment:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
            setLoading(false);
        }
    };

    return (
        <div className={"formContainer"}>
            <div className="titleForm">
                <h2>Editar turno</h2>
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
                            name="searchVehicle" 
                            value={searchVehicle} 
                            onChange={handleInputChange}
                            // onChange={(e) => setSearchVehicle(e.target.value)}
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
                        {filteredVehicles?.length > 0 && dropdownVehiclesVisible && (
                            <ul className="dropdown">
                                {filteredVehicles?.map((vehicle, index) => (
                                    <li className={index === selectedClientIndex ? 'highlight' : ''} 
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
                                setSearchClient('');
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
                                    setSearchClient('');
                                    setEditAppointment({ ...editAppointment, personClient: null, companyClient: null });
                                }}
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
                            onChange={handleInputChange}
                            // onChange={(e) => setSearchClient(e.target.value)}
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
                                {filteredClients?.map((client, index) => (
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PutAppointment;