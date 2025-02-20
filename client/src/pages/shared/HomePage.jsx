import React from 'react'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {

  const navigate=useNavigate();

  return (
    <div className="hero bg-transparent min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
          <div className="space-x-4">
            <button className="btn btn-primary mr-4" onClick={()=> navigate("/user/login")}>Join as User</button>
            <button className="btn btn-secondary" onClick={()=> navigate("/trainer/login")}>Join as Trainer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
