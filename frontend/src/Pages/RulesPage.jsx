
import { useNavigate } from 'react-router-dom';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import '../Styles/landingPage.css';
import '../Styles/rulesPage.css';
import logo from '../assets/uno-logo.png';
import Dock from '../Components/Navbar';
import Masonry from '../Components/Rules';

const RulesPage = () => {
  const navigate = useNavigate();
  const items = [
    { icon: <VscHome size={28} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <VscArchive size={28} />, label: 'BluePrint', onClick: () => navigate('/BluePrint') },
    { icon: <VscAccount size={28} />, label: 'Login', onClick: () => navigate('/signup') },
    { icon: <VscSettingsGear size={28} />, label: 'game', onClick: () => navigate('/game') },
  ];

  const rulesData = [
    {
      id: 1,
      emoji: '🎮',
      title: 'Basic Rules',
      description: 'Match cards by color or number. Play one card per turn.',
      size: 'large'
    },
    {
      id: 2,
      emoji: '🔄',
      title: 'Special Cards',
      description: 'Skip, Reverse, Draw Two - Use these to change game flow.',
      size: 'small'
    },
    {
      id: 3,
      emoji: '🌈',
      title: 'Wild Cards',
      description: 'Change color and make strategic moves.',
      size: 'large'
    },
    {
      id: 4,
      emoji: '🎴',
      title: 'Draw Four',
      description: 'Make next player draw 4 cards and change color.',
      size: 'large'
    },
    {
      id: 5,
      emoji: '🔁',
      title: 'Turn Order',
      description: 'Play clockwise unless reversed.',
      size: 'large'
    },
    {
      id: 6,
      emoji: '🎯',
      title: 'Card Matching',
      description: 'Match by color, number, or symbol.',
      size: 'large'
    },
    {
      id: 7,
      emoji: '📢',
      title: 'Call UNO',
      description: 'Say UNO when you have one card left!',
      size: 'large'
    },
    {
      id: 8,
      emoji: '🏆',
      title: 'Winning',
      description: 'First player to play all cards wins.',
      size: 'large'
    },
    {
      id: 9,
      emoji: '⚡',
      title: 'Quick Play',
      description: 'Keep the game moving, play fast!',
      size: 'large'
    },
    {
      id: 10,
      emoji: '🎨',
      title: 'Colors',
      description: 'Red, Blue, Green, Yellow - Choose wisely!',
      size: 'large'
    },
    {
      id: 11,
      emoji: '❌',
      title: 'Penalties',
      description: 'Draw cards for wrong moves or missed UNO calls.',
      size: 'large'
    },
    {
      id: 12,
      emoji: '🔥',
      title: 'Action Cards',
      description: 'Use special cards to gain advantage.',
      size: 'large'
    }
  ];

  return (
    <div className="uno-arena-container">
      <div className="logo-container">
        <img src={logo} alt="UNO Logo" className="logo-image" />
        <div className="logo-text">UNO ARENA</div>
      </div>
      
      <h1 className="blueprint-heading">Blueprint</h1>
      
      <div className="rules-content">
        <Masonry data={rulesData} />
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

export default RulesPage;
