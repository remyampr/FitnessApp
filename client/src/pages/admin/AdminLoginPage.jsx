import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminLogin } from "../../services/adminServices";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../redux/features/adminSlice";

export const AdminLoginPage = () => {

const [values,setValues]=useState({
  email:"",
  password:""
})
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch=useDispatch();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!values.email || !values.password) {
      return setError("Please fill in all fields");
    }
    try {
      setError("");
      setLoading(true);
      
      // console.log("data sending to backend : ",email,password);
      
      const res = await adminLogin({...values,role:"admin"});

      // console.log("Login response admin : ",res);
      
      // console.log("values in state : ",values);
      if (res.status === 200) {
        // console.log("admin login successfull",res.data.user);
        
        dispatch(setAdmin(res.data.user))
        toast.success("Login successful!");
        // console.log("Navigating to /admin/dashboard");
        navigate("/admin/dashboard");
      } else {
        setError("Failed to sign in. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
  
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        toast.error(err.response.data.error);
      } else {
        setError("Failed to sign in. Please try again.");
        toast.error("Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-6">Admin Login</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="admin@example.com" 
                className="input input-bordered" 
                name="email"
                onChange={(e)=>{setValues({...values,[e.target.name]:e.target.value}) }}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="input input-bordered" 
                name="password" 
                onChange={(e)=>{setValues({...values,[e.target.name]:e.target.value}) }}  />
            
              <label className="label">
                <Link to="/admin/forgot-password" className="label-text-alt link link-hover">
                  Forgot password?
                </Link>
              </label>
            </div>
            
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
