import React, { useState } from "react";

const NewCompanyClient = () => {

    const initialCompanyClientState = {
      cuit: '',
      name: '',
      email: '',
      phones: [],
      address: '',
      vehicles: [],
      serviceSheets: [],
      procedureSheets: [],    
    };
  
    const [newCompanyClient, setNewCompanyClient] = useState(initialCompanyClientState);
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      
      if(name === 'cuit'){
        setNewCompanyClient({
              ...newCompanyClient,
              name: value
          });
      };
      if(name === 'name'){
        setNewCompanyClient({
              ...newCompanyClient,
              name: value
          });
      };
      if(name === 'email'){
        setNewCompanyClient({
              ...newCompanyClient,
              name: value
          });
      };
      if(name === 'address'){
        setNewCompanyClient({
              ...newCompanyClient,
              name: value
          });
      };
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
        serviceSheets: newCompanyClient.serviceSheets,
        procedureSheets: newCompanyClient.procedureSheets
      };
  
      try {
          // Enviar la petición como un objeto JSON
          // const response = await dispatch(postAppointment(companyClientData));
  
          if (response.data) {
              console.log("Company client successfully saved");
              setNewCompanyClient(initialCompanyClientState); // Resetear el formulario
              // navigate('/main_window/cliente/success/post');
          }
      } catch (error) {
          console.error("Error saving company client:", error);
      }
    };
  
    return (
      <div className="page">
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
                  <label htmlFor="address">Dirección</label>
                  <input type="text" name="address" value={newCompanyClient.address} onChange={handleInputChange}/>
                </div>
                <div>
                  {/* Guardar varios telefonos */}
                  <label htmlFor="phones">Teléfono</label> 
                  <input type="text" name="phones" value={newCompanyClient.phones}/>
                </div>
                <div>
                  {/* Guardar varios vehiculos */}
                  <label htmlFor="vehicles">Vehículo(s)</label> 
                  <input type="text" name="vehicles" value={newCompanyClient.vehicles}/>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
};

export default NewCompanyClient;