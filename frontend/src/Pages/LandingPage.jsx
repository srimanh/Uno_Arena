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
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomSize, setRoomSize] = useState(4);
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    document.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      document.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('Logged out successfully');
    navigate('/signup');
    document.dispatchEvent(new Event('loginStatusChanged'));
  };

  const generateRoomCode = () => {
    const randomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    setRoomCode(randomCode);
    localStorage.setItem('roomCode', randomCode); // Store in localStorage
    setPlayers([]);
  };
  

  const handleJoinRoom = () => {
    const storedRoomCode = localStorage.getItem('roomCode'); // Retrieve stored code
    console.log("Stored Room Code:", storedRoomCode); // Debugging
    console.log("Entered Room Code:", inputRoomCode); // Debugging
  
    if (inputRoomCode === storedRoomCode) {
      if (players.length + 1 < roomSize) {
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers, `Player ${prevPlayers.length + 1}`];
          localStorage.setItem('players', JSON.stringify(updatedPlayers)); // Store players in localStorage
          return updatedPlayers;
        });
      } else if (players.length + 1 === roomSize) {
        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers, `Player ${prevPlayers.length + 1}`];
          localStorage.setItem('players', JSON.stringify(updatedPlayers));
          navigate('/game'); // Redirect when the last player joins
          return updatedPlayers;
        });
      } else {
        alert('Room is full!');
      }
    } else {
      alert('Invalid room code!');
    }
  };

  const handleStartClick = () => {
    if (!isLoggedIn) {
      alert('Please log in to start the game.');
      navigate('/signup');
    } else {
      setShowJoinModal(true);
    }
  };

  const handleRoomClick = () => {
    if (!isLoggedIn) {
      navigate('/signup');
    } else {
      setShowRoomModal(true);
    }
  };

  const items = [
    { icon: <VscHome size={28} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <VscArchive size={28} />, label: 'BluePrint', onClick: () => navigate('/BluePrint') },
    isLoggedIn
      ? { icon: <VscSignOut size={28} />, label: 'Logout', onClick: handleLogout }
      : { icon: <VscAccount size={28} />, label: 'Login', onClick: () => navigate('/signup') },
    { icon: <VscSettingsGear size={28} />, label: 'Game', onClick: () => navigate('/game') },
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
          <TextPressure text="Where Legends!Play Their Cards!" flex italic textColor="#000" strokeColor="#FFD700" minFontSize={140} />
        </div>
        <p className="subtext">
          {subtext.split('').map((char, index) => (
            <span key={index} className="subtext-char" style={{ animationDelay: `${index * 0.05}s` }}>
              {char}
            </span>
          ))}
        </p>
        <div className="button-container">
          <button className="start-btn" onClick={handleStartClick}>
            <span className="inner-btn">Start</span>
          </button>
          <button className="room-btn" onClick={handleRoomClick}>
            <span className="inner-btn">Room</span>
          </button>
        </div>
      </div>

      <div className="card-hands-container">
        <img src={image} alt="UNO Cards" className="card-image" />
      </div>

      <div className="dock-wrapper">
        <Dock items={items} />
      </div>

      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Room</h2>
            <label>Choose Members:</label>
            <select value={roomSize} onChange={(e) => setRoomSize(parseInt(e.target.value))}>
              <option value={4}>4 Members</option>
              <option value={6}>6 Members</option>
            </select>
            <button onClick={generateRoomCode}>Generate Code</button>
            {roomCode && (
  <p>
    Room Code:{" "}
    {roomCode.split("").map((char, index) => (
      <span key={index} className="animated-code" style={{ animationDelay: `${index * 0.1}s` }}>
        {char}
      </span>
    ))}
  </p>
)}

            <button onClick={() => setShowRoomModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Enter Room Code</h2>
            <input type="text" value={inputRoomCode} onChange={(e) => setInputRoomCode(e.target.value)} />
            <button onClick={handleJoinRoom}>Start</button>
            <button onClick={() => setShowJoinModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnoArena;
