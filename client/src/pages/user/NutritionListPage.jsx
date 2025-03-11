import React from 'react'
import { NutritionCard } from '../../components/user/NutritionCard'
import { useSelector } from 'react-redux'

export const NutritionListPage = ()  => {

    const todayNutritionData = useSelector((state) => state.user.todayNutritionData)
    const tomorrowNutritionData = useSelector((state) => state.user.tomorrowNutritionData);

    // console.log("NutritionListPage : ", todayNutritionData);
    

  return (
     <div className="p-4">
      {/* Today's Plan */}
      <h2 className="text-2xl font-bold mb-3">Today's Nutrition Plan</h2>
      {todayNutritionData ? (
        <NutritionCard plan={todayNutritionData} />
      ) : (
        <p>No plan available for today.</p>
      )}

      {/* Tomorrow's Plan */}
      <h2 className="text-2xl font-bold mt-6 mb-3">Prepare for Tomorrow</h2>
      {tomorrowNutritionData? (
        <NutritionCard plan={tomorrowNutritionData} />
      ) : (
        <p>No plan available for tomorrow.</p>
      )}
    </div>
  )
}
