import style from './FormAppointment.module.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewCompanyClient from '../Clients/CompanyClient/NewCompanyClient/NewCompanyClient.jsx';
import NewVehicle from '../Vehicles/NewVehicle/NewVehicle.jsx';
import NewPersonClient from '../Clients/PersonClient/NewPersonClient/NewPersonClient.jsx';
import { postAppointment } from '../../../redux/appointmentActions.js';

const FormAppointment = ({ onClose }) => {
    
    const dispatch = useDispatch();

    const appointments = useSelector(state => state.appointment.appointments);
    // console.log(appointments);    

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

    const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
    const [selectedOptionClient, setSelectedOptionClient] = useState(null);
    const [showCompanyClientPopup, setShowCompanyClientPopup] = useState(false);
    const [showPersonClientPopup, setShowPersonClientPopup] = useState(false);
    const [showVehiclePopup, setShowVehiclePopup] = useState(false);
    // const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
// console.log(selectedOptionClient);

    useEffect(() => {
        // validateForm();
    }, [newAppointment]);

    // const validateForm = () => {
    //     const isCategoryNameValid = newAppointment.name.trim() !== '';
    //     const isDeleteCategoryValid = deleteCategory !== '';
    // };

    // Función para convertir una fecha en formato ISO 8601
    const convertToISODate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toISOString();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        // if (event.target.value) {
        //     setIsClearDisabled(false);
        // }
    
        if (name === 'start' || name === 'end') {
            // Convertir la fecha a formato ISO 8601
            setNewAppointment({
                ...newAppointment,
                [name]: convertToISODate(value)
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

    //-----------CLIENT-----------//
    // const handleCheckboxChange = (option) => {
    //     setSelectedOptionClient(!option === selectedOptionClient ? 'personClient' : option);
    // };

    const handleCheckboxChange = (option) => {
        setSelectedOptionClient(option);
    };

    const handleCreateClient = () => {
        if (selectedOptionClient === 'companyClient') {
            setShowCompanyClientPopup(true);
            setShowPersonClientPopup(false);
        } else if (selectedOptionClient === 'personClient') {
            setShowPersonClientPopup(true);
            setShowCompanyClientPopup(false);
        } else {
            setShowCompanyClientPopup(false);
            setShowPersonClientPopup(false);
        }
    };

    const personClients = appointments.filter(appointment => appointment.personClient)?.map(appointment => appointment.personClient);

    // const companyClients = appointments.filter(appointment => appointment.companyClient)?.map(appointment => appointment.companyClient); 
    // console.log(companyClients);
    

    //-----------VEHICLE-----------//
    const handleCreateVehicle = () => {
        setShowVehiclePopup(true);
    };

    // const handleCheckboxChange = (option) => {
    //     setSelectedOptionClient(option);
        
    //     if (option === 'companyClient') {
    //         // Si se selecciona 'companyClient', mostramos el pop-up de NewCompanyClient
    //         setShowCompanyClientPopup(true);
    //         setShowPersonClientPopup(false); // Aseguramos que el pop-up de persona no se muestre
    //     } else if (option === 'personClient') {
    //         setShowPersonClientPopup(true);
    //         setShowCompanyClientPopup(false); // Aseguramos que el pop-up de empresa no se muestre
    //     } else {
    //         setShowCompanyClientPopup(false);
    //         setShowPersonClientPopup(false); // Si no hay opción seleccionada, no mostramos pop-ups
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const appointmentData = {
          start: newAppointment.start,
          end: newAppointment.end, 
          personClient: newAppointment.personClient,
          companyClient: newAppointment.companyClient,
          vehicle: newAppointment.vehicle,
          mechanical: newAppointment.mechanical,
          service: newAppointment.service,
          procedure: newAppointment.procedure,
        };
    
        try {
            // Enviar la petición como un objeto JSON
            const response = await dispatch(postAppointment(appointmentData));
    
            if (response.data) {
                console.log("Appointment successfully saved");
                setNewAppointment(initialAppointmentState); // Resetear el formulario
                // navigate('/main_window/turnos/success/post');
            };

        } catch (error) {
            console.error("Error saving appoiment:", error);
        };
    };

    return (
        <div className="component">
            <div className={style.titleForm}>
                <h2>NUEVA TURNO</h2>
                <button className={style.buttonOnClose} type='button' onClick={onClose}>X</button>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div>
                    {/* <div className={style.containerMessage}>
                        <label className={style.mensagge}>Los campos con (*) son obligatorios</label>
                    </div> */}
                    <div>
                        <label htmlFor="start">Fecha de inicio</label>
                        <input 
                            type="datetime-local" 
                            name="start" 
                            value={newAppointment.start ? new Date(newAppointment.start).toISOString().slice(0, 16) : ''} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div>
                        <label htmlFor="end">Fecha de finalización</label>
                        <input 
                            type="datetime-local" 
                            name="end" 
                            value={newAppointment.end ? new Date(newAppointment.end).toISOString().slice(0, 16) : ''} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div>
                        <label>Cliente</label>
                        <label htmlFor="personClient">Persona</label>
                        <input type="checkbox" name="personClient" id="personClient" checked={selectedOptionClient === 'personClient'} onChange={() => handleCheckboxChange('personClient')} />
                        <label htmlFor="companyClient">Empresa</label>
                        <input type="checkbox" name="companyClient" id="companyClient" checked={selectedOptionClient === 'companyClient'} onChange={() => handleCheckboxChange('companyClient')} />
                        <select name="personClient" value={newAppointment.personClient}>
                            <option value="" disabled>Seleccionar</option>
                            {personClients?.map(client => ( 
                                <option key={client._id} value={client._id}>{client.name}</option>
                            ))}
                        </select>
                        <select name="companyClient" value={newAppointment.companyClient}>
                            <option value="" disabled>Seleccionar</option>
                            {/* {companyClients?.map(company => ( 
                                <option key={company._id} value={company._id}>{company.name}</option>
                            ))} */}
                        </select>
                        <div>
                            <button type="button" onClick={handleCreateClient}>Crear</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="vehicle">Vehículo:</label>
                        <select name="vehicle" value={newAppointment.vehicle}>
                        <option value="" disabled>Seleccionar</option>
                        </select>
                        <div>
                            <button type="button" onClick={handleCreateVehicle}>Crear</button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="procedure">Procedimiento</label>
                        <textarea type="text" name="procedure" value={newAppointment.procedure} />
                    </div> 
                    </div>
                    {/* {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>} */}
                    <div className={style.containerButton}>
                        <button type="submit" disabled={isSubmitDisabled}>Crear turno</button>
                    </div>
                </form>
            </div>
            {showPersonClientPopup && <NewPersonClient />}
            {showCompanyClientPopup && <NewCompanyClient />}
            {showVehiclePopup && <NewVehicle />}
        </div>
    );
};

export default FormAppointment;