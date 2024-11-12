import style from './Appointments.module.css';
import React, { useEffect, useState } from 'react';


const Appointments = () => {

  const initialAppointmentState = {
    date: '',
    time: '',
    personClient: {},
    companyClient: {},
    vehicle: {},
    procedure: ''
  };

  const [newAppointment, setNewAppointment] = useState(initialAppointmentState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // if (event.target.value) {
    //     setIsClearDisabled(false);
    // }

    if(name === 'date'){
      setNewAppointment({
            ...newAppointment,
            name: value
        });
    };
    if(name === 'time'){
      setNewAppointment({
            ...newAppointment,
            name: value
        });
    };
    if(name === 'procedure'){
      setNewAppointment({
            ...newAppointment,
            name: value
        });
    };
    // validateForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const appointmentData = {
      date: newAppointment.date,
      time: newAppointment.time, 
      personClient: newAppointment.personClient,
      companyClient: newAppointment.companyClient,
      vehicle: newAppointment.vehicle,
      procedure: newAppointment.procedure
    };

    try {
        // Enviar la petición como un objeto JSON
        // const response = await dispatch(postAppointment(appointmentData));

        if (response.data) {
            console.log("Appointment successfully saved");
            setNewAppointment(initialAppointmentState); // Resetear el formulario
            // navigate('/main_window/turnos/success/post');
        }
    } catch (error) {
        console.error("Error saving appoiment:", error);
    }
  };

  return (
    <div className="page">
      <div className="component">
        <div className="title">
          <h2>NUEVO TURNO</h2>
          <div className="titleButtons">
              {/* <button onClick={handleSetForm} disabled={isClearDisabled}><img src={iconClear} alt="" /></button> */}
          </div>
        </div>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div>
              {/* <div className={style.containerMessage}>
                <label className={style.mensagge}>Los campos con (*) son obligatorios</label>
              </div> */}
              <div>
                <label htmlFor="date">Año</label>
                <input type="text" name="date" value={newAppointment.date} onChange={handleInputChange}/>
              </div>
              <div>
                <label htmlFor="date">Mes</label>
                <input type="text" name="date" value={newAppointment.date} onChange={handleInputChange}/>
              </div>
              <div>
                <label htmlFor="date">Día</label>
                <input type="text" name="date" value={newAppointment.date} onChange={handleInputChange}/>
              </div>
              <div>
                <label htmlFor="time">Horario</label>
                <input type="text" name="time" value={newAppointment.time} onChange={handleInputChange}/>
              </div>
              <div>
                <label>Cliente</label>
                <label htmlFor="personClient">Persona</label>
                <input type="checkbox" name="personClient"/>
                <label htmlFor="companyClient">Empresa</label>
                <input type="checkbox" name="companyClient"/>
                <select name="personClient" value={newAppointment.personClient}>
                  <option value="" disabled>Seleccionar</option>
                </select>
                <select name="companyClient" value={newAppointment.companyClient}>
                  <option value="" disabled>Seleccionar</option>
                </select>
                <div>
                  <button type='button'>Crear</button>
                </div>
              </div>
              <div>
                <label htmlFor="vehicle">Vehículo:</label>
                <select name="vehicle" value={newAppointment.vehicle}>
                  <option value="" disabled>Seleccionar</option>
                </select>
                <div>
                  <button type='button' >Crear</button>
                </div>
              </div>
              <div className={style.descriptionContainer}>
                <label htmlFor="procedure">Procedimiento</label>
                <textarea type="text" name="procedure" value={newAppointment.procedure} onChange={handleInputChange}/>
              </div> 
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Appointments;