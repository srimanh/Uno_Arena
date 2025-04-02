import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    console.log("Token received:", token);

    if (token) {
      localStorage.setItem('token', token); 
      console.log("Token stored in localStorage");
      document.dispatchEvent(new Event('loginStatusChanged'));
      navigate('/');
    } else {
      const storedToken = localStorage.getItem('token');
      console.log("Stored token:", storedToken);

      if (storedToken) {
        navigate('/');
      } else {
        alert('Login failed. Please try again.');
        navigate('/signup');
      }
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default AuthSuccess;