import React, { useState } from "react";

const NewPersonClient = () => {
    const initialPersonClientState = {
        dni: '',
        name: '',
        email: '',
        phones: [],
        cuilCuit: '',
        vehicles: [],
        serviceSheets: [],
        procedureSheets: [],    
      };
    
      const [newPersonClient, setNewPersonClient] = useState(initialPersonClientState);
    
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        if(name === 'dni'){
          setNewPersonClient({
                ...newPersonClient,
                name: value
            });
        };
        if(name === 'name'){
          setNewPersonClient({
                ...newPersonClient,
                name: value
            });
        };
        if(name === 'email'){
          setNewPersonClient({
                ...newPersonClient,
                name: value
            });
        };
        if(name === 'cuilCuit'){
          setNewPersonClient({
                ...newPersonClient,
                name: value
            });
        };
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const personClientData = {
          dni: newPersonClient.dni, 
          name: newPersonClient.name, 
          email: newPersonClient.email,
          phones: newPersonClient.phones,
          cuilCuit: newPersonClient.cuilCuit,
          vehicles: newPersonClient.vehicles,
          serviceSheets: newPersonClient.serviceSheets,
          procedureSheets: newPersonClient.procedureSheets
        };
    
        try {
            // Enviar la petición como un objeto JSON
            // const response = await dispatch(postAppointment(personClientData));
    
            if (response.data) {
                console.log("Person client successfully saved");
                setNewPersonClient(initialPersonClientState); // Resetear el formulario
                // navigate('/main_window/cliente/success/post');
            }
        } catch (error) {
            console.error("Error saving person client:", error);
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
                    {/* Guardar varios telefonos */}
                    <input type="text" name="phones" value={newPersonClient.phones}/>
                </div>
                <div>
                    {/* Guardar varios vehiculos */}
                    <label htmlFor="vehicles">Vehículo(s)</label> 
                    <input type="text" name="vehicles" value={newPersonClient.vehicles}/>
                </div>
                <div>
                    <label htmlFor="cuilCuit">CUIL/CUIT</label>
                    <input type="text" name="cuilCuit" value={newPersonClient.cuilCuit} onChange={handleInputChange}/>
                </div>
                </div>
            </form>
            </div>
        </div>
      )
};

export default NewPersonClient;