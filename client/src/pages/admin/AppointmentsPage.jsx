

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forceDeleteAppointment, forceUpdateAppointment, getAllAppointments, getAppointmentById } from '../../services/adminServices';
import { deleteAppointmentFromStore, setAppointments, setCurrentAppointment, updateAppointmentInStore } from '../../redux/features/adminSlice';


export const AppointmentsPage = () => {
    const dispatch = useDispatch();
    const { appointments,currentAppointment, loading, error } = useSelector((state) => state.admin);
    const [selectedAppointment, setSelectedAppointment] = useState();

    // Fetch all appointments on component mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getAllAppointments();

                // console.log("Appointment resp : ",response.data);
                // console.log("Appointment  : ",response.data.data);
                
                dispatch(setAppointments(response.data.data));
                console.log("Appointment in store  : ",appointments);

            } catch (err) {
                console.error('Failed to fetch appointments:', err);
            }
        };

        fetchAppointments();
    }, [dispatch]);

    //  view appointment details
    const handleViewAppointment = async (id) => {
        try {
            const response = await getAppointmentById(id);
            // console.log("current Appointment : ",response.data);
            
            
            setSelectedAppointment(response.data.data);
            dispatch(setCurrentAppointment(response.data.data));
            console.log("current Appointment in store: ",currentAppointment);
            // console.log("current Appointment in state: ",selectedAppointment); async so no updating imeadietly so use useEffect to view state
        } catch (err) {
            console.error('Failed to fetch appointment details:', err);
        }
    };

    // for loging appointment in state
    useEffect(() => {
        console.log("Updated current Appointment in state: ", selectedAppointment);
    }, [selectedAppointment]); 

    //  update appointment
    const handleUpdateAppointment = async (updateData) => {
        try {
            const response = await forceUpdateAppointment(selectedAppointment._id, updateData);
            // console.log("response appointment updated : ",response);
            
            dispatch(updateAppointmentInStore(response.data.data));
            setSelectedAppointment(null);
        } catch (err) {
            console.error('Failed to update appointment:', err);
        }
    };

    //  delete appointment
    // const handleDeleteAppointment = async (id) => {
    //     try {
    //         await forceDeleteAppointment(id);
    //         dispatch(deleteAppointmentFromStore(id));
    //         setSelectedAppointment(null);
    //     } catch (err) {
    //         console.error('Failed to delete appointment:', err);
    //     }
    // };

    return (
        <div className="container mx-auto p-6">
        
            <h2 className="text-2xl font-bold mb-6">Appointment Management</h2>

            {loading && (
                <div className="flex justify-center items-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {/* Appointments Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Trainer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments?.map((appointment) => (
                            <tr key={appointment?._id}>
                                <td>{appointment?._id}</td>
                                <td>{appointment.user?.name || "N/A"}</td>
                                <td>{appointment.trainer?.name || "N/A"}</td>
                                <td>{new Date(appointment?.date).toLocaleString()}</td>
                                <td>
                                    <span className={`badge ${
                                        appointment?.status === 'confirmed' ? 'badge-success' :
                                        appointment?.status === 'pending' ? 'badge-warning' :
                                        'badge-error'
                                    }`}>
                                        {appointment?.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleViewAppointment(appointment?._id)}
                                        >
                                            View
                                        </button>
                                        {/* <button 
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDeleteAppointment(appointment?._id)}
                                        >
                                            Delete
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Appointment Details</h3>
                        <div className="py-4">
                            <p>User: {selectedAppointment.user.name}</p>
                            <p>Trainer: {selectedAppointment.trainer.name}</p>
                            <p>Date: {new Date(selectedAppointment.date).toLocaleString()}</p>
                            <p>Status: {selectedAppointment.status}</p>
                        </div>
                        <div className="modal-action">
                            {/* <button 
                                className="btn btn-primary"
                                onClick={() => handleUpdateAppointment({ status: 'Confirmed' })}
                            >
                                Confirm
                            </button> */}
                            <button 
                                className="btn btn-ghost"
                                onClick={() => setSelectedAppointment(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
