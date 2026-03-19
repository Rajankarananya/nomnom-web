import './PixelFood.css';

// Color maps for 16x16 pixel art
const RAMEN_COLORS = {
  'B': '#8B4513',  // dark brown bowl
  'b': '#A0522D',  // mid brown bowl
  'W': '#F5F5DC',  // cream/white noodles
  'w': '#FFFACD',  // light yellow noodles
  'R': '#CC2200',  // red broth
  'r': '#FF4400',  // bright red broth
  'Y': '#FFD700',  // golden egg yolk
  'G': '#228B22',  // green onion
  '_': 'transparent'
};

const BURGER_COLORS = {
  'T': '#D2691E',  // top bun, warm brown
  't': '#A0522D',  // top bun shadow
  'S': '#F4A460',  // sesame seed color
  'L': '#32CD32',  // lettuce, bright green
  'l': '#228B22',  // lettuce dark
  'K': '#FF6347',  // tomato
  'k': '#CC3300',  // tomato shadow
  'C': '#FFD700',  // cheese yellow
  'c': '#DAA520',  // cheese shadow
  'P': '#3D1A00',  // patty dark
  'p': '#5C2A00',  // patty mid
  'B': '#C68642',  // bottom bun
  'b': '#A0522D',  // bottom bun shadow
  '_': 'transparent'
};

// 16x16 pixel maps
const RAMEN_MAP = `
________________
________________
___BBBBBBBBBB___
__BRRRRRRRRRRb__
_BRWwWrRWwWrRRB_
_BRwWwRrwWwRrRB_
_BRRWRRRRRRRRRB_
_BRrRYYrRrRYYrB_
_BRRRYYRRRRYYRB_
_BRGrRRRGrRRRrB_
_BbRRRRRRRRRRbB_
__BbbbbbbbbbbbB_
___BBBBBBBBBB___
___bbbbbbbbbb___
________________
________________
`;

const BURGER_MAP = `
________________
____TTTTTTTT____
___TTTTTTTTTT___
__TTTSTSTTSTTT__
__TTTTTTTTTTTT__
__tttttttttttt__
__LlLlLlLlLlLl__
__lLlLlLlLlLlL__
__KkKkKkKkKkKk__
__CCCCCCCCCCCC__
__cccccccccccc__
__PpPpPpPpPpPp__
__pPpPpPpPpPpP__
__BBBBBBBBBBBB__
__bbbbbbbbbbbb__
________________
`;

function parsePixelMap(mapString, colorMap) {
  const lines = mapString.trim().split('\n');
  const pixels = [];
  for (const line of lines) {
    for (const char of line) {
      pixels.push(colorMap[char] || 'transparent');
    }
  }
  return pixels;
}

// Pre-parsed pixel arrays
const RAMEN_PIXELS = parsePixelMap(RAMEN_MAP, RAMEN_COLORS);
const BURGER_PIXELS = parsePixelMap(BURGER_MAP, BURGER_COLORS);

// Legacy foods using index-based colors (10x10 or 8x8)
const LEGACY_FOODS = {
  pizza: {
    grid: [
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
      [0, 0, 1, 2, 3, 2, 2, 1, 0, 0],
      [0, 1, 2, 2, 2, 3, 2, 2, 1, 0],
      [0, 1, 2, 3, 2, 2, 2, 3, 1, 0],
      [1, 2, 2, 2, 2, 3, 2, 2, 2, 1],
      [1, 2, 3, 2, 2, 2, 2, 2, 3, 1],
      [1, 4, 4, 4, 4, 4, 4, 4, 4, 1],
    ],
    colors: ['transparent', '#D4A54B', '#FF6600', '#FF0000', '#F5DEB3']
  },
  butterChicken: {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 2, 2, 3, 2, 2, 3, 2, 2, 1],
      [1, 2, 3, 3, 3, 3, 3, 3, 2, 1],
      [1, 2, 3, 4, 3, 3, 4, 3, 2, 1],
      [1, 2, 3, 3, 3, 3, 3, 3, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    colors: ['transparent', '#F5F5DC', '#FF8C00', '#FFD700', '#8B4513']
  },
  avocadoToast: {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 3, 3, 2, 3, 3, 2, 2, 1],
      [1, 2, 3, 4, 3, 3, 4, 3, 2, 1],
      [1, 2, 3, 3, 3, 3, 3, 3, 2, 1],
      [1, 5, 5, 5, 5, 5, 5, 5, 5, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    colors: ['transparent', '#DEB887', '#6B8E23', '#228B22', '#556B2F', '#F5F5DC']
  },
  tacos: {
    grid: [
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 2, 1, 0, 0, 1, 2, 1, 0],
      [0, 1, 2, 3, 1, 1, 3, 2, 1, 0],
      [1, 2, 3, 4, 3, 3, 4, 3, 2, 1],
      [1, 2, 3, 3, 5, 5, 3, 3, 2, 1],
      [1, 2, 2, 3, 3, 3, 3, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    ],
    colors: ['transparent', '#F5DEB3', '#FFD700', '#32CD32', '#FF6347', '#8B4513']
  },
  sushi: {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    colors: ['transparent', '#000000', '#F5F5DC', '#FF6347']
  },
  padThai: {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 2, 3, 2, 3, 2, 3, 2, 2, 1],
      [1, 2, 2, 3, 2, 3, 2, 3, 2, 1],
      [1, 4, 2, 2, 3, 2, 2, 2, 4, 1],
      [1, 2, 3, 2, 2, 3, 2, 3, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    colors: ['transparent', '#8B4513', '#FFD700', '#F5DEB3', '#32CD32']
  },
  pasta: {
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 2, 3, 2, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 3, 2, 2, 2, 2, 1],
      [1, 2, 3, 2, 2, 2, 2, 3, 2, 1],
      [1, 4, 2, 2, 3, 2, 2, 2, 4, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
    colors: ['transparent', '#F5F5DC', '#F5DEB3', '#FF6347', '#228B22']
  },
  falafel: {
    grid: [
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 2, 2, 2, 2, 1, 0, 0],
      [0, 1, 2, 3, 2, 2, 3, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 3, 2, 2, 2, 3, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 3, 3, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    ],
    colors: ['transparent', '#8B4513', '#DEB887', '#32CD32']
  }
};

