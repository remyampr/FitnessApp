import React from 'react'


export const LoadingSpinner = ({ size = "lg", color = "primary" }) => {
  return (
    <div className="flex flex-col justify-center items-center h-64 p-4">
      <div className="relative flex items-center justify-center">
        {/* Main spinner */}
        <div className={`loading loading-spinner loading-${size} text-${color}`}></div>
        
        {/* Inner spinner (counter-rotating) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`loading loading-spinner loading-${size === 'lg' ? 'md' : size === 'md' ? 'sm' : 'xs'} text-${color === 'primary' ? 'secondary' : 'primary'}`}></div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
};




// export const LoadingSpinner = () => {
//   return (
//     <div className="flex justify-center items-center h-64">
//             <span className="loading loading-spinner loading-lg text-primary"></span>
//           </div>
//   )
// }
