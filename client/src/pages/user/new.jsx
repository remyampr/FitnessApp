


export const CompleteProfile = () => {



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Fitness Profile</h2>
          
          <form className="space-y-6" onSubmit={handleProfileSubmit}>
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Phone */}
                
                
                {/* Age */}
                <div className="relative">
                  <label htmlFor="age" className="block text-sm font-medium mb-1">
                    Age
                  </label>

                </div>
              </div>
              
              <div className="space-y-4">
                {/* Height */}
             
                
                {/* Weight */}
                <div className="relative">
                  <label htmlFor="weight" className="block text-sm font-medium mb-1">
                    Weight (kg)
                  </label>
                
                </div>
              </div>
            </div>
            
            {/* Gender Selection */}
       
            
            {/* Fitness Goal Selection */}
        
            
            {/* Profile Image */}
          
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Continue to Trainer Selection
              </button>
            </div>
          </form>
        </div>
        );
      case 2:
        // Rest of the component code remains the same
        return (
          <div className="max-w-5xl mx-auto bg-base-100 p-8 rounded-xl shadow-lg">
            {/* Trainer selection content */}
            {/* ... */}
          </div>
        );
      case 3:
        // Rest of the component code remains the same
        return (
          <div className="bg-gray-200 px-2 py-8">
            {/* Payment content */}
            {/* ... */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ul className="steps w-full mb-8">
        <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
          Basic Profile
        </li>
        <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
          Select Trainer
        </li>
        <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
          Payment
        </li>
      </ul>

      {renderStepContent()}
    </div>
  );
};