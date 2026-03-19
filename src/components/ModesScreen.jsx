import { useState } from 'react';
import McSlot from './McSlot';
import { PixelPerson } from './PixelFood';
import './ModesScreen.css';

const MODES = [
  {
    id: 'solo',
    name: 'SOLO',
    description: 'Just you. No debates.',
    icon: 1
  },
  {
    id: 'couple',
    name: 'COUPLE',
    description: 'Two players. One meal.',
    icon: 2
  },
  {
    id: 'squad',
    name: 'SQUAD',
    description: 'Democracy. Sorta.',
    icon: 3
  }
];

export default function ModesScreen({ onSelectMode }) {
  const [hoveredMode, setHoveredMode] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSelect = (mode) => {
    setSelectedMode(mode.id);
    setTimeout(() => {
      onSelectMode(mode.id);
    }, 300);
  };

  return (
    <div className="modes-screen">
      <div className="modes-bg" />

      <div className="modes-content">
        <h1 className="modes-title">WHAT&apos;S THE VIBE?</h1>
        <p className="modes-subtitle">PICK YOUR MODE</p>

        <div className="modes-list">
          {MODES.map((mode) => (
            <McSlot
              key={mode.id}
              className={`mode-card ${selectedMode === mode.id ? 'mode-card--selected' : ''}`}
              onClick={() => handleSelect(mode)}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
            >
              {hoveredMode === mode.id && (
                <span className="mode-cursor">&#9654;</span>
              )}
              <div className="mode-icon">
                <PixelPerson count={mode.icon} />
              </div>
              <div className="mode-info">
                <h3 className="mode-name">{mode.name}</h3>
                <p className="mode-description">{mode.description}</p>
              </div>
            </McSlot>
          ))}
        </div>
      </div>

      {selectedMode && <div className="mode-flash" />}
    </div>
  );
}
