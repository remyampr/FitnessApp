// // DashboardLayout.jsx - Main layout wrapper for all trainer pages
// import React from 'react';
// import Sidebar from './Sidebar';
// import Navbar from './Navbar';

// const DashboardLayout = ({ children }) => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Navbar />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

// // Sidebar.jsx - Navigation sidebar for trainer
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();
  
//   const navItems = [
//     { path: '/trainer/dashboard', label: 'Dashboard', icon: 'dashboard' },
//     { path: '/trainer/clients', label: 'Clients', icon: 'users' },
//     { path: '/trainer/appointments', label: 'Appointments', icon: 'calendar' },
//     { path: '/trainer/workouts', label: 'Workouts', icon: 'dumbbell' },
//     { path: '/trainer/nutrition', label: 'Nutrition Plans', icon: 'utensils' },
//     { path: '/trainer/revenue', label: 'Revenue', icon: 'dollar-sign' },
//     { path: '/trainer/profile', label: 'Profile', icon: 'user' },
//   ];
  
//   return (
//     <div className="hidden md:flex flex-col w-64 bg-base-200 text-base-content">
//       <div className="p-4 border-b border-base-300">
//         <h1 className="text-2xl font-bold">FitTrainer</h1>
//       </div>
//       <nav className="flex-1 overflow-y-auto py-4">
//         <ul className="menu menu-compact p-2 space-y-1">
//           {navItems.map((item) => (
//             <li key={item.path}>
//               <Link
//                 to={item.path}
//                 className={`flex items-center p-2 ${
//                   location.pathname === item.path
//                     ? 'bg-primary text-primary-content'
//                     : 'hover:bg-base-300'
//                 }`}
//               >
//                 <i className={`fa fa-${item.icon} w-5 h-5 mr-2`}></i>
//                 <span>{item.label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// // Dashboard.jsx - Main trainer dashboard page
// import React, { useEffect, useState } from 'react';
// import DashboardLayout from '../components/layout/DashboardLayout';
// import StatsCard from '../components/trainer/dashboard/StatsCard';
// import UpcomingAppointments from '../components/trainer/dashboard/UpcomingAppointments';
// import RevenueChart from '../components/trainer/dashboard/RevenueChart';
// import ClientsOverview from '../components/trainer/dashboard/ClientsOverview';
// import { getTrainerProfile, getTrainerClients, getAppointmentsForTrainer, getTrainerRevenue } from '../services/trainerService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientCount: 0,
    appointmentsToday: 0,
    totalRevenue: 0,
    activeWorkouts: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [revenue, setRevenue] = useState({});
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all required data in parallel
        const [trainerProfile, trainerClients, trainerAppointments, trainerRevenue] = await Promise.all([
          getTrainerProfile(),
          getTrainerClients(),
          getAppointmentsForTrainer(),
          getTrainerRevenue()
        ]);
        
        // Calculate stats
        const appointmentsToday = trainerAppointments.filter(
          app => new Date(app.date).toDateString() === new Date().toDateString()
        ).length;
        
        setStats({
          clientCount: trainerClients.length,
          appointmentsToday,
          totalRevenue: trainerRevenue.totalAmount || 0,
          activeWorkouts: trainerProfile.activeWorkouts || 0
        });
        
        setAppointments(trainerAppointments);
        setClients(trainerClients);
        setRevenue(trainerRevenue);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Trainer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Clients" 
          value={stats.clientCount} 
          icon="users" 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Today's Appointments" 
          value={stats.appointmentsToday} 
          icon="calendar" 
          color="bg-green-500" 
        />
        <StatsCard 
          title="Active Workouts" 
          value={stats.activeWorkouts} 
          icon="dumbbell" 
          color="bg-purple-500" 
        />
        <StatsCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon="dollar-sign" 
          color="bg-amber-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpcomingAppointments appointments={appointments.slice(0, 5)} />
        <RevenueChart revenueData={revenue.monthly || []} />
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Clients Overview</h2>
          <ClientsOverview clients={clients} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

// // Clients.jsx - List of trainer's clients
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import DashboardLayout from '../components/layout/DashboardLayout';
// import { getTrainerClients } from '../services/trainerService';

// const Clients = () => {
//   const [clients, setClients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
  
//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         setLoading(true);
//         const data = await getTrainerClients();
//         setClients(data);
//       } catch (error) {
//         console.error('Error fetching clients:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchClients();
//   }, []);
  
//   const filteredClients = clients.filter(client => 
//     client.name.toLowerCase().includes(search.toLowerCase()) ||
//     client.email.toLowerCase().includes(search.toLowerCase())
//   );
  
