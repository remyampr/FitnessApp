import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setProfileComplete } from "../../redux/features/userSlice";

export const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch=useDispatch()

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");
    if (sessionId) {
      verifyPaymentAndRedirect(sessionId);
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);

    } else {
      toast.error("Payment verification failed: Missing session ID");
      // console.log("Payment verification failed: Missing session ID");
      
      navigate("complete-profile");
    }
  }, [location, navigate]);

  const verifyPaymentAndRedirect = async (sessionId) => {
    try {

        toast.success('Payment successful! Your subscription is now active.');
        // Redirect to dashboard after a brief delay
      setTimeout(() => {
        
        dispatch(setProfileComplete(true))

        navigate('user/dashboard');
      }, 2000);
        
    } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Error verifying payment. Please contact support.');
    } finally {
        setLoading(false);
      }
  }

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
