// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthSuccess = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);  
//     const token = params.get('token');  
//     console.log("Token received:", token); 

//     if (token) {
//       localStorage.setItem('authToken', token);  
//       console.log("Token stored in localStorage");  
//       navigate('/');  
//       console.log("Navigating to home page"); 
//     } else {
//       alert('Login failed. Please try again.');  
//     //   navigate('/signup');  
//     }
//   }, [navigate]);

//   return <div>Processing login...</div>;
// };

// export default AuthSuccess;


import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);  
    const token = params.get('token'); 

    console.log("Token received:", token);  

    if (token) {
      localStorage.setItem('authToken', token);  
      console.log("Token stored in localStorage");  
      navigate('/');  
      console.log("Navigating to home page");  
    } else {
      const storedToken = localStorage.getItem('authToken');  
      console.log("Stored token:", storedToken);  

      if (storedToken) {
        navigate('/');  
        console.log("Navigating to home page from localStorage token");
      } else {
        alert('Login failed. Please try again.');  
        navigate('/signup');  
      }
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default AuthSuccess;