//   return (
//     <DashboardLayout>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Clients</h1>
//         <div className="form-control">
//           <input
//             type="text"
//             placeholder="Search clients..."
//             className="input input-bordered w-full max-w-xs"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="flex items-center justify-center h-64">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Status</th>
//                 <th>Workouts</th>
//                 <th>Nutrition Plans</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredClients.map((client) => (
//                 <tr key={client.id}>
//                   <td>
//                     <div className="flex items-center space-x-3">
//                       <div className="avatar">
//                         <div className="mask mask-squircle w-12 h-12">
//                           <img
//                             src={client.avatar || '/avatar-placeholder.png'}
//                             alt={client.name}
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="font-bold">{client.name}</div>
//                         <div className="text-sm opacity-50">Since {new Date(client.joinDate).toLocaleDateString()}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td>{client.email}</td>
//                   <td>
//                     <span className={`badge ${
//                       client.status === 'active' ? 'badge-success' : 'badge-warning'
//                     }`}>
//                       {client.status}
//                     </span>
//                   </td>
//                   <td>{client.workouts?.length || 0}</td>
//                   <td>{client.nutritionPlans?.length || 0}</td>
//                   <td>
//                     <div className="flex space-x-2">
//                       <Link
//                         to={`/trainer/clients/${client.id}`}
//                         className="btn btn-sm btn-primary"
//                       >
//                         View
//                       </Link>
//                       <Link
//                         to={`/trainer/clients/${client.id}/progress`}
//                         className="btn btn-sm btn-outline"
//                       >
//                         Progress
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };

// export default Clients;

// // ClientDetail.jsx - Detailed view for a client with progress tracking
// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import DashboardLayout from '../components/layout/DashboardLayout';
// import ClientProgress from '../components/trainer/clients/ClientProgress';
// import AddProgressNote from '../components/trainer/clients/AddProgressNote';
// import { getTrainerClients, getAllUserProgress, addProgressNote } from '../services/trainerService';

// const ClientDetail = () => {
//   const { clientId } = useParams();
//   const [client, setClient] = useState(null);
//   const [progress, setProgress] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
  
//   useEffect(() => {
//     const fetchClientData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch client data and progress
//         const clients = await getTrainerClients();
//         const clientData = clients.find(c => c.id === clientId);
        
//         if (clientData) {
//           setClient(clientData);
          
//           // Fetch progress data
//           const progressData = await getAllUserProgress(clientId);
//           setProgress(progressData);
//         }
//       } catch (error) {
//         console.error('Error fetching client data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchClientData();
//   }, [clientId]);
  
//   const handleAddProgressNote = async (noteData) => {
//     try {
//       await addProgressNote(clientId, noteData);
      
//       // Refresh progress data
//       const progressData = await getAllUserProgress(clientId);
//       setProgress(progressData);
//     } catch (error) {
//       console.error('Error adding progress note:', error);
//     }
//   };
  
//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-full">
//           <span className="loading loading-spinner loading-lg text-primary"></span>
//         </div>
//       </DashboardLayout>
//     );
//   }
  
//   if (!client) {
//     return (
//       <DashboardLayout>
//         <div className="alert alert-error">
//           <div>
//             <span>Client not found</span>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }
  
//   return (
//     <DashboardLayout>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Client: {client.name}</h1>
//         <div className="flex space-x-2">
//           <Link
//             to={`/trainer/workouts/create?clientId=${client.id}`}
//             className="btn btn-primary"
//           >
//             Create Workout
//           </Link>
//           <Link
//             to={`/trainer/nutrition/create?clientId=${client.id}`}
//             className="btn btn-outline"
//           >
//             Create Nutrition Plan
//           </Link>
//         </div>
//       </div>
      
//       <div className="card bg-base-100 shadow-xl mb-6">
//         <div className="card-body">
//           <div className="flex items-center space-x-4">
//             <div className="avatar">
//               <div className="w-24 rounded-full">
//                 <img src={client.avatar || '/avatar-placeholder.png'} alt={client.name} />
//               </div>
//             </div>
//             <div>
//               <h2 className="card-title">{client.name}</h2>
//               <p>{client.email}</p>
//               <p>Member since: {new Date(client.joinDate).toLocaleDateString()}</p>
//               <div className="mt-2">
//                 <span className={`badge ${
//                   client.status === 'active' ? 'badge-success' : 'badge-warning'
//                 }`}>
//                   {client.status}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="tabs tabs-boxed mb-6">
//         <a 
//           className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('overview')}
//         >
//           Overview
//         </a>
//         <a 
//           className={`tab ${activeTab === 'progress' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('progress')}
//         >
//           Progress
//         </a>
//         <a 
//           className={`tab ${activeTab === 'workouts' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('workouts')}
//         >
//           Workouts
//         </a>
//         <a 
//           className={`tab ${activeTab === 'nutrition' ? 'tab-active' : ''}`}
//           onClick={() => setActiveTab('nutrition')}
//         >
//           Nutrition
//         </a>
//       </div>
      
