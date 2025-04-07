import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/gamePage.css';
import defaultPic from '../assets/default-avatar.png';
import logo from '../assets/uno-logo.png';

const GamePage = () => {
  const [players, setPlayers] = useState([]);
  const { roomCode } = useParams();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        console.log("📤 Fetching players for room:", roomCode);
        const res = await axios.get(`http://localhost:5001/api/rooms/room-players/${roomCode}`);
        setPlayers(res.data.players);
        console.log("✅ Players fetched:", res.data);
      } catch (error) {
        console.error("❌ Error fetching players:", error.response?.data || error.message);
      }
    };
    

    if (roomCode) {
      fetchPlayers();
    }
  }, [roomCode]);

  return (
    <div className="uno-arena-container">
      <div className="logo-container">
        <img src={logo} alt="UNO Logo" className="logo-image" />
        <div className="logo-text">UNO ARENA</div>
      </div>

      <div className="player-display-area">
        {players.map((player, index) => (
          <div className="player-card" key={index}>
            <img
  src={ player.profileImage || defaultPic }
  alt={player.username}
  className="player-avatar"
/>
            <p className="player-name">{player.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;