import style from './Appointments.module.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";
import iconMechanic from './Icons/mechanic.png';
import iconService from './Icons/service.png';
import { useSelector, useDispatch } from "react-redux";
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import NewAppointment from './NewAppointment/NewAppointment.jsx';
import { getAppointments } from "../../../redux/appointmentActions.js";

dayjs.locale('es');

const Appointments = () => {

  const dispatch = useDispatch();

  //----- ABRIR POPUP
  const [popUpOpen, setPopUpOpen] = useState(false);

  const localizer = dayjsLocalizer(dayjs);

  const appointments = useSelector(state => state.appointment.appointments);
  
  const events = appointments?.map(appointment => ({
      _id: appointment._id ? appointment._id : '',
      start: dayjs(appointment.start).toDate(),
      end: dayjs(appointment.end).toDate(),
      procedureIconMechanic: appointment.procedure ? appointment.procedure.mechanical : '',
      procedureIconService: appointment.procedure ? appointment.procedure.service : '',
      procedureTitle: appointment.procedure ? appointment.procedure.title : '',
      personClient: appointment.personClient ? appointment.personClient.name : '',  
      companyClient: appointment.companyClient ? appointment.companyClient.name : '',  
      vehicle: `${appointment.vehicle?.brand || ''} ${appointment.vehicle?.model || ''}`, 
  }));  

  const components = {
      event: props => {   
          // Destructuración de los valores de props.event: 
          const { _id, procedureIconMechanic, procedureIconService, procedureTitle, personClient, companyClient, vehicle } = props.event;  

          return (
            <Link to={`/main_window/turnos/${_id}`}>
                <div className={style.containerEvents}>
                <div>
                    <span>
                    {procedureIconMechanic && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                    {procedureIconService && <img src={iconService} alt="service-icon" className={style.icon} />}
                    </span>
                </div>
                <div className={style.content}>
                    <span>{procedureTitle}</span>
                    <span>{personClient}</span>
                    <span>{companyClient}</span>
                    <span>{vehicle}</span>
                </div>
                </div>
            </Link>
          )
      }
  };  

  const messages = {
      allDay: "Todo el día",
      previous: "Anterior",
      next: "Siguiente",
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
      agenda: "Agenda",
      date: "Fecha",
      time: "Hora",
      event: "Evento",
      noEventsInRange: "Sin turnos agendados"
  };

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  return (
      <div className="page">
        <div className="title">
          <h2>Turnos</h2>
          <button onClick={() => setPopUpOpen(true)}>Nuevo</button>
        </div>
        <div className="container">
          <div className={style.calendarContainer}>
            <Calendar 
              localizer={localizer}
              messages={messages}
              events={events}
              min={dayjs('2024-01-01T07:00:00').toDate()}  // Hora apertura (07:00 AM)
              max={dayjs('2024-01-01T17:00:00').toDate()}  // Hora cierre (17:00 PM)
              formats={{
                  monthHeaderFormat: (date) => {
                      return dayjs(date)
                          .format("MMMM - YYYY")
                          .replace(/^./, (match) => match.toUpperCase());  // Capitaliza el primer carácter
                  },
                  // weekHeaderFormat: (date) => {
                  //     return dayjs(date)
                  //         .format("dddd - DD/MM/YY")
                  //         .replace(/^./, (match) => match.toUpperCase());  // Capitaliza el primer carácter
                  // },
                  dayHeaderFormat: date => {
                      return dayjs(date).format("dddd - DD/MM/YY").replace(/^./, (match) => match.toUpperCase());
                  },
              }}
              components={components}
            />
          </div>
        </div>
        <div className={popUpOpen ? 'popUp' : 'popUpClosed'} onClick={() => setPopUpOpen(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <NewAppointment onClientAdded={() => setPopUpOpen(false)}/>
            </div>
          </div>
      </div>
  );
};

export default Appointments;