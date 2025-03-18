import React from 'react'

export const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-primary text-white p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="animate-pulse h-16 w-16 rounded-full bg-primary-focus flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-warning rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Pending Approval</h2>
          <p className="text-primary-content opacity-80 mt-2">Your trainer application is under review</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">1</span>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-primary rounded"></div>
              <p className="text-sm text-gray-600 mt-1">Application received</p>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">2</span>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-primary rounded"></div>
              <p className="text-sm text-gray-600 mt-1">Under review</p>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold">3</span>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-300 rounded"></div>
              <p className="text-sm text-gray-600 mt-1">Approval pending</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Thank you for your patience! Our admin team is reviewing your application. This typically takes 1-2 business days.</p>
            <button className="btn btn-primary btn-block">Check Status</button>
            <div className="mt-4">
              <button className="btn btn-ghost btn-sm">Contact Support</button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 border-t">
          <div className="flex justify-between">
            <div className="text-sm text-gray-600">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: 2 hours ago
              </span>
            </div>
            <div className="text-sm">
              <span className="text-primary cursor-pointer hover:underline">Refresh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}