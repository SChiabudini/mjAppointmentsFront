import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getBudgetById, getBudgets, getAllBudgets, putBudget } from "../../../../redux/budgetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions.js";
import { getCompanyClients } from "../../../../redux/companyClientActions.js";
import { getVehicles } from "../../../../redux/vehicleActions.js";
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import reboot from  "../../../../assets/img/reboot.png";
import rebootHover from "../../../../assets/img/rebootHover.png";
import loadingGif from "../../../../assets/img/loading.gif";

const PutBudget = ({ onBudgetAdded = () => {} }) => {

    let { id } = useParams();
    const dispatch = useDispatch();

    const budgetDetail = useSelector(state => state.budget?.budgetDetail || {}); 

    const [editBudget, setEditBudget] = useState({});
    const [initialBudget, setInitialBudget] = useState({});
    const [total, setTotal] = useState(0);
    const [errorMessage, setErrorMessage] = useState(""); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(getBudgetById(id));
    }, [dispatch, id])

    useEffect(() => {    
        if (budgetDetail && budgetDetail._id === id) {     
            if (budgetDetail.personClient) {
                setSearchingPerson(true);
                setSearchTermClients(`${budgetDetail.personClient.dni} - ${budgetDetail.personClient.name}`);
            } else if (budgetDetail.companyClient) {
                setSearchingPerson(false);
                setSearchTermClients(`${budgetDetail.companyClient.cuit} - ${budgetDetail.companyClient.name}`);
            } else {
                setSearchTermClients('');
            }   
            if (budgetDetail.vehicle) {
                setSearchTermVehicles(`${budgetDetail.vehicle.licensePlate}`);
            } else {
                setSearchTermVehicles('');
            }

            const initialData = {
                _id: budgetDetail._id,
                personClient: budgetDetail.personClient ? budgetDetail.personClient._id : null,
                companyClient: budgetDetail.companyClient ? budgetDetail.companyClient._id : null,
                vehicle: budgetDetail.vehicle ? budgetDetail.vehicle._id : null,
                items: budgetDetail.items || [],
                total: budgetDetail.total,
                active: budgetDetail.active,
            };
            setEditBudget(initialData);
            setInitialBudget(initialData);
        }
    }, [dispatch, id, budgetDetail]);
    
    // ----- HANDLE INPUTS
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'searchTermClients') {
            setSearchTermClients(value);
            if (value === '') setDropdownVisibleClients(false);
        }
    
        if (name === 'searchTermVehicles') {
            setSearchTermVehicles(value);
            if (value === '') setDropdownVisibleVehicles(false);
        }
    };

    const [ disabled, setDisabled ] = useState(true);

    useEffect(() => {
        if((editBudget.companyClient || editBudget.personClient) && editBudget.items?.length > 0){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [editBudget]);

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
            setEditBudget({ ...editBudget, personClient: client._id, companyClient: null });
        } else {
            setEditBudget({ ...editBudget, companyClient: client._id, personClient: null });
        }
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
        setEditBudget((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));
    
        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setEditBudget((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setEditBudget((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setEditBudget((prevState) => ({
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
            setSelectedIndex((prev) => (prev + 1) % filteredItems?.length);
        } else if (event.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev - 1 + filteredItems?.length) % filteredItems.length);
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
            handleSelection(filteredItems[selectedIndex]);
            setDropdownVisible(false);
        } else {
            setDropdownVisible(true);
        }
    };

    //----- HANDLE ITEMS

    const [currentItem, setCurrentItem] = useState({
        quantity: 0,
        description: "",
        price: 0,
    });

    const handleNewItem = () => {
        if (
            currentItem.quantity &&
            currentItem.description.trim() !== "" &&
            currentItem.price
        ) {
            setEditBudget((prevBudget) => ({
                ...prevBudget,
                items: [...prevBudget.items, currentItem],
            }));

            setCurrentItem({
                quantity: 0,
                description: "",
                price: 0,
            });
        } else {
            alert("Por favor, complete todos los campos del ítem.");
        }
    };

    const removeItem = (index) => {
        setEditBudget((prevState) => ({
            ...prevState,
            items: prevState.items.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        const newTotal = editBudget.items?.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        setTotal(newTotal);
    }, [editBudget.items]);

    const [ disabledNewItem, setDisabledNewItem ] = useState(true);

    useEffect(() => {
        if(currentItem.quantity && currentItem.description !== '' && currentItem.price){
            setDisabledNewItem(false);
        } else {
            setDisabledNewItem(true);
        }
    }, [currentItem]);

    //----- RESET

    const resetForm = () => {
        setEditBudget(initialBudget);
        // Actualizar los valores de búsqueda del cliente y vehículo
        if (budgetDetail.personClient) {
            setSearchTermClients(`${budgetDetail.personClient.dni} - ${budgetDetail.personClient.name}`);
        } else if (budgetDetail.companyClient) {
            setSearchTermClients(`${budgetDetail.companyClient.cuit} - ${budgetDetail.companyClient.name}`);
        } else {
            setSearchTermClients('');
        }

        setSearchingPerson(budgetDetail.personClient ? true : false);
    
        if (budgetDetail.vehicle) {
            setSearchTermVehicles(budgetDetail.ehicle?.licensePlate || '');
        } else {
            setSearchTermVehicles('');
        }
        setCurrentItem({
            quantity: 0,
            description: "",
            price: 0,
        });
        setTotal(initialBudget.total);
    }

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
            const response = await dispatch(putBudget(editBudget));
            setLoading(false);
            console.log("Budget successfully saved");

            if(editBudget.personClient){
                dispatch(getPersonClients());
            }

            if(editBudget.companyClient){
                dispatch(getCompanyClients());
            }

            if(editBudget.vehicle){
                dispatch(getVehicles());
            }

            resetForm();
            dispatch(getBudgets());
            dispatch(getAllBudgets());
            dispatch(getBudgetById(id));
            onBudgetAdded(response);
        } catch (error) {
            setErrorMessage("*Error al crear presupuesto, revise los datos ingresados e intente nuevamente.");
            console.error("Error saving budget:", error.message);
            setLoading(false);
        }
    };

    return (
        <div className="formContainer">
            <div className="titleForm">
                <h2>Nuevo presupuesto</h2>
                <div className="titleButtons">
                    <button 
                        onClick={resetForm} 
                        onMouseEnter={(e) => e.currentTarget.firstChild.src = rebootHover} 
                        onMouseLeave={(e) => e.currentTarget.firstChild.src = reboot}
                    >
                        <img src={reboot} alt="Reboot"/>
                    </button>
                </div>
            </div>
            <div className="container">
                <div className="formRow">Los campos con (*) son obligatorios.</div>
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
                        <button onClick={() => setShowNewVehicle(!showNewVehicle)} type="button">
                            {showNewVehicle ? '-' : '+'}
                        </button>                                 
                    </div>
                    <div className="searchRow">
                        {filteredVehicles?.length > 0 && dropdownVisibleVehicles && (
                            <ul className="dropdown">
                                {filteredVehicles.map((vehicle, index) => (
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
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true} personClientId={editBudget.personClient} companyClientId={editBudget.companyClient}/>}
                <div className="clientSelection">
                        <label className="formRow">Cliente*</label>
                        {editBudget.personClient || editBudget.companyClient ? 
                            <></> :
                            (
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
                            <button onClick={() => setShowNewClient(!showNewClient)} type="button" disabled={editBudget.personClient || editBudget.companyClient}>
                                {showNewClient ? '-' : '+'}
                            </button>                                 
                        </div>
                        <div className="searchRow">
                            {filteredClients?.length > 0 && dropdownVisibleClients && (
                                <ul className="dropdown">
                                    {filteredClients.map((client, index) => (
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
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true} vehicleId={editBudget.vehicle}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true} vehicleId={editBudget.vehicle}/>}
                <div className="formRow"></div>
                <form id="budgetForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                    <div className="formRow">
                        <label>Items*</label>
                    </div>
                    <div className="newItem">
                        <div className="formRow">
                            <label>Cantidad*</label>
                            <input
                                type="number"
                                value={currentItem.quantity || ""}
                                onChange={(event) =>
                                    setCurrentItem({
                                        ...currentItem,
                                        quantity: parseInt(event.target.value, 10) || 0,
                                    })
                                }
                                min={0}
                            />
                        </div>
                        <div className="formRow">
                            <label>Descripción*</label>
                            <input
                                type="text"
                                value={currentItem.description}
                                onChange={(event) =>
                                    setCurrentItem({
                                        ...currentItem,
                                        description: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="formRow">
                            <label>Precio unitario*</label>
                            <input
                                type="number"
                                value={currentItem.price || ""}
                                onChange={(event) =>
                                    setCurrentItem({
                                        ...currentItem,
                                        price: parseInt(event.target.value, 10) || 0,
                                    })
                                }
                                min={0}
                            />
                        </div>
                        <div className="formRow">                            
                            <button type="button" onClick={handleNewItem} disabled={disabledNewItem}>
                                Añadir ítem
                            </button>
                        </div>
                    </div>
                    {editBudget.items?.length > 0 && (
                        <div className="formRow">
                            <ul>
                                {editBudget.items.map((item, index) => (
                                    <li key={index}>
                                        {item.quantity} x {item.description} - $
                                        {item.price} - Subtotal: ${item.quantity * item.price}
                                        <button type="button" onClick={() => removeItem(index)}>x</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="formRow"><label>Total: ${total}</label></div>
                    <div className="submit">
                        <button type='submit' form="budgetForm" disabled={disabled}>{loading ? <img src={loadingGif} alt=""/> : "Editar presupuesto"}</button>
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PutBudget;
