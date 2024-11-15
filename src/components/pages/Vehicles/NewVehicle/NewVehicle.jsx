import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getVehicles, postVehicle } from '../../../../redux/vehicleActions';

const NewVehicle = () => {

  const dispatch = useDispatch();

  const initialVehicleState = {
    licensePlate: '',
    brand: '',
    model: '',
    year: 0,
    engine: '',
    personClient: '',
    companyClient: ''
  };

  const [newVehicle, setNewVehicle] = useState(initialVehicleState);
  const [alreadyExist, setAlreadyExist] = useState(false);

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
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const vehicleData = {
        licensePlate: newVehicle.licensePlate,
        brand: newVehicle.brand,
        model: newVehicle.model,
        year: newVehicle.year,
        engine: newVehicle.engine,
    };

    try {
        console.log(vehicleData);
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
      {/*<div>
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
              </div>
        */}
        <div>
          <button type='submit'>Crear</button>
        </div>

      </form>
      </div>
    </div>
  )
}

export default NewVehicle;