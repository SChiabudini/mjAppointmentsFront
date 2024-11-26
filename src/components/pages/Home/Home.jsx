import style from './Home.module.css';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const Home = () => {

    const appointment = useSelector(state => state.appointment.appointments);
    // console.log(appointment);
    
    const localizer = dayjsLocalizer(dayjs);

    const events = [
        {
            start: dayjs('2024-11-28T12:00:00').toDate(),
            end: dayjs('2024-11-2915:00:00').toDate(),
            title: appointment[0]?.procedure
        },
        {
            start: dayjs('2024-11-27T12:00:00').toDate(),
            end: dayjs('2024-11-27T15:00:00').toDate(),
            title: 'Evento 1'
        },
        {
            start: dayjs('2024-11-30T12:00:00').toDate(),
            end: dayjs('2024-12-2T15:00:00').toDate(),
            title: 'Evento 2'
        },
        {
            start: dayjs('2024-11-27T16:00:00').toDate(),
            end: dayjs('2024-11-27T18:00:00').toDate(),
            title: 'Evento 3'
        },
        {
            start: dayjs('2024-11-28T08:00:00').toDate(),
            end: dayjs('2024-11-28T15:00:00').toDate(),
            title: 'Evento 4'
        },
        {
            start: dayjs('2024-12-5T12:00:00').toDate(),
            end: dayjs('2024-12-10T15:00:00').toDate(),
            title: 'Evento 5'
        },

    ];

    const components = {
        event: props => {
            return <div className={style.containerEvents}>
                <div>
                    <span>Hola</span>
                </div>
                <div>
                    {props.title}
                </div>
            </div>
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