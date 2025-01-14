import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBudgets, postBudget } from "../../../../redux/budgetActions.js";
import { getPersonClients } from "../../../../redux/personClientActions";
import { getCompanyClients } from "../../../../redux/companyClientActions";
import { getVehicles } from "../../../../redux/vehicleActions";
import NewPersonClient from "../../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx";
import NewCompanyClient from "../../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx";
import NewVehicle from "../../Vehicles/NewVehicle/NewVehicle.jsx";
import clear from  "../../../../assets/img/clear.png";
import clearHover from "../../../../assets/img/clearHover.png";

const NewBudget = ({ onBudgetAdded = () => {} }) => {

    const dispatch = useDispatch();

    const initialBudgetState = {
        personClient: null,
        companyClient: null,
        vehicle: null,
        end: '',
        items: [],
    };

    const [newBudget, setNewBudget] = useState(initialBudgetState);
    const [total, setTotal] = useState(0);

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
            setNewBudget({ ...newBudget, personClient: client._id, companyClient: null });
        } else {
            setNewBudget({ ...newBudget, companyClient: client._id, personClient: null });
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
        setNewBudget((prevState) => ({
            ...prevState,
            vehicle: vehicle._id
        }));
    
        // Lógica de asignación para personClient y companyClient
        if (vehicle.personClient) {
            setSearchTermClients(`${vehicle.personClient.dni} - ${vehicle.personClient.name}`);
            setNewBudget((prevState) => ({
                ...prevState,
                personClient: vehicle.personClient._id,
                companyClient: null
            }));
            setSearchingPerson(true);
        } else if (vehicle.companyClient) {
            setSearchTermClients(`${vehicle.companyClient.cuit} - ${vehicle.companyClient.name}`);
            setNewBudget((prevState) => ({
                ...prevState,
                companyClient: vehicle.companyClient._id,
                personClient: null
            }));
            setSearchingPerson(false);
        } else {
            setSearchTermClients('');
            setNewBudget((prevState) => ({
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
            setNewBudget((prevBudget) => ({
                ...prevBudget,
                items: [...prevBudget.items, currentItem],
            }));

            const newItems = [...newBudget.items, currentItem];
            setTotal(newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ))

            setCurrentItem({
                quantity: 0,
                description: "",
                price: 0,
            });
        } else {
            alert("Por favor, complete todos los campos del ítem.");
        }
    };

    //----- RESET

    const resetForm = () => {
        setNewBudget(initialBudgetState);
        setSearchTermClients('');
        setSearchTermVehicles('');
        setSearchingPerson(true);
        setCurrentItem({
            quantity: 0,
            description: "",
            price: 0,
        });
        setTotal(0);
    }

    //----- SUBMIT

    const handleNoSend = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedEndDate = `${newBudget.end}T00:00:00.000Z`;

        const budgetToSubmit = {
            ...newBudget,
            end: formattedEndDate, // Actualiza el valor de 'end' con el formato correcto
        };

        try {
            console.log(budgetToSubmit);
            const response = await dispatch(postBudget(budgetToSubmit));
            console.log("Budget successfully saved");

            if(newBudget.personClient){
                dispatch(getPersonClients());
            }

            if(newBudget.companyClient){
                dispatch(getCompanyClients());
            }

            if(newBudget.vehicle){
                dispatch(getVehicles());
            }

            setNewBudget(initialBudgetState);
            setSearchTermClients('');
            setSearchTermVehicles('');
            setSearchingPerson(true);
            setCurrentItem({
                quantity: 0,
                description: "",
                price: 0,
            });
            setTotal(0);
            dispatch(getBudgets());
            onBudgetAdded(response);
        } catch (error) {
            console.error("Error saving budget:", error.message);
        }
    };

    return (
        <div className="formContainer">
            <div className="titleForm">
                <h2>Nuevo presupuesto</h2>
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
                        {filteredVehicles.length > 0 && dropdownVisibleVehicles && (
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
                {showNewVehicle && <NewVehicle onVehicleAdded={handleVehicleSelection} isNested={true} personClientId={newBudget.personClient} companyClientId={newBudget.companyClient}/>}
                <div className="clientSelection">
                        <label className="formRow">Cliente</label>
                        {newBudget.personClient || newBudget.companyClient ? 
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
                            <button onClick={() => setShowNewClient(!showNewClient)} type="button" disabled={newBudget.personClient || newBudget.companyClient}>
                                {showNewClient ? '-' : '+'}
                            </button>                                 
                        </div>
                        <div className="searchRow">
                            {filteredClients.length > 0 && dropdownVisibleClients && (
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
                {showNewClient && searchingPerson && <NewPersonClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newBudget.vehicle}/>}
                {showNewClient && !searchingPerson && <NewCompanyClient onClientAdded={handleClientSelection} isNested={true} vehicleId={newBudget.vehicle}/>}
                <div className="formRow"></div>
                <form id="budgetForm" onSubmit={handleSubmit} onKeyDown={handleNoSend}>
                    <div className="formRow">
                        <label>
                            Vencimiento
                            <input
                                type="date"
                                name="end"
                                onChange={(event) => setNewBudget({...newBudget, end: event.target.value})}
                                value={newBudget.end}
                            />
                        </label>
                    </div>
                        <div className="formRow">
                            <label>Items</label>
                        </div>
                        <div className="newItem">
                            <div className="formRow">
                                <label>Cantidad:</label>
                                <input
                                    type="number"
                                    value={currentItem.quantity || ""}
                                    onChange={(event) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            quantity: parseInt(event.target.value, 10) || 0,
                                        })
                                    }
                                />
                            </div>
                            <div className="formRow">
                                <label>Descripción:</label>
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
                                <label>Precio unitario:</label>
                                <input
                                    type="number"
                                    value={currentItem.price || ""}
                                    onChange={(event) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            price: parseInt(event.target.value, 10) || 0,
                                        })
                                    }
                                />
                            </div>
                            <button type="button" onClick={handleNewItem}>
                                Añadir ítem
                            </button>
                        </div>
                        {newBudget.items.length > 0 && (
                            <div className="formRow">
                                <ul>
                                    {newBudget.items.map((item, index) => (
                                        <li key={index}>
                                            {item.quantity} x {item.description} - $
                                            {item.price} - Subtotal: ${item.quantity * item.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="formRow"><label>Total: ${total}</label></div>
                    <div className="submit">
                        <button type='submit' form="budgetForm">Crear presupuesto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewBudget;
