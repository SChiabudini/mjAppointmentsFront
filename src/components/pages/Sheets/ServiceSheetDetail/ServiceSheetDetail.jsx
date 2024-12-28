import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceSheetById } from '../../../../redux/serviceSheetActions.js';

const ServiceSheetDetail = () => {

  	let { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getServiceSheetById(id))
	}, [dispatch, id]);

	const serviceSheetDetail = useSelector(state => state.serviceSheet?.serviceSheetDetail || {});    
	console.log(serviceSheetDetail);

	const [loading, setLoading] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);        
	
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await dispatch(getServiceSheetById(id));
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
    <div>ServiceSheetDetail</div>
  )
};

export default ServiceSheetDetail;