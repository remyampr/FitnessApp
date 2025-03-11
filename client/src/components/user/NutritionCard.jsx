import { GlassWater } from "lucide-react";

export const NutritionCard = ({ plan }) => {
    return (
      <div key={plan.id} className="card bg-base-100 shadow-xl overflow-hidden h-full">
        <figure className="h-48 relative">
          <img src={plan.image || "/meal.jpg"} alt={plan.title} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/70 to-transparent">
            <div className="badge badge-primary">{plan.fitnessGoal}</div>
          </div>
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-lg">{plan.title}</h2>
  
          <div className="flex items-center text-sm mt-1">
            <GlassWater className="text-blue-500 mr-2 size-4" />
            <span>{plan.waterIntake} ml/day</span>
          </div>
  
          <div className="divider my-2">Schedule</div>
  
          <div className="overflow-y-auto max-h-48 pr-2">
            {plan.schedule.map((day, idx) => (
              <div key={idx} className="mb-3">
                <h4 className="font-bold text-sm">{day.day}</h4>
                <div className="grid grid-cols-1 gap-1 pl-2 mt-1">
                  {day.meals.map((meal, midx) => {
                    const totalMacros = meal.foods.reduce(
                      (acc, food) => ({
                        calories: acc.calories + food.calories,
                        protein: acc.protein + food.protein,
                        carbs: acc.carbs + food.carbs,
                        fats: acc.fats + food.fats,
                      }),
                      { calories: 0, protein: 0, carbs: 0, fats: 0 }
                    );
  
                    return (
                      <div key={midx} className="text-xs">
                        <span className="font-semibold capitalize">{meal.type}</span>:
                        <span className="text-gray-700"> 
                          {meal.foods.map((food) => `${food.quantity}x ${food.name}`).join(", ")}
                        </span>
                        <div className="text-gray-500 text-xs">
                          {totalMacros.calories} cal | P: {totalMacros.protein}g | C: {totalMacros.carbs}g | F: {totalMacros.fats}g
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  