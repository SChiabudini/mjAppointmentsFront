import "react-big-calendar/lib/css/react-big-calendar.css";
import style from './Home.module.css';
import iconMechanic from './Icons/mechanic.png';
import iconService from './Icons/service.png';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const Home = () => {

    const localizer = dayjsLocalizer(dayjs);

    const appointments = useSelector(state => state.appointment.appointments);
    // console.log(appointments);

    const events = appointments?.map(appointment => ({
        start: dayjs(appointment.start).toDate(),
        end: dayjs(appointment.end).toDate(),
        title: appointment.procedure,  
        personClient: appointment.personClient.name,  
        vehicle: `${appointment.vehicle.brand} ${appointment.vehicle.model}`, 
        mechanical: appointment.mechanical,  
        service: appointment.service,  
    }));

    const components = {
        event: props => {            
            // console.log(props);         
            // Destructuración de los valores de props.event: 
            const { mechanical, service, personClient, vehicle, title } = props.event;  

            return (
                <div className={style.containerEvents}>
                    <div>
                        <span>
                            {mechanical && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                            {service && <img src={iconService} alt="service-icon" className={style.icon} />}
                        </span>
                    </div>
                    <div>
                        <span>{personClient}</span>
                    </div>
                    <div>
                        <span>{title}</span>
                    </div>
                    <div>
                        <span>{vehicle}</span>
                    </div>
                </div>
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

  return (
    <div className={style.container}>
        <Calendar 
            localizer={localizer}
            messages={messages}
            events={events}
            min={dayjs('2024-01-01T08:00:00').toDate()}  // Hora mínima (08:00 AM)
            max={dayjs('2024-01-01T18:00:00').toDate()}  // Hora máxima (06:00 PM)
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
  )
}

export default Home;