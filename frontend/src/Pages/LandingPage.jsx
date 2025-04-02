import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VscHome, VscArchive, VscAccount, VscSettingsGear, VscSignOut } from 'react-icons/vsc';
import TextPressure from '../Components/TextPressure';
import '../Styles/landingPage.css';
import image from '../assets/uno-cards.png';
import logo from '../assets/uno-logo.png';
import Dock from '../Components/Navbar';

const UnoArena = () => {
  const navigate = useNavigate();
  const subtext = "Play your cards right... or blame the deck!";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth state on mount
    setIsLoggedIn(!!localStorage.getItem('token'));

    // Listen for storage changes
    const handleStorageChange = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('Logged out successfully');
    navigate('/signup');
  };
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/'); // Redirect logged-in users to the landing page
    }
  }, [navigate]);

  const items = [
    { icon: <VscHome size={28} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <VscArchive size={28} />, label: 'BluePrint', onClick: () => navigate('/BluePrint') },
    isLoggedIn 
      ? { icon: <VscSignOut size={28} />, label: 'Logout', onClick: handleLogout }
      : { icon: <VscAccount size={28} />, label: 'Login', onClick: () => navigate('/signup') },
    { icon: <VscSettingsGear size={28} />, label: 'Settings', onClick: () => {} },
  ];

  return (
    <div className="uno-arena-container">
      {isLoggedIn && (
        <button className="logout-btn" onClick={handleLogout}>
          <VscSignOut size={24} /> Logout
        </button>
      )}

      <div className="logo-container">
        <img src={logo} alt="UNO Logo" className="logo-image" />
        <div className="logo-text">UNO ARENA</div>
      </div>

      <div className="uno-arena-content">
        <div className="text-pressure-container">
          <TextPressure
            text="Where Legends!Play Their Cards!"
            flex={true}
            alpha={false}
            stroke={true}
            width={true}
            weight={true}
            italic={true}
            textColor="#000000"
            strokeColor="#FFD700"
            minFontSize={140}
          />
        </div>

        <p className="subtext">
          {subtext.split('').map((char, index) => (
            <span
              key={index}
              className="subtext-char"
              style={{
                animationDelay: `${index * 0.05}s`,
                '--start-y': `${index % 2 === 0 ? '-20px' : '20px'}`
              }}
            >
              {char}
            </span>
          ))}
        </p>

        <div className="button-container">
          <button className="start-btn">Start</button>
          <button className="room-btn">Room</button>
        </div>
      </div>

      <div className="card-hands-container">
        <img src={image} alt="UNO Cards" className="card-image" />
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

export default UnoArena;
