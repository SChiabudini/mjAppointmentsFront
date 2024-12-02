import React from 'react';
import NewVehicle from './NewVehicle/NewVehicle.jsx';
import VehiclesTable from './VehiclesTable/VehiclesTable.jsx';

const Vehicles = () => {

  return (
    <div className='page'>
      <div className='popUp'><NewVehicle /></div>
      <VehiclesTable />
    </div>
  )
}

export default Vehicles;