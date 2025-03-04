import React from 'react'

export const PlaneSelectionCard = () => {
  return (
<>

<div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">Complete Payment</h2>
      <div className="p-4">
        <h3 className="font-semibold mb-4">Subscription Details</h3>
        <div className="bg-base-200 p-4 rounded-lg">
          <p className="mb-2">
            Selected Trainer:{" "}
            {trainers.find((t) => t._id === formData.trainerId)?.name}
          </p>
          <p className="mb-2">
            Subscription Period:{" "}
            {formData.duration === "6month" ? "6 Months" : "3 Months"}
          </p>
          <p className="text-xl font-bold">
            Total: ₹
            {formData.plan === "premium"
              ? formData.duration === "3month"
                ? 4999
                : 8999
              : formData.duration === "3month"
              ? 1999
              : 3599}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {/* <div>
            <label className="label">Payment Method</label>
            <select
              className="select select-bordered w-full"
              value={formData.paymentType}
              onChange={(e) => setFormData((prev) => ({ 
                ...prev, 
                paymentType: e.target.value 
              }))}

            >
               <option value="">Select Payment Method</option>
      <option value="Credit Card">Credit Card</option>
      <option value="Debit Card">Debit Card</option>
      <option value="UPI">UPI</option>
      <option value="Net Banking">Net Banking</option>
      <option value="Wallet">Wallet</option>
            </select>
          </div> */}

          {/* Subscription Plan Selection */}
          <div>
            <label className="label">Subscription Plan</label>
            <select
              className="select select-bordered w-full"
              value={formData.plan}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  plan: e.target.value,
                }))
              }
            >
              <option value="">Select Plan</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          {/* Subscription Duration Selection */}
          <div>
            <label className="label">Subscription Duration</label>
            <select
              className="select select-bordered w-full"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
            >
              <option value="">Select Duration</option>
              <option value="3month">3 Months</option>
              <option value="6month">6 Months</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary w-full mt-6"
          onClick={handlePayment}
        >
          Process Payment
        </button>
      </div>
    </div>
  </div>














  <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Complete Payment</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Subscription Details</h3>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Selected Trainer:</span>
                  <span className="font-medium">
                    {trainers.find((t) => t._id === formData.trainerId)?.name || "Not selected"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Subscription Period:</span>
                  <span className="font-medium">
                    {formData.duration === "6month" ? "6 Months" : formData.duration === "3month" ? "3 Months" : "Not selected"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-800 font-semibold">Total:</span>
                  <span className="text-xl font-bold text-blue-700">
                    ₹{formData.plan === "premium"
                        ? formData.duration === "3month"
                          ? 4999
                          : 8999
                        : formData.duration === "3month"
                        ? 1999
                        : 3599 || "—"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              {/* Subscription Plan Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Subscription Plan</label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-blue-400 px-4 py-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-colors duration-200"
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        plan: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Plan</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Subscription Duration Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Subscription Duration</label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-blue-400 px-4 py-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-colors duration-200"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Duration</option>
                    <option value="3month">3 Months</option>
                    <option value="6month">6 Months</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg mt-6 transition-colors duration-300 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              onClick={handlePayment}
            >
              Process Payment
            </button>
          </div>
        </div>


</>
  )
}
