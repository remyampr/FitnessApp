import React from 'react';

export const ProgressChart = ({ progressData }) => {
  // In a real app, you would use a chart library like Chart.js or Recharts
  // This is a simplified placeholder
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Weight Progress</h3>
        <div className="h-48 bg-base-300 rounded-lg flex items-end p-2">
          {progressData?.weightHistory?.map((entry, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="bg-primary w-4 rounded-t-sm" 
                style={{ height: `${(entry.weight / 100) * 100}%` }} 
              ></div>
              <span className="text-xs mt-1">{new Date(entry.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Workout Completion</h3>
          <div className="radial-progress text-primary" style={{"--value": progressData?.workoutCompletion || 0}}>
            {progressData?.workoutCompletion || 0}%
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">Nutrition Plan Adherence</h3>
          <div className="radial-progress text-accent" style={{"--value": progressData?.nutritionAdherence || 0}}>
            {progressData?.nutritionAdherence || 0}%
          </div>
        </div>
      </div>
    </div>
  );
};
