import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getCompanyClients, postCompanyClient } from "../../../../../redux/companyClientActions";

const NewCompanyClient = () => {

  const dispatch = useDispatch();

  const initialCompanyClientState = {
    cuit: '',
    name: '',
    email: '',
    phones: [],
    address: '',
    vehicles: []   
  };
  
  const [newCompanyClient, setNewCompanyClient] = useState(initialCompanyClientState);
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewCompanyClient({
      ...newCompanyClient,
      [name]: value,
    });

    if(name === 'cuit'){
      setAlreadyExist(false);
    }
  };
  
  const handlePhoneChange = (event) => {
    setCurrentPhone(event.target.value);
  };

  const addPhone = () => {
    if (currentPhone.trim() !== "") {
        setNewCompanyClient((prevState) => ({
            ...prevState,
            phones: [...prevState.phones, currentPhone.trim()]
        }));
        setCurrentPhone(""); 
    }
  };

  const removePhone = (index) => {
    setNewCompanyClient((prevState) => ({
        ...prevState,
        phones: prevState.phones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const companyClientData = {
      cuit: newCompanyClient.cuit,
      name: newCompanyClient.name, 
      email: newCompanyClient.email,
      phones: newCompanyClient.phones,
      address: newCompanyClient.address,
      vehicles: newCompanyClient.vehicles,
    };

    try {
      console.log(companyClientData);
      await dispatch(postCompanyClient(companyClientData));
      console.log("Client successfully saved");
      setNewCompanyClient(initialCompanyClientState);
      dispatch(getCompanyClients());
    
    } catch (error) {
      console.error("Error saving company client:", error.message);
      if(error.message.includes('already exist')){
          setAlreadyExist(true);
      }
    }
  };
  
    return (
<div  className="component">
          <div className="title">
            <h2>NUEVO CLIENTE EMPRESA</h2>
            <div className="titleButtons">
                {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
            </div>
          </div>
          <div className="container">
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label htmlFor="cuit">CUIT</label>
                  <input type="text" name="cuit" value={newCompanyClient.cuit} onChange={handleInputChange}/>
                  {alreadyExist && <p>Ya existe un cliente con ese CUIT.</p>}
                </div>
                <div>
                  <label htmlFor="name">Nombre</label>
                  <input type="text" name="name" value={newCompanyClient.name} onChange={handleInputChange}/>
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input type="text" name="email" value={newCompanyClient.email} onChange={handleInputChange}/>
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
                        {newCompanyClient.phones.map((phone, index) => (
                            <li key={index}>
                                {phone}
                                <button type="button" onClick={() => removePhone(index)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                  <label htmlFor="address">Dirección</label>
                  <input type="text" name="address" value={newCompanyClient.address} onChange={handleInputChange}/>
                </div>
                {/* <div>
                  <label htmlFor="vehicles">Vehículo(s)</label> 
                  <input type="text" name="vehicles" value={newCompanyClient.vehicles}/>
                </div> */}
                <button type='submit'>Crear</button>
              </div>
            </form>
          </div>
        </div>
    )
};

export default NewCompanyClient;