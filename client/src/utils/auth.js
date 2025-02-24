// src/utils/auth.js
export const getTokenFromCookie = () => {
    // Get token from cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };
  
  export const checkAuthStatus = () => {
    const token = getTokenFromCookie();
    return !!token; // Returns true if token exists
  };
  
  // Date formatting
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  // Form validation
  export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Error handling
  export const handleApiError = (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'An unexpected error occurred';
  };