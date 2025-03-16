import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setProfileComplete } from "../../redux/features/userSlice";

export const PaymentSuccess = () => {
  console.log("PaymentSuccess component rendered");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch=useDispatch()

  // useEffect(() => {
  //   const query = new URLSearchParams(location.search);
  //   const sessionId = query.get("session_id");
  //   console.log("session id got in payment succesPage : ",sessionId);
  //   console.log("querry : ",query);
  //   console.log("token : ",localStorage.getItem('token'))
    
  //   if (sessionId) {
  //     verifyPaymentAndRedirect(sessionId);
  //     const newUrl = window.location.pathname;
  //     console.log("new url ",newUrl);
      
  //     window.history.replaceState(null, "", newUrl);

  //   } else {
  //     toast.error("Payment verification failed: Missing session ID");
  //     // console.log("Payment verification failed: Missing session ID");
      
  //     navigate("complete-profile");
  //   }
  // }, [location, navigate]);

  // const verifyPaymentAndRedirect = async (sessionId) => {
  //   console.log("redirecting ...");
    
  //   try {

  //       toast.success('Payment successful! Your subscription is now active.');
  //       // Redirect to dashboard after a brief delay
  //     setTimeout(() => {
        
  //       dispatch(setProfileComplete(true))

  //       navigate('user/dashboard');
  //     }, 2000);
        
  //   } catch (error) {
  //       console.error('Payment verification error:', error);
  //       toast.error('Error verifying payment. Please contact support.');
  //   } finally {
  //       setLoading(false);
  //     }
  // }

  return (
    <div className="payment-success-container">
    <h1>Payment Successful!</h1>
    {loading ? (
      <p>Processing your payment...</p>
    ) : (
      <div>
        <p>Your subscription has been activated.</p>
        <p>Redirecting to dashboard...</p>
      </div>
    )}
  </div>
  )
 
};
