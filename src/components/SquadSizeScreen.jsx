import { useState } from 'react';
import McButton from './McButton';
import './SquadSizeScreen.css';

export default function SquadSizeScreen({ onSelectSize, onBack }) {
  const [selectedSize, setSelectedSize] = useState(null);

  const sizes = [3, 4, 5, 6];

  const handleSelect = (size) => {
    setSelectedSize(size);
    setTimeout(() => {
      onSelectSize(size);
    }, 300);
  };

  return (
    <div className="squad-size-screen">
      <div className="squad-size-bg" />
      <div className="squad-size-content">
        <button className="squad-size-back" onClick={onBack}>
          <span>&lt;</span>
        </button>

        <h1 className="squad-size-title">HOW MANY PLAYERS?</h1>
        <p className="squad-size-subtitle">CHOOSE YOUR SQUAD SIZE</p>

        <div className="size-options">
          {sizes.map((size) => (
            <McButton
              key={size}
              variant={selectedSize === size ? 'green' : 'default'}
              onClick={() => handleSelect(size)}
              className={`size-button ${selectedSize === size ? 'size-button--selected' : ''}`}
            >
              {size}
            </McButton>
          ))}
        </div>
      </div>

      {selectedSize && <div className="size-flash" />}
    </div>
  );
}
