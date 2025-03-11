import React from 'react'
import { WorkoutCard } from '../../components/user/WorkoutCard';
import { useSelector } from 'react-redux';

export const WorkoutListPage = () => {

    const todayWorkoutData = useSelector((state) => state.user.todayWorkoutData)
    const tomorrowWorkoutData = useSelector((state) => state.user.tomorrowWorkoutData);


  return (
    <div className="p-4">
         {/* Today's  */}
         <h2 className="text-2xl font-bold mb-3">Today's Workout</h2>
         {todayWorkoutData ? (
           <WorkoutCard workout={todayWorkoutData} />
         ) : (
           <p>No Workout available for today.</p>
         )}
   
         {/* Tomorrow's  */}
         <h2 className="text-2xl font-bold mt-6 mb-3">Prepare for Tomorrow</h2>
         {tomorrowWorkoutData? (
           <WorkoutCard workout={tomorrowWorkoutData} />
         ) : (
           <p>No Workout available for tomorrow.</p>
         )}
       </div>
  )
}
