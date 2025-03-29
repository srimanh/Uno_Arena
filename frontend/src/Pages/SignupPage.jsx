import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import '../Styles/landingPage.css';
import '../Styles/signupPage.css';
import logo from '../assets/uno-logo.png';
import leftImage from '../assets/login-png.png';
import googleLogo from '../assets/google-logo.png'; 
import Dock from '../Components/Navbar';

const SignupPage = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const items = [
    { icon: <VscHome size={28} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <VscArchive size={28} />, label: 'BluePrint', onClick: () => navigate('/BluePrint') },
    { icon: <VscAccount size={28} />, label: 'Login', onClick: () => navigate('/signup') },
    { icon: <VscSettingsGear size={28} />, label: 'Settings', onClick: () => {} },
  ];

  return (
    <div className="uno-arena-container">
      {/* Left-side image */}
      <div className="left-image-container">
        <img src={leftImage} alt="Left Side" className="left-image" />
      </div>

      {/* Logo and Title */}
      <div className="logo-container">
        <img src={logo} alt="UNO Logo" className="logo-image" />
        <div className="logo-text">UNO ARENA</div>
      </div>

      {/* Signup Form */}
      <div className="signup-content">
        <div className="signup-box">
          {/* Profile Picture Upload */}
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

          {/* Username Input */}
          <label className="input-label">Enter the Username</label>
          <input 
            type="text" 
            className="username-input" 
            placeholder="Enter The Username" 
          />

          {/* Sign In Button */}
          <button className="sign-in-button">Sign In</button>

          {/* OR Text */}
          <div className='or'> Or </div>

          {/* Google Sign In */}
          <button className="google-auth-button">
            <img src={googleLogo} alt="Google" className="google-logo" />
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
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
