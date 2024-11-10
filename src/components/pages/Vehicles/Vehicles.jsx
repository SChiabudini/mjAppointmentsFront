import style from './Vehicles.module.css';
import React, { useEffect, useState } from 'react';

const Vehicles = () => {

  const initialVehicleState = {
    licensePlate: '',
    brand: '',
    model: '',
    year: 0,
    engine: '',
    personClient: {},
    companyClient: {},
    serviceSheets: [],
    procedureSheets: []
  };

  const [newVehicle, setNewVehicle] = useState(initialVehicleState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if(name === 'licensePlate'){
      setNewVehicle({
            ...newVehicle,
            name: value
        });
    };
    if(name === 'brand'){
      setNewVehicle({
            ...newVehicle,
            name: value
        });
    };
    if(name === 'model'){
      setNewVehicle({
            ...newVehicle,
            name: value
        });
    };
    if(name === 'engine'){
      setNewVehicle({
            ...newVehicle,
            name: value
        });
    };
    // validateForm();
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
      companyClient: newVehicle.companyClient,
      serviceSheets: newVehicle.serviceSheets,
      procedureSheets: newVehicle.procedureSheets,
    };

    try {
        // Enviar la petición como un objeto JSON
        // const response = await dispatch(postAppointment(vehicleData));

        if (response.data) {
            console.log("Vehicle successfully saved");
            setNewAppointment(initialVehicleState); // Resetear el formulario
            // navigate('/main_window/vehiculos/success/post');
        }
    } catch (error) {
        console.error("Error saving vehicle:", error);
    }
  };

  return (
    <div className="page">
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
          <input type="text" name="year" value={newVehicle.year}/>
        </div>
        <div>
          <label htmlFor="engine">Motor</label>
          <input type="text" name="engine" value={newVehicle.engine}/>
        </div>
        <div>
          <label>Cliente</label>
          <label htmlFor="personClient">Persona</label>
          <input type="checkbox" name="personClient"/>
          <label htmlFor="companyClient">Empresa</label>
          <input type="checkbox" name="companyClient"/>
          <select name="personClient" value={newVehicle.personClient}>
            <option value="" disabled>Seleccionar</option>
          </select>
          <select name="companyClient" value={newVehicle.companyClient}>
            <option value="" disabled>Seleccionar</option>
          </select>
          <div>
            <button type='button'>Crear</button>
          </div>
        </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default Vehicles;