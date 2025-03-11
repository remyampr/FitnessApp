
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { User, Calendar, Dumbbell, Apple, ChevronDown, ChevronUp, Activity, FileText, Clock } from 'lucide-react';
import { getClientProgressByid } from '../../services/trainerServices';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { AlertError } from '../../components/shared/AlertError';

export const TrainerClientsPage = () => {
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.trainer);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientProgress, setClientProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts');

  console.log("Getting clients from redux : ",clients);
  
console.log(  "\nclient Progress :",
  JSON.stringify(clientProgress, null, 2)
);


  
  // useEffect(() => {
  //   dispatch(fetchClients());
  // }, [dispatch]);

  const fetchClientProgress = async (clientId) => {
    try {
      setProgressLoading(true);
      
      const response = await getClientProgressByid(clientId);

      console.log("response : ",response);
      
      setClientProgress(response.data.progress);
      setProgressLoading(false);
    } catch (error) {
      console.error('Error fetching client progress:', error);
      setProgressLoading(false);
    }
  };

  const handleClientSelect = (client) => {
    if (selectedClient && selectedClient._id === client._id) {
      setSelectedClient(null);
      setClientProgress(null);
    } else {
      setSelectedClient(client);
      fetchClientProgress(client._id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner/>
  }

  if (error) {
    return <AlertError error={`Error loading clients: ${error}`} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Clients</h1>
        <div className="stats bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Total Clients</div>
            <div className="stat-value">{clients?.length || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {clients && clients.length > 0 ? (
          clients.map((client) => (
            <div key={client?._id} className="card bg-base-100 shadow-xl">
              <div className="card-body p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12">
                        <span className="text-xl">{client.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="card-title">{client.name}</h2>
                      <p className="text-sm opacity-70">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="badge badge-accent">{client.
fitnessGoal || "No goal set"}</div>
                    {selectedClient && selectedClient._id === client._id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {selectedClient && selectedClient._id === client._id && (
                  <div className="mt-6 border-t pt-4">
                    <div className="mb-4">
                      <div className="tabs tabs-boxed">
                        <a 
                          className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
                          onClick={() => setActiveTab('details')}
                        >
                          <User size={16} className="mr-2" /> Client Details
                        </a>
                        <a 
                          className={`tab ${activeTab === 'workouts' ? 'tab-active' : ''}`}
                          onClick={() => setActiveTab('workouts')}
                        >
                          <Dumbbell size={16} className="mr-2" /> Workout Progress
                        </a>
                        <a 
                          className={`tab ${activeTab === 'nutrition' ? 'tab-active' : ''}`}
                          onClick={() => setActiveTab('nutrition')}
                        >
                          <Apple size={16} className="mr-2" /> Nutrition
                        </a>
                      </div>
                    </div>

                    {activeTab === 'details' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="card bg-base-200">
                          <div className="card-body">
                            <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm opacity-70">Age</p>
                                <p>{client.age || "Not set"}</p>
                              </div>
                              <div>
                                <p className="text-sm opacity-70">Gender</p>
                                <p>{client.gender || "Not set"}</p>
                              </div>
                              <div>
                                <p className="text-sm opacity-70">Height</p>
                                <p>{client.height || "Not set"}</p>
                              </div>
                              <div>
                                <p className="text-sm opacity-70">Weight</p>
                                <p>{client.weight || "Not set"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card bg-base-200">
                          <div className="card-body">
                            <h3 className="text-lg font-medium mb-2">Fitness Goals</h3>
                            <div>
                              <p className="text-sm opacity-70">Current Goal</p>
                              <p>{client.fitnessGoal|| "Not set"}</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-70">Target Weight</p>
                              <p>{client.targetWeight || "Not set"}</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-70">Joined On</p>
                              <p>{client.createdAt ? formatDate(client.createdAt) : "Unknown"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'workouts' && (
                      <div>
                        {progressLoading ? (
                          <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-md"></span>
                          </div>
                        ) : clientProgress && clientProgress.workoutDetails && clientProgress.workoutDetails.length > 0 ? (
                          <div>
                            <div className="stats shadow mb-4 w-full">
                              <div className="stat">
                                <div className="stat-figure text-primary">
                                  <Dumbbell size={24} />
                                </div>
                                <div className="stat-title">Workouts</div>
                                <div className="stat-value">{clientProgress.workoutCompleted.length}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-figure text-secondary">
                                  <Clock size={24} />
                                </div>
                                <div className="stat-title">Avg Duration</div>
                                <div className="stat-value">
                                  {clientProgress.workoutDetails.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 
                                   clientProgress.workoutDetails.length} min
                                </div>
                              </div>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="table w-full">
                                <thead>
                                  <tr>
                                    <th>Date</th>
                                    <th>Duration</th>
                                    <th>Exercises</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {clientProgress.workoutDetails.map((workout, index) => (
                                    <tr key={index}>
                                      <td>{formatDate(workout.completedAt)}</td>
                                      <td>{workout.duration} mins</td>
                                      <td>{workout.exercises.length} exercises</td>
                                      <td>
                                        <div className="dropdown dropdown-end">
                                          <label tabIndex={0} className="btn btn-ghost btn-xs">Details</label>
                                          <div tabIndex={0} className="card dropdown-content z-10 shadow bg-base-100 rounded-box w-72">
                                            <div className="card-body">
                                              <h3 className="font-bold text-lg">Workout Details</h3>
                                              <div className="space-y-2">
                                                {workout.exercises.map((exercise, i) => (
                                                  <div key={i} className="p-2 bg-base-200 rounded">
                                                    <p className="font-medium">{exercise.name}</p>
                                                    <p className="text-sm">
                                                      {exercise.sets} sets × {exercise.reps} reps
                                                      {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                                                    </p>
                                                    {exercise.notes && (
                                                      <p className="text-xs italic mt-1">{exercise.notes}</p>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (<AlertError error={"No workout progress data available for this client."}/>
                          
                        )}
                      </div>
                    )}

                    {activeTab === 'nutrition' && (
                      <div>
                        {progressLoading ? (
                       <LoadingSpinner/>
                        ) : clientProgress && clientProgress.nutritionDetails && clientProgress.nutritionDetails.length > 0 ? (
                          <div>
                            <div className="stats shadow mb-4 w-full">
                              <div className="stat">
                                <div className="stat-figure text-primary">
                                  <Apple size={24} />
                                </div>
                                <div className="stat-title">Nutrition Plans</div>
                                <div className="stat-value">{clientProgress.nutritionDetails.length}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-figure text-secondary">
                                  <Activity size={24} />
                                </div>
                                <div className="stat-title">Water Intake</div>
                                <div className="stat-value">
                                  {clientProgress.nutritionDetails[0]?.waterIntake || 0} L
                                </div>
                              </div>
                            </div>

                            <div className="card bg-base-200 mb-4">
                              <div className="card-body">
                                <h3 className="card-title">Latest Nutrition Plan</h3>
                                <div className="space-y-4">
                                  {clientProgress.nutritionDetails[0]?.details?.meals.map((meal, i) => (
                                    <div key={i} className="p-3 bg-base-100 rounded-lg">
                                      <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium capitalize">{meal.type}</h4>
                                        {meal.completed && (
                                          <span className="badge badge-success">Completed</span>
                                        )}
                                      </div>
                                      <div>
                                        {meal.foods.map((food, j) => (
                                          <div key={j} className="flex justify-between items-center text-sm py-1 border-b border-base-300 last:border-0">
                                            <span>{food.name}</span>
                                            <span className="text-xs opacity-70">
                                              {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <AlertError error={"No nutrition progress data available for this client."} />
                        )}
                      </div>
                    )}

                    <div className="card-actions justify-end mt-4">
                      <Link to={`/clients/${client._id}/edit`} className="btn btn-outline btn-primary btn-sm">
                        <FileText size={16} className="mr-2" /> Edit Client
                      </Link>
                      <Link to={`/clients/${client._id}/progress`} className="btn btn-primary btn-sm">
                        <Activity size={16} className="mr-2" /> View Full Progress
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
         <AlertError error={"You don't have any clients yet."} />
        )}
      </div>
    </div>
  );
};

