import { useState } from 'react';

const CUISINE_OPTIONS = [
  { label: '🍛 Indian', value: 'Indian' },
  { label: '🍝 Italian', value: 'Italian' },
  { label: '🌮 Mexican', value: 'Mexican' },
  { label: '🥢 Chinese', value: 'Chinese' },
  { label: '🍣 Japanese', value: 'Japanese' },
  { label: '🥙 Greek', value: 'Greek' },
  { label: '🍔 American', value: 'American' },
  { label: '🥘 Moroccan', value: 'Moroccan' },
];

const TYPE_OPTIONS = [
  { label: '🥗 Vegetarian', value: 'Vegetarian' },
  { label: '🍗 Chicken', value: 'Chicken' },
  { label: '🥩 Beef', value: 'Beef' },
  { label: '🐟 Seafood', value: 'Seafood' },
  { label: '🍮 Dessert', value: 'Dessert' },
  { label: '🐑 Lamb', value: 'Lamb' },
  { label: '🥩 Pork', value: 'Pork' },
  { label: '🍞 Misc', value: 'Miscellaneous' },
];

export default function FilterScreen({ onConfirm, onBack }) {
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleCuisine = (value) => {
    setSelectedCuisines(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleType = (value) => {
    setSelectedTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleConfirm = () => {
  const combined = [...selectedTypes, ...selectedCuisines];
  const selected = combined.length > 0
    ? combined
    : TYPE_OPTIONS.map(t => t.value);

  onConfirm(selected);
};

  const totalSelected = selectedCuisines.length + selectedTypes.length;

  return (
    <div className="bg-[#4A4A4A] pixel-grid h-screen overflow-y-auto flex flex-col items-center px-4 py-6 gap-4">
      <h1 className="text-[#FFD700] font-headline text-[10px] text-center leading-loose">
        WHAT ARE YOU<br />IN THE MOOD FOR?
      </h1>

      {/* Cuisine section */}
      <div className="w-full max-w-sm">
        <p className="text-[#7F7F7F] font-headline text-[7px] mb-2">CUISINE</p>
        <div className="grid grid-cols-4 gap-2">
          {CUISINE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggleCuisine(opt.value)}
              className={`p-2 border-4 font-headline text-[6px] text-center leading-tight transition-none flex flex-col items-center gap-1
                ${selectedCuisines.includes(opt.value)
                  ? 'bg-[#3c6711] border-[#bef28c] text-white'
                  : 'bg-[#1a1a1a] border-[#7F7F7F] text-[#7F7F7F]'}`}
            >
              <span style={{ fontSize: '1.2rem' }}>{opt.label.split(' ')[0]}</span>
              <span>{opt.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Type section */}
      <div className="w-full max-w-sm">
        <p className="text-[#7F7F7F] font-headline text-[7px] mb-2">TYPE</p>
        <div className="grid grid-cols-4 gap-2">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggleType(opt.value)}
              className={`p-2 border-4 font-headline text-[6px] text-center leading-tight transition-none flex flex-col items-center gap-1
                ${selectedTypes.includes(opt.value)
                  ? 'bg-[#3c6711] border-[#bef28c] text-white'
                  : 'bg-[#1a1a1a] border-[#7F7F7F] text-[#7F7F7F]'}`}
            >
              <span style={{ fontSize: '1.2rem' }}>{opt.label.split(' ')[0]}</span>
              <span>{opt.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-sm mt-2">
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-[#3c6711] border-4 border-[#bef28c] text-white font-headline text-[8px] pixel-shadow-box hover:-translate-y-1 transition-transform"
        >
          {totalSelected === 0 ? 'SHOW ALL' : `LETS GO! (${totalSelected} SELECTED)`}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-[#1a1a1a] border-4 border-[#7F7F7F] text-[#7F7F7F] font-headline text-[8px] hover:-translate-y-1 transition-transform"
        >
          BACK
        </button>
      </div>
    </div>
  );
}