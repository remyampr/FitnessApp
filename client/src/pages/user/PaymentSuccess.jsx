import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setProfileComplete } from "../../redux/features/userSlice";

export const PaymentSuccess = () => {
  console.log("PaymentSuccess component rendered");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");
    console.log("session id got in payment succesPage : ", sessionId);
    console.log("querry : ", query);

    if (sessionId) {
      verifyPaymentAndRedirect(sessionId);
      const newUrl = window.location.pathname;
      console.log("new url ", newUrl);

      window.history.replaceState(null, "", newUrl);
    } else {
      toast.error("Payment verification failed: Missing session ID");
      // console.log("Payment verification failed: Missing session ID");

      navigate("complete-profile");
    }
  }, [location, navigate]);

   // Start progress animation when payment is successful
    useEffect(() => {
      if (!loading) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 5;
          });
        }, 100);
        
        return () => clearInterval(interval);
      }
    }, [loading]);
  

  const verifyPaymentAndRedirect = async (sessionId) => {
    console.log("redirecting ...");

    try {
      toast.success("Payment successful! Your subscription is now active.");
   
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        dispatch(setProfileComplete(true));

        navigate("/user/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Error verifying payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        {/* Header with success icon */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-white p-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Successful!</h1>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
              <p className="text-gray-700 text-center font-medium">Processing your payment...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 text-lg font-medium mb-1">Your subscription has been activated!</p>
                <p className="text-gray-500">Thank you for your purchase.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Redirecting to dashboard</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate("/user/dashboard")} 
                  className="btn btn-outline btn-success"
                >
                  Go to Dashboard Now
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <p className="text-xs text-center text-gray-500">
            If you have any questions about your subscription, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};
