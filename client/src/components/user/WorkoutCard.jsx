import React from 'react'

export const WorkoutCard = ({workout}) => {
  return (
    <div key={workout.id} className="card bg-base-100 shadow-xl overflow-hidden h-full">
    <figure className="h-48 relative">
      <img src={workout.image || "/workout.jpg"} alt={workout.name} className="w-full h-full object-cover object-center" />
      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/70 to-transparent">
        <div className="badge badge-primary">{workout.fitnessGoal}</div>
      </div>
    </figure>
  
    <div className="card-body p-4">
      <h2 className="card-title text-lg">{workout.name}</h2>
      <p className="text-gray-700 text-sm">{workout.description}</p>
  
      <div className="flex justify-between items-center text-sm mt-2">
        <span className="badge badge-outline">{workout.difficulty}</span>
        <span className="text-gray-600">{workout.duration} min</span>
      </div>
  
      <div className="divider my-2">Schedule</div>
  
      <div className="overflow-y-auto max-h-48 pr-2">
        {workout.schedule.map((day, idx) => (
          <div key={idx} className="mb-3">
            <h4 className="font-bold text-sm">{day.day}</h4>
            <div className="grid grid-cols-1 gap-1 pl-2 mt-1">
              {day.exercises.map((exercise, eidx) => (
                <div key={eidx} className="text-xs">
                  <span className="font-semibold capitalize">{exercise.name}</span>: 
                  <span className="text-gray-700">
                    {exercise.sets} sets x {exercise.reps} reps
                  </span>
                  <div className="text-gray-500 text-xs">
                    Rest: {exercise.restTime} sec
                  </div>
                  {exercise.notes && (
                    <p className="text-gray-500 italic text-xs">{exercise.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  )
}
