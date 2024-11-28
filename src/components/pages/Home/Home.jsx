import "react-big-calendar/lib/css/react-big-calendar.css";
import style from './Home.module.css';
import iconMechanic from './Icons/mechanic.png';
import iconService from './Icons/service.png';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import FormAppointment from "../FormAppointment/FormAppointment.jsx";

dayjs.locale('es');

const Home = () => {

    const initialAppointmentState = {
        start: '',
        end: '',
        personClient: {},
        companyClient: {},
        vehicle: {},
        mechanical: false,
        service: false,
        procedure: ''
    };

    const localizer = dayjsLocalizer(dayjs);

    const appointments = useSelector(state => state.appointment.appointments);
    // console.log(appointments);

    const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true); 
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isClearDisabled, setIsClearDisabled] = useState(true);


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

    //-----------APPOINTMENT-----------//
    const handleShowAppointmentForm = () => {
        setShowAppointmentForm(!showAppointmentForm);
        setIsButtonVisible(false);
    };

    const handleCloseAppointmentForm = () => {
        setShowAppointmentForm(false);
        setIsButtonVisible(true); 
    };

    // const handleAppointmentAdded = (newAppointment) => {
    //     setShowAppointmentForm(false);
        
    //     if(newAppointment !== undefined){
    //         setSelectedCategory({ value: newAppointment._id, label: newAppointment.name });
    //         setNewAppointment((prevNewProduct) => ({
    //             ...prevNewProduct,
    //             category: [newAppointment._id]
    //         }));
    //     };
    //     dispatch(getCategories());
    //     validateForm();
    // };

    const handleSetForm = () => {
        setNewAppointment(initialAppointmentState);
        setIsSubmitDisabled(true);
        setIsClearDisabled(true);
    };

    // const validateForm = () => {
    //     const isProductNameValid = newProduct.name.trim() !== '';
    //     const isColorValid = colors.length > 0;
    //     const isSizeValid = sizes.length > 0;
    //     const isCategoryValid = newProduct.category.length > 0;
    //     const isPriceValid = newProduct.price > 0;

    //     // Validar que al menos una combinación de color y talla tenga stock mayor a 0
    //     const hasAtLeastOneValidStock = combinations.some(combination => {
    //         const color = newProduct.color.find(c => c.colorName === combination.color);
    //         const size = color ? color.size.find(s => s.sizeName === combination.size) : null;
    //         return size ? size.stock > 0 : false;
    //     });

    //     setIsSubmitDisabled(!(isProductNameValid && isColorValid && isSizeValid && isCategoryValid && isPriceValid && hasAtLeastOneValidStock));
    // };

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
        <div className={style.container}>
            <div className={style.calendarContainer}>
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
            {isButtonVisible && (
                <div>
                    <button type='button' onClick={handleShowAppointmentForm}>Crear turno</button>
                </div>
            )}
            <div>
                {showAppointmentForm && <FormAppointment onClose={handleCloseAppointmentForm} />}
            </div>
        </div>
    );
};

export default Home;