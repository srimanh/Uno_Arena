import React from 'react';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import TextPressure from '../Components/TextPressure';
import '../Styles/landingPage.css';
import image from '../assets/uno-cards.png';
import logo from '../assets/uno-logo.png';
import Dock from '../Components/Navbar';

const UnoArena = () => {
  const subtext = "Play your cards right... or blame the deck!";
  const items = [
    { icon: <VscHome size={28} />, label: 'Home', onClick: () => {} },
    { icon: <VscArchive size={28} />, label: 'BulePrint', onClick: () => {} },
    { icon: <VscAccount size={28} />, label: 'Login', onClick: () => {} },
    { icon: <VscSettingsGear size={28} />, label: 'Settings', onClick: () => {} },
  ];

  return (
    <div className="uno-arena-container">
      <div className="logo-container">
        <img 
          src={logo} 
          alt="UNO Logo" 
          className="logo-image"
        />
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
        <img 
          src={image} 
          alt="UNO Cards" 
          className="card-image"
        />
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