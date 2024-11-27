import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getVehicles, postVehicle } from '../../../../redux/vehicleActions.js';
import { getPersonClients } from '../../../../redux/personClientActions.js';
import { getCompanyClients } from '../../../../redux/companyClientActions.js';

const NewVehicle = () => {

  const dispatch = useDispatch();

  const initialVehicleState = {
    licensePlate: '',
    brand: '',
    model: '',
    year: 0,
    engine: '',
    personClient: null,
    companyClient: null
  };

  const personClients = useSelector(state => state.personClient.personClients);
  const companyClients = useSelector(state => state.companyClient.companyClients);

  const [newVehicle, setNewVehicle] = useState(initialVehicleState);
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchingPerson, setSearchingPerson] = useState(true);

  useEffect(() => {
    if(personClients.length === 0){
      dispatch(getPersonClients());
    };

    if(companyClients.length === 0){
      dispatch(getCompanyClients());
    };

  }, [personClients, companyClients, dispatch]);

  useEffect(() => {
    const clients = searchingPerson ? personClients : companyClients;
    setFilteredClients(
      clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (client.dni && client.dni.toString().includes(searchTerm))
      )
    );
  }, [searchTerm, searchingPerson, personClients, companyClients]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setNewVehicle({
      ...newVehicle,
      [name]: name === 'year' ? parseInt(value, 10) || 0 : value,
    });

    if (name === 'licensePlate') {
      setAlreadyExist(false);
    }
  };
  
  const handleClientSelection = (id) => {
    if (searchingPerson) {
      setNewVehicle({ ...newVehicle, personClient: id, companyClient: null });
    } else {
      setNewVehicle({ ...newVehicle, companyClient: id, personClient: null });
    }
    setSearchTerm('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const vehicleData = {
        licensePlate: newVehicle.licensePlate,
        brand: newVehicle.brand,
        model: newVehicle.model,
        year: newVehicle.year,
        engine: newVehicle.engine,
        personClient: newVehicle.personClient,
        companyClient: newVehicle.companyClient
    };

    try {
        await dispatch(postVehicle(vehicleData));
        console.log("Vehicle successfully saved");
        setNewVehicle(initialVehicleState);
        dispatch(getVehicles());
    } catch (error) {
        // Aquí manejamos el error
        console.error("Error saving vehicle:", error.message);
        if(error.message.includes('already exist')){
          setAlreadyExist(true);
        }
    }
};

  return (
    <div className="component">
      <div className="title">
        <h2>NUEVO VEHÍCULO</h2>
        <div className="titleButtons">
            {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
        </div>
      </div>
      <div className="container">
      <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="licensePlate">Patente</label>
        <input type="text" name="licensePlate" value={newVehicle.licensePlate} onChange={handleInputChange}/>
        {alreadyExist && <p>Ya existe un vehículo con esa patente.</p>}
      </div>
      <div>
        <label htmlFor="brand">Marca</label>
        <input type="text" name="brand" value={newVehicle.brand} onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="model">Modelo</label>
        <input type="text" name="model" value={newVehicle.model} onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="year">Año</label>
        <input type="number" name="year" value={newVehicle.year} onChange={handleInputChange}/>
      </div>
      <div>
        <label htmlFor="engine">Motor</label>
        <input type="text" name="engine" value={newVehicle.engine} onChange={handleInputChange}/>
      </div>
      <div>
          <label>Cliente</label>
          <div>
            <button type="button" onClick={() => setSearchingPerson(true)}>Persona</button>
            <button type="button" onClick={() => setSearchingPerson(false)}>Empresa</button>
          </div>
          <input
            type="text"
            placeholder={`Buscar ${searchingPerson ? 'persona' : 'empresa'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredClients.length > 0 && (
            <ul className="dropdown">
              {filteredClients.map(client => (
                <li key={client._id} onClick={() => handleClientSelection(client._id)}>
                  {client.dni ? `${client.dni} - ${client.name}` : client.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <button type='submit'>Crear</button>
        </div>

      </form>
      </div>
    </div>
  )
}

export default NewVehicle;