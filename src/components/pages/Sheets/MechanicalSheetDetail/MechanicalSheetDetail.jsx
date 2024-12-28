import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getMechanicalSheetById } from '../../../../redux/mechanicalSheetActions';

const MechanicalSheetDetail = () => {

  	let { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getMechanicalSheetById(id))
	}, [dispatch, id]);

	const mechanicalSheetDetail = useSelector(state => state.mechanicalSheet?.mechanicalSheetDetail || {});    
	console.log(mechanicalSheetDetail);

	const [loading, setLoading] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);        
	
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await dispatch(getMechanicalSheetById(id));
			setLoading(false);
		};
		fetchData();
	}, [dispatch, id]);

	if (loading) {
		return <div>Cargando...</div>;
	};
	
	const toggleShowDeleteModal = () => {
		setShowDeleteModal(!showDeleteModal);
	};

  return (
    <div>MechanicalSheetDetail</div>
  )
};

export default MechanicalSheetDetail;