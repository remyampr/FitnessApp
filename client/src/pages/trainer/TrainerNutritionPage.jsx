import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, Edit, Trash2, GlassWater, Dumbbell, Calendar } from 'lucide-react';
import { addNewNutritionPlan } from '../../services/trainerServices';
import { addNutrition } from '../../redux/features/trainerSlice';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { toast } from 'react-toastify';

export const TrainerNutritionPage = () => {
  const dispatch = useDispatch();
  const { nutritionPlans } = useSelector((state) => state.trainer);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    fitnessGoal: '',
    waterIntake: '',
    image: null,
    schedule: [
      {
        day: 'Monday',
        meals: [
          { 
            type: 'breakfast', 
            foods: [
              { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
            ] 
          },
          { 
            type: 'lunch', 
            foods: [
              { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
            ] 
          },
          { 
            type: 'snack', 
            foods: [
              { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
            ] 
          },
          { 
            type: 'dinner', 
            foods: [
              { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
            ] 
          }
        ]
      }
    ]
  });


// console.log("NutritionPage from redux nutrition : ",nutritionPlans);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFoodChange = (dayIndex, mealIndex, foodIndex, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].meals[mealIndex].foods[foodIndex][field] = field === 'name' ? value : Number(value);
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleMealTypeChange = (dayIndex, mealIndex, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].meals[mealIndex].type = value;
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addDay = () => {
    const days = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ];
    
    const currentDays = formData.schedule.map(s => s.day);
    const availableDays = days.filter(day => !currentDays.includes(day));
    
    if (availableDays.length === 0) return;
    
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        {
          day: availableDays[0],
          meals: [
            { 
              type: 'breakfast', 
              foods: [
                { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
              ] 
            },
            { 
              type: 'lunch', 
              foods: [
                { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
              ] 
            },
            { 
              type: 'snack', 
              foods: [
                { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
              ] 
            },
            { 
              type: 'dinner', 
              foods: [
                { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
              ] 
            }
          ]
        }
      ]
    });
  };


  const handleDayChange = (dayIndex, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].day = value;
    setFormData({ ...formData, schedule: updatedSchedule });
    // console.log(formData);
    
  };



  const addFood = (dayIndex, mealIndex) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[dayIndex].meals[mealIndex].foods.push(
      { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
    setFormData({ ...formData, schedule: updatedSchedule });
  };



  const calculateMealMacros = (foods) => {
    return foods.reduce((totals, food) => {
      return {
        calories: totals.calories + (food.calories || 0),
        protein: totals.protein + (food.protein || 0),
        carbs: totals.carbs + (food.carbs || 0),
        fats: totals.fats + (food.fats || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.fitnessGoal || !formData.waterIntake || !formData.schedule.length) {
        toast("Please fill all required fields!")
        setIsLoading(false);
        return;
      }
    

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('fitnessGoal', formData.fitnessGoal);
      formDataToSend.append('waterIntake', formData.waterIntake);
      formDataToSend.append('schedule', JSON.stringify(formData.schedule));
      // console.log("type ",typeof(formData.schedule));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await addNewNutritionPlan(formDataToSend);
      // console.log("Addnutrition response : ",response);
      
      dispatch(addNutrition(response.data.savedNutrition))
      
      // Reset form and hide it
      setFormData({
        title: '',
        fitnessGoal: '',
        waterIntake: '',
        image: null,
        schedule: [
          {
            day: 'Monday',
            meals: [
              { 
                type: 'breakfast', 
                foods: [
                  { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
                ] 
              },
              { 
                type: 'lunch', 
                foods: [
                  { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
                ] 
              },
              { 
                type: 'snack', 
                foods: [
                  { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
                ] 
              },
              { 
                type: 'dinner', 
                foods: [
                  { name: '', quantity: 1, calories: 0, protein: 0, carbs: 0, fats: 0 }
                ] 
              }
            ]
          }
        ]
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Nutrition Plans</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary btn-sm md:btn-md"
        >
          {showForm ? 'Cancel' : <><PlusCircle className="mr-2 size-4" /> Add New Plan</>}
        </button>
      </div>

      {/* New Nutrition Plan Form */}
      {showForm && (
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-primary mb-4">Create New Nutrition Plan</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Plan Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fitness Goal</span>
                  </label>
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select a goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Weight Gain">Weight Gain</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Endurance Improvement">Endurance Improvement</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Daily Water Intake (ml)</span>
                  </label>
                  <input
                    type="number"
                    name="waterIntake"
                    value={formData.waterIntake}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Cover Image</span>
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="file-input file-input-bordered w-full"
                  />
                </div>
              </div>
              
              <div className="divider">Meal Schedule</div>
              
              {formData.schedule.map((day, dayIndex) => (
                <div key={dayIndex} className="card bg-base-100 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{day.day}</h3>
                      <div className="form-control">
                      <select 
                        value={day.day} 
                        onChange={(e) => handleDayChange(dayIndex, e.target.value)} 
                        className="select select-bordered"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    </div>
                    
                    {day.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="border rounded-lg p-3 mt-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={meal.type}
                              onChange={(e) => handleMealTypeChange(dayIndex, mealIndex, e.target.value)}
                              className="select select-sm select-bordered"
                              required
                            >
                              <option value="breakfast">Breakfast</option>
                              <option value="lunch">Lunch</option>
                              <option value="dinner">Dinner</option>
                              <option value="snack">Snack</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => addFood(dayIndex, mealIndex)}
                              className="btn btn-xs btn-primary"
                            >
                              Add Food
                            </button>
                          </div>
                         
                        </div>
                        
                        {meal.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="grid grid-cols-1 md:grid-cols-7 gap-2 mt-2 items-end">
                            <div className="form-control md:col-span-2">
                              <label className="label py-0">
                                <span className="label-text text-xs">Food Name</span>
                              </label>
                              <input
                                type="text"
                                value={food.name}
                                onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'name', e.target.value)}
                                className="input input-bordered input-sm"
                                required
                              />
                            </div>
                            
                            <div className="form-control">
                              <label className="label py-0">
                                <span className="label-text text-xs">Quantity</span>
                              </label>
                              <input
                                type="number"
                                value={food.quantity}
                                onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'quantity', e.target.value)}
                                className="input input-bordered input-sm"
                                required
                              />
                            </div>
                            
                            <div className="form-control">
                              <label className="label py-0">
                                <span className="label-text text-xs">Calories</span>
                              </label>
                              <input
                                type="number"
                                value={food.calories}
                                onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'calories', e.target.value)}
                                className="input input-bordered input-sm"
                                required
                              />
                            </div>
                            
                            <div className="form-control">
                              <label className="label py-0">
                                <span className="label-text text-xs">Protein (g)</span>
                              </label>
                              <input
                                type="number"
                                value={food.protein}
                                onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'protein', e.target.value)}
                                className="input input-bordered input-sm"
                                required
                              />
                            </div>
                            
                            <div className="form-control">
                              <label className="label py-0">
                                <span className="label-text text-xs">Carbs (g)</span>
                              </label>
                              <input
                                type="number"
                                value={food.carbs}
                                onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'carbs', e.target.value)}
                                className="input input-bordered input-sm"
                                required
                              />
                            </div>
                            
                            <div className="form-control">
                              <label className="label py-0">
                                <span className="label-text text-xs">Fats (g)</span>
                              </label>
                              <input
                                type="number"
                                value={food.fats}
                                onChange={(e) => handleFoodChange(dayIndex, mealIndex, foodIndex, 'fats', e.target.value)}
                                className="input input-bordered input-sm"
                                required
                              />
                            </div>
                            
                            {meal.foods.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFood(dayIndex, mealIndex, foodIndex)}
                                className="btn btn-xs btn-ghost text-error md:self-center"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            )}
                          </div>
                        ))}
                        
                        {meal.foods.length > 0 && (
                          <div className="flex justify-end mt-2">
                            <div className="badge badge-sm">
                              {calculateMealMacros(meal.foods).calories} cal | 
                              P: {calculateMealMacros(meal.foods).protein}g | 
                              C: {calculateMealMacros(meal.foods).carbs}g | 
                              F: {calculateMealMacros(meal.foods).fats}g
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center mb-4">
              
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loading loading-spinner"></span> : 'Save Nutrition Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nutrition Plans List */}
      {isLoading && !nutritionPlans?.length ? (
        <LoadingSpinner/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutritionPlans?.data?.length > 0 ? (
            nutritionPlans?.data?.map((plan) => (
              <div key={plan._id} className="card bg-base-100 shadow-xl overflow-hidden h-full">
                <figure className="h-48 relative">
                  <img
                    src={plan.image || '/meal.jpg'}
                    alt={plan.title}
                    className="w-full h-full object-cover"
                  />
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
                            // Calculate total macros for the meal
                            const totalMacros = meal.foods.reduce((acc, food) => {
                              return {
                                calories: acc.calories + food.calories,
                                protein: acc.protein + food.protein,
                                carbs: acc.carbs + food.carbs,
                                fats: acc.fats + food.fats
                              };
                            }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
                            
                            return (
                              <div key={midx} className="text-xs">
                                <span className="font-semibold capitalize">{meal.type}</span>: 
                                <span className="text-gray-700"> 
                                  {meal.foods.map(food => `${food.quantity}x ${food.name}`).join(', ')}
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
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-12 text-center">
              <div className="text-5xl text-gray-400 mb-4">
                <Dumbbell size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">No Nutrition Plans Yet</h3>
              <p className="text-gray-500 mb-4">Create your first nutrition plan to help your clients achieve their fitness goals.</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <PlusCircle className="mr-2 size-4" /> Create First Plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};