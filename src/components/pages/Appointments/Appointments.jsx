import style from './Appointments.module.css';
import React, { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import iconMechanic from './icons/mechanic.png';
import iconService from './icons/service.png';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import NewAppointment from './NewAppointment/NewAppointment.jsx';
import { getAllAppointments } from '../../../redux/appointmentActions.js';

dayjs.locale('es');

const Appointments = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showAll, setShowAll] = useState(false);

    //----- ABRIR POPUP
    const [popUpOpen, setPopUpOpen] = useState(false);

    const localizer = dayjsLocalizer(dayjs);

    const appointments = useSelector(state => state.appointment.appointments);
    const allAppointments = useSelector(state => state.appointment.appointmentsAll);

    const events = (showAll ? allAppointments : appointments)?.map(appointment => ({
        _id: appointment._id ? appointment._id : '',
        active: appointment.active,
        start: dayjs(appointment.start).add(3, 'hours').toDate(),
        end: dayjs(appointment.end).add(3, 'hours').toDate(),
        startTime: appointment.start
            ? dayjs(appointment.start).add(3, 'hours').format('HH:mm')
            : '',
        endTime: appointment.end
            ? dayjs(appointment.end).add(3, 'hours').format('HH:mm')
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
        const { _id, active, procedureIconMechanic, procedureIconService, vehicleLicensePlate } = props.event;

        return (
            <div className={`${style.containerEventsMonth} ${!active ? 'disabled' : ''}`} onClick={() => navigate(`/main_window/turnos/${_id}`)}>
                <div className={style.icons}>
                    {procedureIconMechanic && <img src={iconMechanic} alt="mechanic-icon" className={style.icon} />}
                    {procedureIconService && <img src={iconService} alt="service-icon" className={style.icon} />}
                </div>
                <div className={style.licensePlate}>{vehicleLicensePlate}</div>
            </div>
        )
    };

    const WeekEvent = (props) => {
        const { _id, active, startTime, endTime, personClient, companyClient, procedureIconMechanic, procedureIconService, vehicleLicensePlate, vehicleBrandAndModel } = props.event;

        return (
            <div className={`${style.containerEventsWeek} ${!active ? 'disabled' : ''}`} onClick={() => navigate(`/main_window/turnos/${_id}`)}>
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
        )
    }

    const DayEvent = (props) => {
        const { _id, active, startTime, endTime, procedureTitle, personClient, companyClient, procedureIconMechanic, procedureIconService, vehicleLicensePlate, vehicleBrandAndModel } = props.event;

        return (
            <div className={`${style.containerEventsDay} ${!active ? 'disabled' : ''}`} onClick={() => navigate(`/main_window/turnos/${_id}`)}>
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
        )
    }

    const AgendaEvent = (props) => {
        const { _id, active, procedureTitle, personClient, companyClient, procedureIconMechanic, procedureIconService, vehicleLicensePlate, vehicleBrandAndModel } = props.event;

        return (
            <div className={`${style.containerEventsAgenda} ${!active ? 'disabled' : ''}`} onClick={() => navigate(`/main_window/turnos/${_id}`)}>
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

    //----- MOSTRAR TODOS
    
    const handleAll = async () => {
        if(allAppointments?.length === 0){
            dispatch(getAllAppointments());
        }
        setShowAll(!showAll);
    }

    return (
        <div className="page">
        <div className="title">
            <h2>Turnos</h2>
            <div className="titleButtons">
                <label className="showAll">
                    <input
                        type="checkbox"
                        name="showAll"
                        onChange={handleAll}
                    />
                    Mostrar todos
                </label>
                <button onClick={() => setPopUpOpen(true)}>Nuevo</button>
            </div>
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