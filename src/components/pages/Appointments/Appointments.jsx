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
        startTime: appointment.start
            ? new Date(
                new Date(appointment.start).getTime() - 3 * 60 * 60 * 1000
            ).toISOString().substring(11, 16)
            : '',
        endTime: appointment.end
            ? new Date(
                new Date(appointment.end).getTime() - 3 * 60 * 60 * 1000
            ).toISOString().substring(11, 16)
            : '',
        procedureIconMechanic: appointment.procedure ? appointment.procedure.mechanical : '',
        procedureIconService: appointment.procedure ? appointment.procedure.service : '',
        procedureTitle: appointment.procedure ? appointment.procedure.title : '',
        personClient: appointment.personClient ? appointment.personClient.name : '',  
        companyClient: appointment.companyClient ? appointment.companyClient.name : '',  
        vehicleLicensePlate: `${appointment.vehicle?.licensePlate || ''}`,
        vehicleBrandAndModel: `${appointment.vehicle?.brand || ""} ${appointment.vehicle?.model || ""}`
    }));  

    const MonthEvent = (props) => {
        const { _id, procedureIconMechanic, procedureIconService, vehicleLicensePlate } = props.event;

        return (
            <div onClick={() => navigate(`/main_window/turnos/${_id}`)}>
                <div className={style.containerEventsMonth}>
                    <div className={style.icons}>
                        {procedureIconMechanic && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                        {procedureIconService && <img src={iconService} alt="service-icon" className={style.icon} />}
                    </div>
                    <div className={style.licensePlate}>{vehicleLicensePlate}</div>
                </div>
            </div>
            )
    };

    const WeekEvent = (props) => {
        const { _id, startTime, endTime, personClient, companyClient, procedureIconMechanic, procedureIconService, vehicleLicensePlate, vehicleBrandAndModel } = props.event;

        return (
            <div onClick={() => navigate(`/main_window/turnos/${_id}`)}>
                <div className={style.containerEventsWeek}>
                    <div>{startTime}hs - {endTime}hs</div>
                    <div className={style.icons}>
                        {procedureIconMechanic && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                        {procedureIconService && <img src={iconService} alt="service-icon" className={style.icon} />}
                    </div>
                    {personClient && <div className={style.licensePlate}>{personClient}</div>}
                    {companyClient && <div className={style.licensePlate}>{companyClient}</div>}
                    {vehicleLicensePlate && <div className={style.licensePlate}>{vehicleLicensePlate}</div>}
                    {vehicleBrandAndModel && <div className={style.licensePlate}>{vehicleBrandAndModel}</div>}
                </div>
            </div>
        )
    };

    const DayEvent = (props) => {
        const { _id, startTime, endTime, procedureTitle, personClient, companyClient, procedureIconMechanic, procedureIconService, vehicleLicensePlate, vehicleBrandAndModel } = props.event;

        return (
            <div onClick={() => navigate(`/main_window/turnos/${_id}`)}>
                <div className={style.containerEventsDay}>
                    <div>Desde {startTime}hs hasta {endTime}hs</div>
                    <div className={style.icons}>
                        {procedureIconMechanic && <p><img src={iconMechanic} alt="mechanic-icon" className={style.icon} /> <span>Mecánica</span></p>}
                        {procedureIconService && <p><img src={iconService} alt="service-icon" className={style.icon} /> <span>Service</span></p>}
                    </div>
                    {personClient && <div className={style.licensePlate}>Cliente: {personClient}</div>}
                    {companyClient && <div className={style.licensePlate}>Cliente: {companyClient}</div>}
                    {vehicleLicensePlate && <div className={style.licensePlate}>Vehículo:</div>}
                    {vehicleLicensePlate && <div className={style.licensePlate}>{vehicleLicensePlate}</div>}
                    {vehicleBrandAndModel && <div className={style.licensePlate}>{vehicleBrandAndModel}</div>}
                    {procedureTitle && <div className={style.licensePlate}>Título: {procedureTitle}</div>}
                </div>
            </div>
        )
    }

    const AgendaEvent = (props) => {
        const { _id, procedureTitle, personClient, companyClient, procedureIconMechanic, procedureIconService, vehicleLicensePlate, vehicleBrandAndModel } = props.event;

        return (
            <div onClick={() => navigate(`/main_window/turnos/${_id}`)}>
                <div className={style.containerEventsAgenda}>
                    <div className={style.icons}>
                        {procedureIconMechanic && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                        {procedureIconService && <img src={iconService} alt="service-icon" className={style.icon} />}
                    </div>
                    -
                    {personClient && <div className={style.licensePlate}>{personClient}</div>}
                    {companyClient && <div className={style.licensePlate}>{companyClient}</div>}
                    -
                    {vehicleLicensePlate && <div className={style.licensePlate}>{vehicleLicensePlate}</div>}
                    -
                    {vehicleBrandAndModel && <div className={style.licensePlate}>{vehicleBrandAndModel}</div>}
                    -
                    {procedureTitle && <div className={style.licensePlate}>{procedureTitle}</div>}
                </div>
            </div>
        )
    }


    const components = {
        month: {
            event: MonthEvent, // Componente para la vista mensual
        },
        week: {
            event: WeekEvent, // Componente para la vista semanal
        },
        day: {
            event: DayEvent, // Componente para la vista diaria
        },
        agenda: {
            event: AgendaEvent, // Componente para la vista de agenda
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