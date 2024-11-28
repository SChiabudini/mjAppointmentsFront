import style from './FormAppointment.module.css';
import React, { useState, useEffect } from 'react';
import { getAppointments } from '../../../redux/appointmentActions';
import { useDispatch, useSelector } from 'react-redux';

const FormAppointment = ({ onCategoryAdded, onClose, actionType  }) => {
    
    const dispatch = useDispatch();
    const appointments = useSelector(state => state.appointment.appointments);

    const initialAppointmentState = {
        date: '',
        time: '',
        personClient: {},
        companyClient: {},
        vehicle: {},
        procedure: ''
      };

    const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
    // const [deleteCategory, setDeleteCategory] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    // console.log(deleteCategory);

    useEffect(() => {
        // validateForm();
    }, [newAppointment]);

    // const validateForm = () => {
    //     const isCategoryNameValid = newAppointment.name.trim() !== '';
    //     const isDeleteCategoryValid = deleteCategory !== '';
        
    //     if(actionType === 'create') {
    //         setIsSubmitDisabled(!isCategoryNameValid);
    //     } else if(actionType === 'delete') {
    //         setIsSubmitDisabled(!isDeleteCategoryValid);
    //     };
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

    // const handleDeleteCategoryChange = (event) => {
    //     setDeleteCategory(event.target.value);
    //     setErrorMessage('');
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
        <div className="component">
            <div className={style.titleForm}>
                <h2 className={actionType === 'create' ? '' : style.titleDeleteForm}>{actionType === 'create' ? 'NUEVA TURNO' : 'ELIMINAR TURNO'}</h2>
                <button className={style.buttonOnClose} type='button' onClick={onClose}>X</button>
            </div>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    {actionType === 'create' && (
                        <>
                            <label htmlFor="name" className={style.nameTitle}>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={newAppointment.name}
                                onChange={handleInputChange}
                                className={style.inputName}
                            />
                        </>
                    )}                    
                    {/* {actionType === 'delete' && (
                        <>
                            <label htmlFor="category" className={style.nameTitle}>Categoría</label>
                            <select name="category" className={style.selectCategory} value={deleteCategory} onChange={handleDeleteCategoryChange}>
                                <option value="" disabled>Seleccionar</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </>
                    )}                 */}
                    {/* {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>} */}
                    <div className={style.containerButton}>
                        <button type="submit" disabled={isSubmitDisabled} className={actionType === 'create' ? '' : 'delete'}>
                            {actionType === 'create' ? 'Agregar' : 'Eliminar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormAppointment;