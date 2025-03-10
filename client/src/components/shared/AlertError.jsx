import React from 'react'

export const AlertError = ({error}) => {
  return (
    
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
    <div className="alert alert-info shadow-lg max-w-md">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>{error}</span>
    </div>
    </div>
  )
}


{/* <div className="alert alert-error">
<div className="flex-1">
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
  <span>{error}</span>
</div>
</div> */}