function Steam({ size }) {
  const cellSize = size === 'large' ? 14 : size === 'medium' ? 9 : 6;

  return (
    <div className="pixel-steam" style={{ width: cellSize * 16 }}>
      <div className="steam-column" style={{ left: cellSize * 4 }} />
      <div className="steam-column" style={{ left: cellSize * 8, animationDelay: '0.2s' }} />
      <div className="steam-column" style={{ left: cellSize * 12, animationDelay: '0.4s' }} />
    </div>
  );
}

export default function PixelFood({ food, size = 'medium' }) {
  const foodKey = food.toLowerCase().replace(/\s+/g, '');
  const cellSize = size === 'large' ? 14 : size === 'medium' ? 9 : 6;

  // Handle 16x16 pixel art foods (ramen, burger)
  if (foodKey === 'ramen') {
    return (
      <div className="pixel-food-container">
        <Steam size={size} />
        <div
          className={`pixel-food pixel-food--${size}`}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(16, ${cellSize}px)`,
            gridTemplateRows: `repeat(16, ${cellSize}px)`,
            imageRendering: 'pixelated',
          }}
        >
          {RAMEN_PIXELS.map((color, i) => (
            <div key={i} style={{ background: color }} />
          ))}
        </div>
      </div>
    );
  }

  if (foodKey === 'burger') {
    return (
      <div
        className={`pixel-food pixel-food--${size}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(16, ${cellSize}px)`,
          gridTemplateRows: `repeat(16, ${cellSize}px)`,
          imageRendering: 'pixelated',
        }}
      >
        {BURGER_PIXELS.map((color, i) => (
          <div key={i} style={{ background: color }} />
        ))}
      </div>
    );
  }

  // Handle legacy foods
  const pixelData = LEGACY_FOODS[foodKey] || LEGACY_FOODS.pizza;

  return (
    <div
      className={`pixel-food pixel-food--${size}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${pixelData.grid[0].length}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${pixelData.grid.length}, ${cellSize}px)`,
        imageRendering: 'pixelated',
      }}
    >
      {pixelData.grid.flatMap((row, y) =>
        row.map((colorIndex, x) => (
          <div
            key={`${x}-${y}`}
            style={{ backgroundColor: pixelData.colors[colorIndex] }}
          />
        ))
      )}
    </div>
  );
}

export function PixelSteveHead({ size = 'medium' }) {
  const pixelSize = size === 'small' ? 6 : size === 'large' ? 16 : 10;

  const grid = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 3, 2, 2, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 4, 4, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const colors = ['transparent', '#6B4423', '#D4A574', '#3D2314', '#CC9966'];

  return (
    <div
      className="pixel-steve"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${pixelSize}px)`,
        gridTemplateRows: `repeat(8, ${pixelSize}px)`,
        imageRendering: 'pixelated',
      }}
    >
      {grid.flatMap((row, y) =>
        row.map((colorIndex, x) => (
          <div
            key={`${x}-${y}`}
            style={{ backgroundColor: colors[colorIndex] }}
          />
        ))
      )}
    </div>
  );
}

export function PixelPerson({ count = 1, size = 'small' }) {
  const pixelSize = size === 'small' ? 3 : 5;

  // Special icon for JOIN mode (count === 0) - a door icon
  if (count === 0) {
    const door = [
      [1, 1, 1, 1],
      [1, 2, 2, 1],
      [1, 2, 2, 1],
      [1, 2, 3, 1],
      [1, 2, 2, 1],
      [1, 1, 1, 1],
    ];
    const doorColors = ['transparent', '#8B4513', '#A0522D', '#FFD700'];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(4, ${pixelSize}px)`,
          gridTemplateRows: `repeat(6, ${pixelSize}px)`,
          imageRendering: 'pixelated',
        }}
      >
        {door.flatMap((row, y) =>
          row.map((colorIndex, x) => (
            <div
              key={`door-${x}-${y}`}
              style={{ backgroundColor: doorColors[colorIndex] }}
            />
          ))
        )}
      </div>
    );
  }

  const person = [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 2, 2, 1],
    [0, 2, 2, 0],
    [0, 3, 3, 0],
    [0, 3, 3, 0],
  ];

  const colors = ['transparent', '#D4A574', '#5D8A32', '#3D6A12'];

  const renderPerson = (offset = 0) => (
    <div
      key={offset}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(4, ${pixelSize}px)`,
        gridTemplateRows: `repeat(6, ${pixelSize}px)`,
        imageRendering: 'pixelated',
        marginLeft: offset > 0 ? -pixelSize : 0
      }}
    >
      {person.flatMap((row, y) =>
        row.map((colorIndex, x) => (
          <div
            key={`${offset}-${x}-${y}`}
            style={{ backgroundColor: colors[colorIndex] }}
          />
        ))
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      {Array.from({ length: count }, (_, i) => renderPerson(i))}
    </div>
  );
}
