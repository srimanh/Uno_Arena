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
  // const [players, setPlayers] = useState([]);

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

  const generateRoomCode = async () => {
    try {
      
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char code
      const token = localStorage.getItem('token');
      let userId;
try {
  const base64Url = token.split('.')[1];
  if (!base64Url) throw new Error('Invalid token format.');
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  const payload = JSON.parse(jsonPayload);
  userId = payload.userId;
} catch (err) {
  console.error('Invalid token:', err);
  alert('Invalid login session. Please log in again.');
  navigate('/signup');
  return;
}

  
      const response = await fetch('http://localhost:5001/api/rooms/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code: roomCode,
          roomSize,
          playerIds: [userId],
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setRoomCode(data.room.code); // or setRoomCode(roomCode);
      } else {
        alert(data.msg || data.error || 'Failed to create room.');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };
  
  const handleJoinRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not logged in');
        return;
      }
  
      let userId;
try {
  const base64Url = token.split('.')[1];
  if (!base64Url) throw new Error('Invalid token format.');
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  const payload = JSON.parse(jsonPayload);
  userId = payload.userId;
} catch (err) {
  console.error('Invalid token:', err);
  alert('Invalid login session. Please log in again.');
  navigate('/signup');
  return;
}

  
      const response = await fetch('http://localhost:5001/api/rooms/join-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, roomCode: inputRoomCode }),
      });
  
      const data = await response.json();
      if (response.ok) {
        navigate('/game');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error joining room:', error);
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
            <h2>Join Room</h2>
            <input
              type="text"
              placeholder="Enter Room Code"
              value={inputRoomCode}
              onChange={(e) => setInputRoomCode(e.target.value)}
            />
            <button onClick={handleJoinRoom}>Join</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnoArena;