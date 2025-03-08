import React from 'react'

export const NutritionCard = ({todayNutritionPlan}) => {





  // Handle viewing meal plan
  const handleViewMealPlan = () => {
    navigate("/nutrition/plan")
  };



  return (
    <div className="card bg-green-600 text-white shadow-xl">
    <div className="card-body">
      <h2 className="card-title">Today's Nutrition Plan</h2>
      {todayNutritionPlan ? (
        <>
          <p>
            <img src="/diet.png" alt="meal" />
            <strong>Title:</strong> {todayNutritionPlan.title}
          </p>
          <p>
            <strong>Fitness Goal:</strong> {todayNutritionPlan.fitnessGoal}
          </p>
          <p>
            <strong>Water Intake:</strong> {todayNutritionPlan.waterIntake} liters
          </p>
          <button
                      onClick={handleViewMealPlan}
                      className="btn btn-accent"
                    >
                      Start Now
                    </button>
          
        </>
      ) : (
        <p>No nutrition plan available for today</p>
      )}
    </div>
  </div>
  )
}
