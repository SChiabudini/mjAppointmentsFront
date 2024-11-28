import style from './FormAppointment.module.css';
import React, { useState, useEffect } from 'react';
import { postAppointment } from '../../../redux/appointmentActions';
import { useDispatch, useSelector } from 'react-redux';

const FormAppointment = ({ onClose }) => {
    
    const dispatch = useDispatch();

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
    // const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        // validateForm();
    }, [newAppointment]);

    // const validateForm = () => {
    //     const isCategoryNameValid = newAppointment.name.trim() !== '';
    //     const isDeleteCategoryValid = deleteCategory !== '';
    // };

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
                        <label htmlFor="date">Fecha</label>
                        <input type="text" name="start" value={newAppointment.start}/>
                    </div>
                    <div>
                        <label htmlFor="date">Finalizacion</label>
                        <input type="text" name="end" value={newAppointment.end}/>
                    </div>
                    <div>
                        <label htmlFor="time">Horario</label>
                        <input type="text" name="time" />
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
                        <button type='button'>Crear</button>
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
        </div>
    );
};

export default FormAppointment;