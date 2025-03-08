import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TrainerCard } from '../../components/admin/TrainerCard';
export const PendingTrainers = () => {
  const [pendingTrainers, setPendingTrainers] = useState([]);
  
  const allTrainers = useSelector((state) => state.admin.trainers);

  useEffect(() => {
    const pendingTrainersList = allTrainers.filter(trainer => !trainer.isApproved);
    setPendingTrainers(pendingTrainersList);
  }, [allTrainers]);

  if (pendingTrainers.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">No pending trainer approvals</p>
      </div>
    );
  }

  return (
    <div className="pending-trainers-dashboard">
      <h2 className="text-2xl font-bold mb-4">Pending Trainer Approvals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pendingTrainers.map(trainer => (
          <TrainerCard
            key={trainer._id} 
            trainer={trainer} 
          />
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Total Pending Trainers: {pendingTrainers.length}
      </div>
    </div>
  );
};