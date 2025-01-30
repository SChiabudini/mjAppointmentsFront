import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getCompanyClientById, getCompanyClients, getAllCompanyClients, putCompanyClient } from "../../../../../redux/companyClientActions.js";
import NewVehicle from '../../../Vehicles/NewVehicle/NewVehicle.jsx';
import { getVehicles } from "../../../../../redux/vehicleActions.js";
import reboot from  "../../../../../assets/img/reboot.png";
import rebootHover from "../../../../../assets/img/rebootHover.png";
import loadingGif from "../../../../../assets/img/loading.gif";

const PutCompanyClient = ({ onClientAdded = () => {}, isNested = false, vehicleId = null }) => {
    
    let { id } = useParams();
    const dispatch = useDispatch();

    const companyClientDetail = useSelector(state => state.companyClient.companyClientDetail); 

    const [editCompanyClient, setEditCompanyClient] = useState({});
    const [initialCompanyClient, setInitialCompanyClient] = useState({});
    const [errorMessage, setErrorMessage] = useState(""); 
    const [alreadyExist, setAlreadyExist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(getCompanyClientById(id));
    }, [dispatch, id])

    useEffect(() => {    
        if (companyClientDetail && companyClientDetail._id === id) {        
            const updatedEditCompanyClient = {
                _id: companyClientDetail._id,
                cuit: companyClientDetail.cuit,
                name: companyClientDetail.name,
                email: companyClientDetail.email,
                address: companyClientDetail.address,
                phones: companyClientDetail.phones,
                phoneWsp: companyClientDetail.phoneWsp || { prefix: "", numberPhone: "" },
                vehicles: companyClientDetail.vehicles,
                active: companyClientDetail.active
            };
            setEditCompanyClient(updatedEditCompanyClient);
            setInitialCompanyClient(updatedEditCompanyClient);
            setPhonePrefix(companyClientDetail.phoneWsp?.prefix || "549");
            setPhoneWsp(companyClientDetail.phoneWsp?.numberPhone || "");
        }
    }, [dispatch, id, companyClientDetail]);    

    //----- DISABLE BUTTON
    
    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if(editCompanyClient.cuit !== '' && editCompanyClient.name !== '' && editCompanyClient.email !== '' && (editCompanyClient.phones?.length > 0 || phoneWsp !== '')){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [editCompanyClient]);

    //----- HANDLE INPUTS

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        setEditCompanyClient(prevState => ({ ...prevState, [name]: value }));
        if (name === 'cuit') setAlreadyExist(false);
        if(name === 'searchTerm') setSearchTerm(value);
        if(name === 'searchTerm' && value === '') setDropdownVisible(false); 
    };

    //----- HANDLE PHONES

    const [currentPhone, setCurrentPhone] = useState("");
    const [phonePrefix, setPhonePrefix] = useState('549');
    const [phoneWsp, setPhoneWsp] = useState('');
    
    const addPhone = () => {
        if (currentPhone.trim() !== "") {
            setEditCompanyClient(prevState => ({
                ...prevState,
                phones: [...prevState.phones, currentPhone.trim()]
            }));
            setCurrentPhone("");
        }
    };

    const removePhone = (index) => {
        setEditCompanyClient(prevState => ({
            ...prevState,
            phones: prevState.phones.filter((_, i) => i !== index)
        }));
    };

    const handlePhoneWspChange = (event) => {
        const { name, value } = event.target;
    
        if (name === 'phonePrefix') {
            setPhonePrefix(value);
            setEditCompanyClient(prevState => ({
                ...prevState,
                phoneWsp: { ...prevState.phoneWsp, prefix: value }
            }));
        } else if (name === 'phoneWsp') {
            setPhoneWsp(value);
            setEditCompanyClient(prevState => ({
                ...prevState,
                phoneWsp: { ...prevState.phoneWsp, numberPhone: value }
            }));
        }
    };
    
    //----- HANDLE VEHÍCLES

    const vehicles = useSelector(state => state.vehicle.vehicles);
    const availableVehicles = vehicles.filter(vehicle => !vehicle.personClient && !vehicle.companyClient);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showNewVehicle, setShowNewVehicle] = useState(false);

    useEffect(() => {
        setFilteredVehicles(
            availableVehicles.filter(vehicle => 
                vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, vehicles]);

    const handleVehicleSelection = (vehicle) => {
        if (!editCompanyClient.vehicles.some(v => v.licensePlate === vehicle.licensePlate)) {
            setEditCompanyClient(prevState => ({
                ...prevState,
                vehicles: [...prevState.vehicles, vehicle]
            }));
        }
        setSearchTerm('');
    };

    const removeVehicle = (index) => {
        setEditCompanyClient(prevState => ({
            ...prevState,
            vehicles: prevState.vehicles.filter((_, i) => i !== index)
        }));
    };

    const handleSearchBlur = () => {
        setTimeout(() => {
            setDropdownVisible(false);
            setSelectedIndex(-1);
        }, 150);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev + 1) % filteredVehicles.length);
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev - 1 + filteredVehicles.length) % filteredVehicles.length);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            handleVehicleSelection(filteredVehicles[selectedIndex]);
            setDropdownVisible(false);
        } else {
            setDropdownVisible(true);
        }
    };

    //----- RESET

    const resetForm = () => {
        setEditCompanyClient(initialCompanyClient);
        setPhonePrefix(initialCompanyClient.phoneWsp?.prefix);
        setPhoneWsp(initialCompanyClient.phoneWsp?.numberPhone);
        // setCurrentPhone('');
        // setSearchTerm('');
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
            const response = await dispatch(putCompanyClient(editCompanyClient));
            console.log("Client/company successfully updated");
            setLoading(false);

            if(editCompanyClient.vehicles?.length > 0){
                dispatch(getVehicles());
            }

            setEditCompanyClient(editCompanyClient);
            dispatch(getCompanyClients());
            dispatch(getAllCompanyClients());
            dispatch(getCompanyClientById(id));
            onClientAdded(response);

        } catch (error) {
            setErrorMessage("*Error al editar empresa, revise los datos ingresados e intente nuevamente.");
            console.error("Error updating client company:", error.message);
            setLoading(false);
            if (error.message.includes('already exist')) setAlreadyExist(true);
        }
    };

    return (
        <div className={isNested? "formContainerNested" : "formContainer"}>
            <div className="titleForm">
                <h2>Editar empresa</h2>
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
                <form id="personClientForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>                    
                    <div className="formRow">
                        <label>CUIT</label>
                        <input 
                        type="text" 
                        name="cuit" 
                        // min='0'
                        value={editCompanyClient.cuit} 
                        onChange={handleInputChange} />
                        {alreadyExist && <p className="errorMessage">Ya existe un cliente con ese CUIT.</p>}
                    </div>
                    <div className="formRow">
                        <label>Nombre</label>
                        <input type="text" name="name" value={editCompanyClient.name} onChange={handleInputChange} />
                    </div>
                    <div className="formRow">
                        <label>Email</label>
                        <input type="text" name="email" value={editCompanyClient.email} onChange={handleInputChange} />
                    </div>
                    <div className="formRowWithButton">
                        <label>Whatsapp</label>
                        <div>
                            <span>+</span>
                            <input
                                className="phonePrefix"
                                type="text"
                                name="phonePrefix"
                                value={phonePrefix}
                                onChange={handlePhoneWspChange}
                            />
                            <input
                                type="text"
                                name="phoneWsp"
                                value={phoneWsp}
                                onChange={handlePhoneWspChange}
                            />
                        </div>
                    </div> 
                    <div className="formRow">
                        <label>Teléfono(s)</label>
                        <input 
                            type="text" 
                            value={currentPhone} 
                            min='0'
                            onChange={(e) => setCurrentPhone(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') addPhone();
                            }} 
                        />
                    </div>
                    {editCompanyClient.phones?.length > 0 ? (
                        <div className="formRow">
                            <ul>
                                {editCompanyClient.phones?.map((phone, index) => (
                                    <li key={index}>
                                        <div>{phone}</div>
                                        <button type="button" onClick={() => removePhone(index)}>x</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : ( 
                        <></>
                    )}                    
                    <div className="formRow">
                        <label>Dirección</label>
                        <input type="text" name="address" value={editCompanyClient.address} onChange={handleInputChange} />
                    </div>
                    {!isNested ? (
                        <div>
                            <div className="formRow">
                                <label>Vehículo(s)</label>
                            </div>
                            <div className="searchRow">
                                <input 
                                type="text" 
                                name="searchTerm" 
                                value={searchTerm} 
                                onChange={handleInputChange} 
                                onFocus={() => setSelectedIndex(-1)} 
                                onBlur={handleSearchBlur} 
                                onKeyDown={handleKeyDown} 
                                placeholder="Buscar vehículo" 
                                />
                                <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button">
                                    {showNewVehicle ? '-' : '+'}
                                </button>                                
                            </div>
                            <div className="searchRow">
                                {dropdownVisible && filteredVehicles?.length > 0 && (
                                    <ul className="dropdown">
                                        {filteredVehicles?.map((vehicle, index) => (
                                            <li 
                                            className={index === selectedIndex ? 'highlight' : ''}
                                            key={vehicle._id} 
                                            onClick={() => handleVehicleSelection(vehicle)} 
                                            >
                                                {vehicle.licensePlate}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="formRow">
                                <ul>
                                    {editCompanyClient.vehicles?.map((vehicle, index) => (
                                        <li key={index}>
                                            {vehicle.licensePlate}
                                            <button type="button" onClick={() => removeVehicle(index)}>x</button>
                                        </li>
                                    ))}
                                </ul> 
                            </div>        
                        </div>
                    ) : (
                        <></>
                    )}
                </form>
                <div className={isNested ? "submitNested" : "submit"}>                    
                    {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true}/>}
                    <button type="submit" form="personClientForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Editar cliente"}</button>
                    {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default PutCompanyClient;