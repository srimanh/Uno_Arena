import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VscHome, VscArchive, VscAccount, VscSettingsGear, VscSignOut } from 'react-icons/vsc';
import '../Styles/landingPage.css';
import '../Styles/signupPage.css';
import logo from '../assets/uno-logo.png';
import leftImage from '../assets/login-png.png';
import googleLogo from '../assets/google-logo.png'; 
import Dock from '../Components/Navbar';

const SignupPage = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSignup = async () => {
    try {
      let requestBody = {};

      if (username && password) {
        requestBody = { username, password, googleAuth: false };
      } else {
        if (!window.googleUser) {
          alert('Google authentication failed. Please try again.');
          return;
        }

        requestBody = {
          googleAuth: true,
          email: window.googleUser.email,
          name: window.googleUser.name,
          profileImage: window.googleUser.picture,
        };
      }

      const response = await fetch('http://localhost:5001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Signup Failed: ${errorText}`);
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      document.dispatchEvent(new Event('loginStatusChanged'));
      alert('Signup Successful!');
      navigate('/');
    } catch (error) {
      alert('Something went wrong. Please try again.');
      console.error('Error during signup:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.dispatchEvent(new Event('loginStatusChanged'));
    navigate('/signup');
  };

  const items = [
    { icon: <VscHome size={28} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <VscArchive size={28} />, label: 'BluePrint', onClick: () => navigate('/BluePrint') },
    { icon: localStorage.getItem('token') ? <VscSignOut size={28} /> : <VscAccount size={28} />, label: localStorage.getItem('token') ? 'Logout' : 'Login', onClick: localStorage.getItem('token') ? handleLogout : () => navigate('/signup') },
    { icon: <VscSettingsGear size={28} />, label: 'Game', onClick: () => navigate('/game') },
  ];

  return (
    <div className="uno-arena-container">
      <div className="left-image-container">
        <img src={leftImage} alt="Left Side" className="left-image" />
      </div>
      <div className="logo-container">
        <img src={logo} alt="UNO Logo" className="logo-image" />
        <div className="logo-text">UNO ARENA</div>
      </div>
      <div className="signup-content">
        <div className="signup-box">
          <div className="profile-upload">
            <label htmlFor="profile-upload-input" className="profile-upload-label">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-image" />
              ) : (
                <span className="upload-placeholder">Upload</span>
              )}
            </label>
            <input 
              type="file" 
              id="profile-upload-input" 
              className="profile-upload-input" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <label className="input-label">Enter the Username</label>
          <input 
            type="text" 
            className="username-input" 
            placeholder="Enter The Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="input-label2">Enter the Password</label>
          <input 
            type="password" 
            className="password-input" 
            placeholder="Enter Your Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="sign-in-button" onClick={handleSignup}>Sign Up</button>
          <div className='or'> Or </div>
          <button className="google-auth-button" 
            onClick={() => window.location.href = "http://localhost:5001/api/auth/google"}>
            <img src={googleLogo} alt="Google" className="google-logo" />
            Sign in with Google
          </button>
        </div>
      </div>
      <div className="dock-wrapper">
        <Dock 
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          distance={100}
          spring={{ mass: 0.1, stiffness: 300, damping: 20 }}
        />
      </div>
    </div>
  );
};

export default SignupPage;