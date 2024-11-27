import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getPersonClients, postPersonClient } from "../../../../../redux/personClientActions";

const NewPersonClient = ({ onClientAdded = () => {} }) => {

    const dispatch = useDispatch();

    const initialPersonClientState = {
        dni: '',
        name: '',
        email: '',
        phones: [],
        cuilCuit: '',
        vehicles: []
      };
    
      const [newPersonClient, setNewPersonClient] = useState(initialPersonClientState);
      const [alreadyExist, setAlreadyExist] = useState(false);
      const [currentPhone, setCurrentPhone] = useState("");

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        setNewPersonClient({
            ...newPersonClient,
            [name]: value,
        });

        if (name === 'dni') {
            setAlreadyExist(false);
          }
      };

      const handlePhoneChange = (event) => {
        setCurrentPhone(event.target.value);
    
    };

    const addPhone = () => {
        if (currentPhone.trim() !== "") {
            setNewPersonClient((prevState) => ({
                ...prevState,
                phones: [...prevState.phones, currentPhone.trim()]
            }));
            setCurrentPhone("");
        }
    };

    const removePhone = (index) => {
        setNewPersonClient((prevState) => ({
            ...prevState,
            phones: prevState.phones.filter((_, i) => i !== index)
        }));
    };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const personClientData = {
          dni: newPersonClient.dni, 
          name: newPersonClient.name, 
          email: newPersonClient.email,
          phones: newPersonClient.phones,
          cuilCuit: newPersonClient.cuilCuit,
          vehicles: newPersonClient.vehicles
        };
    
        try {
            dispatch(postPersonClient(personClientData))
            .then((response) => {
                onClientAdded(response);
                console.log("Client successfully saved");
                setNewPersonClient(initialPersonClientState);
                dispatch(getPersonClients());
            })
            .catch(error => {
                console.error("Error saving person client:", error.message);
                if(error.message.includes('already exist')){
                    setAlreadyExist(true);
                }
            });

        } catch (error) {
            console.error("Unexpected error:", error.message);
        }
      };
    
      return (
        <div  className="component">
            <div className="title">
            <h2>NUEVO CLIENTE</h2>
            <div className="titleButtons">
                {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
            </div>
            </div>
            <div className="container">
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="dni">DNI</label>
                        <input type="text" name="dni" value={newPersonClient.dni} onChange={handleInputChange}/>
                        {alreadyExist && <p>Ya existe un client con ese DNI.</p>}
                    </div>
                    <div>
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" value={newPersonClient.name} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" value={newPersonClient.email} onChange={handleInputChange}/>
                    </div>
                    <div>
                        <label htmlFor="phones">Teléfono</label>
                        <div>
                            <input
                                type="text"
                                value={currentPhone}
                                onChange={handlePhoneChange}
                                placeholder="Añadir teléfono"
                            />
                            <button type="button" onClick={addPhone}>Añadir</button>
                        </div>
                        <ul>
                            {newPersonClient.phones.map((phone, index) => (
                                <li key={index}>
                                    {phone}
                                    <button type="button" onClick={() => removePhone(index)}>Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* <div>
                        <label htmlFor="vehicles">Vehículo(s)</label> 
                        <input type="text" name="vehicles" value={newPersonClient.vehicles}/>
                    </div>*/}
                    <div>
                        <label htmlFor="cuilCuit">CUIL/CUIT</label>
                        <input type="text" name="cuilCuit" value={newPersonClient.cuilCuit} onChange={handleInputChange}/>
                    </div>
                    <button type='submit'>Crear</button>
                </div>
            </form>
            </div>
        </div>
      )
};

export default NewPersonClient;