//       {activeTab === 'overview' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h2 className="card-title">Client Details</h2>
//               <div className="space-y-2">
//                 <p><strong>Age:</strong> {client.age || 'Not specified'}</p>
//                 <p><strong>Goal:</strong> {client.goal || 'Not specified'}</p>
//                 <p><strong>Height:</strong> {client.height || 'Not specified'}</p>
//                 <p><strong>Weight:</strong> {client.weight || 'Not specified'}</p>
//                 <p><strong>Medical Conditions:</strong> {client.medicalConditions || 'None'}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h2 className="card-title">Latest Progress</h2>
//               {progress.length > 0 ? (
//                 <div className="space-y-2">
//                   <p><strong>Date:</strong> {new Date(progress[0].date).toLocaleDateString()}</p>
//                   <p><strong>Weight:</strong> {progress[0].weight || 'Not recorded'}</p>
//                   <p><strong>Note:</strong> {progress[0].note}</p>
//                 </div>
//               ) : (
//                 <p>No progress data recorded yet.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
      
//       {activeTab === 'progress' && (
//         <div className="space-y-6">
//           <AddProgressNote onAddNote={handleAddProgressNote} />
//           <ClientProgress progressData={progress} />
//         </div>
//       )}
      
//       {activeTab === 'workouts' && (
//         <div className="card bg-base-100 shadow-xl">
//           <div className="card-body">
//             <h2 className="card-title">Client Workouts</h2>
//             {client.workouts && client.workouts.length > 0 ? (
//               <table className="table w-full">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Type</th>
//                     <th>Created</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {client.workouts.map((workout) => (
//                     <tr key={workout.id}>
//                       <td>{workout.name}</td>
//                       <td>{workout.type}</td>
//                       <td>{new Date(workout.createdAt).toLocaleDateString()}</td>
//                       <td>
//                         <span className={`badge ${
//                           workout.status === 'active' ? 'badge-success' : 'badge-warning'
//                         }`}>
//                           {workout.status}
//                         </span>
//                       </td>
//                       <td>
//                         <Link
//                           to={`/trainer/workouts/${workout.id}`}
//                           className="btn btn-sm btn-primary"
//                         >
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="alert alert-info">
//                 <div>
//                   <span>No workouts created for this client yet</span>
//                 </div>
//               </div>
//             )}
            
//             <div className="card-actions justify-end mt-4">
//               <Link
//                 to={`/trainer/workouts/create?clientId=${client.id}`}
//                 className="btn btn-primary"
//               >
//                 Create New Workout
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {activeTab === 'nutrition' && (
//         <div className="card bg-base-100 shadow-xl">
//           <div className="card-body">
//             <h2 className="card-title">Client Nutrition Plans</h2>
//             {client.nutritionPlans && client.nutritionPlans.length > 0 ? (
//               <table className="table w-full">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Created</th>
//                     <th>Status</th>
//                     <th>Calories</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {client.nutritionPlans.map((plan) => (
//                     <tr key={plan.id}>
//                       <td>{plan.name}</td>
//                       <td>{new Date(plan.createdAt).toLocaleDateString()}</td>
//                       <td>
//                         <span className={`badge ${
//                           plan.status === 'active' ? 'badge-success' : 'badge-warning'
//                         }`}>
//                           {plan.status}
//                         </span>
//                       </td>
//                       <td>{plan.calories}</td>
//                       <td>
//                         <Link
//                           to={`/trainer/nutrition/${plan.id}`}
//                           className="btn btn-sm btn-primary"
//                         >
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="alert alert-info">
//                 <div>
//                   <span>No nutrition plans created for this client yet</span>
//                 </div>
//               </div>
//             )}
            
//             <div className="card-actions justify-end mt-4">
//               <Link
//                 to={`/trainer/nutrition/create?clientId=${client.id}`}
//                 className="btn btn-primary"
//               >
//                 Create New Nutrition Plan
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };

// export default ClientDetail;