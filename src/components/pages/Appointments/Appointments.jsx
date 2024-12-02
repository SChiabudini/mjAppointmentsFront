import React from 'react';
import NewAppointment from './NewAppointment/NewAppointment.jsx';
import Calendar from './Calendar/Calendar.jsx'

const Appointments = () => {

  return (
    <div className='page'>
      <div className='popUp'><NewAppointment /></div>
      <Calendar />
    </div>
  )
}

export default Appointments;