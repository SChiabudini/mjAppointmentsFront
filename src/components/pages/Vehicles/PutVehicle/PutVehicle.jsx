import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import { getVehicleById, getVehicles, putVehicle } from "../../../../redux/vehicleActions.js";
import { getPersonClients } from "../../../../redux/personClientActions.js";
import { getCompanyClients } from "../../../../redux/companyClientActions.js";

const PutVehicle = ({ onVehicleAdded = () => {}, isNested = false, personClientId = null, companyClientId = null }) => {
    
    let { id } = useParams();
    const dispatch = useDispatch();

    const vehicleDetail = useSelector(state => state.vehicle.vehicleDetail); 

    const [editVehicle, setEditVehicle] = useState({});
    const [alreadyExist, setAlreadyExist] = useState(false);
    // console.log(editVehicle);
      
    useEffect(() => {
        dispatch(getVehicleById(id));
    }, [dispatch, id])

    useEffect(() => {    
        if (vehicleDetail && vehicleDetail._id === id) {     
            if (vehicleDetail.personClient) {
                setSearchingPerson(true);
                setSearchTerm(`${vehicleDetail.personClient.dni} - ${vehicleDetail.personClient.name}`);
            } else if (vehicleDetail.companyClient) {
                setSearchingPerson(false);
                setSearchTerm(`${vehicleDetail.companyClient.cuit} - ${vehicleDetail.companyClient.name}`);
            } else {
                setSearchTerm('');
            }   
            setEditVehicle({
                _id: vehicleDetail._id,
                licensePlate: vehicleDetail.licensePlate,
                brand: vehicleDetail.brand,
                model: vehicleDetail.model,
                year: vehicleDetail.year,
                engine: vehicleDetail.engine,
                personClient: vehicleDetail.personClient ? vehicleDetail.personClient._id : null,
                companyClient: vehicleDetail.companyClient ? vehicleDetail.companyClient._id : null,
                active: vehicleDetail.active,
            });
        }
    }, [dispatch, id, vehicleDetail]);    

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        // setEditVehicle({
        //     ...editVehicle,
        //     [name]: name === 'year' ? (value === '' ? '' : parseInt(value, 10) || 0) : value,
        // });
        setEditVehicle((prevState) => ({
            ...prevState,
            [name]: name === 'year' ? (value === '' ? '' : parseInt(value, 10) || 0) : value,
            ...(name === 'searchTerm' && value === '' && {
                personClient: null,
                companyClient: null,
            }),
        }));
        
        if (name === 'licensePlate') setAlreadyExist(false);
        // if(name === 'searchTerm') setSearchTerm(value);
        if (name === 'searchTerm') {
            setSearchTerm(value);
            if (value === '') {
                setDropdownVisible(false);
            }
        };
        if(name === 'searchTerm' && value === '') setDropdownVisible(false); 
    };

    //----- HANDLE CLIENT

    const personClients = useSelector(state => state.personClient.personClients);
    const companyClients = useSelector(state => state.companyClient.companyClients);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchingPerson, setSearchingPerson] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showNewClient, setShowNewClient] = useState(false);

    useEffect(() => {
        const clients = searchingPerson ? personClients : companyClients;
        setFilteredClients(
            clients.filter(client => 
                client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (client.dni && client.dni.toString().includes(searchTerm))
            )
        );  
    }, [searchTerm, searchingPerson, personClients, companyClients]);

    const handleClientSelection = (client) => {
        const clientName = client.dni ? `${client.dni} - ${client.name}` : `${client.cuit} - ${client.name}`;
        setSearchTerm(clientName);
        setDropdownVisible(false);
        if (searchingPerson) {
            setEditVehicle({ ...editVehicle, personClient: client._id, companyClient: null });
        } else {
            setEditVehicle({ ...editVehicle, companyClient: client._id, personClient: null });
        }
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setDropdownVisible(false);
            setSelectedIndex(-1);
        }, 150);
    };

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

    //----- SUBMIT

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await dispatch(putVehicle(editVehicle));
            console.log("Vehicle successfully updated");

            if(editVehicle.personClient){
                dispatch(getPersonClients());
            }

            if(editVehicle.companyClient){
                dispatch(getCompanyClients());
            }

            setEditVehicle(editVehicle);
            setSearchTerm('');
            dispatch(getVehicles());
            dispatch(getVehicleById(id));
            onVehicleAdded(response);

        } catch (error) {
            console.error("Error updating vehicle:", error.message);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
            <div className="titleForm">
                <h2>Editar vehículo</h2>
            </div>
            <div className="container">
                <form id="vehicleForm" onSubmit={handleSubmit}>                    
                    <div className="formRow">
                        <label htmlFor="licensePlate">Patente</label>
                        <input type="text" 
                        name="licensePlate" 
                        value={editVehicle.licensePlate} 
                        onChange={handleInputChange}/>
                        {alreadyExist && <p>Ya existe un vehículo con esa patente.</p>}
                    </div>
                    <div className="formRow">
                        <label htmlFor="brand">Marca</label>
                        <input type="text" name="brand" value={editVehicle.brand} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="model">Modelo</label>
                        <input type="text" name="model" value={editVehicle.model} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="year">Año</label>
                        <input type="text" name="year" value={editVehicle.year || ''} onChange={handleInputChange}/>
                    </div>
                    <div className="formRow">
                        <label htmlFor="engine">Motor</label>
                        <input type="text" name="engine" value={editVehicle.engine} onChange={handleInputChange}/>
                    </div>                   
                    {!isNested ? (
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
                                            setSearchTerm('');
                                            setEditVehicle({ ...editVehicle, personClient: null, companyClient: null });
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
                                            setSearchTerm('');
                                            setEditVehicle({ ...editVehicle, companyClient: null, personClient: null });
                                        }}
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
                                    onFocus={() => setSelectedIndex(-1)}
                                    onBlur={handleSearchBlur}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={() => setShowNewClient(!showNewClient)} type="button">
                                    {showNewClient ? '-' : '+'}
                                </button>                                 
                            </div>
                            <div className="searchRow">
                                {filteredClients?.length > 0 && dropdownVisible && (
                                    <ul className="dropdown">
                                        {filteredClients?.map((client, index) => (
                                            <li
                                            className={index === selectedIndex ? 'highlight' : ''}
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
                </form>
                <div className={isNested ? "submitNested" : "submit"}>
                    {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true}/>}
                    {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true}/>}
                    <button type='submit' form="vehicleForm">Editar vehículo</button>
                </div>
            </div>
        </div>
    );
};

export default PutVehicle;