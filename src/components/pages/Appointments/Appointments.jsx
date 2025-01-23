import style from './Appointments.module.css';
import React, { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import iconMechanic from './icons/mechanic.png';
import iconService from './icons/service.png';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import NewAppointment from './NewAppointment/NewAppointment.jsx';

dayjs.locale('es');

const Appointments = () => {

    const navigate = useNavigate();

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
        vehicle: `${appointment.vehicle?.licensePlate || ''}`, 
    }));  

    const MonthEvent = (props) => {
        const { _id, procedureIconMechanic, procedureIconService, vehicle } = props.event;

        return (
            <div onClick={() => navigate(`/main_window/turnos/${_id}`)}>
                <div className={style.containerEvents}>
                    <div className={style.icons}>
                        {procedureIconMechanic && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                        {procedureIconService && <img src={iconService} alt="service-icon" className={style.icon} />}
                    </div>
                    <div className={style.licensePlate}>{vehicle}</div>
                </div>
            </div>
            )
    };

    const WeekEvent = (props) => {
        const { _id, start, end, procedureTitle, personClient, companyClient, procedureIconMechanic, procedureIconService, vehicle } = props.event;

        return (
            <div onClick={() => navigate(`/main_window/turnos/${_id}`)}>
                <div className={style.containerEvents}>
                    <div className={style.icons}>
                        {procedureIconMechanic && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                        {procedureIconService && <img src={iconService} alt="service-icon" className={style.icon} />}
                    </div>
                    <div className={style.licensePlate}>{vehicle}</div>
                </div>
            </div>
        )
    }

    const components = {
        month: {
            event: MonthEvent, // Componente para la vista mensual
        },
        week: {
            event: MonthEvent, // Componente para la vista semanal
        },
        day: {
            event: MonthEvent, // Componente para la vista diaria
        },
        agenda: {
            event: MonthEvent, // Componente para la vista de agenda
        },
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
                <NewAppointment onAppointmentAdded={() => setPopUpOpen(false)}/>
            </div>
            </div>
        </div>
    );
};

export default Appointments;