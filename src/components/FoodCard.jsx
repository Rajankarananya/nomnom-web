import PixelFood from './PixelFood';
import './FoodCard.css';

export default function FoodCard({ food, swipeDirection, isDragging }) {
  return (
    <div
      className={`food-card ${isDragging ? 'food-card--dragging' : ''}`}
      style={{ backgroundColor: food.bgColor }}
    >
      {swipeDirection === 'right' && (
        <div className="stamp stamp--yum">YUM!</div>
      )}
      {swipeDirection === 'left' && (
        <div className="stamp stamp--nope">NOPE</div>
      )}

      <div className="food-card-image" style={{ backgroundColor: food.bgColor }}>
        <PixelFood food={food.key} size="large" />
      </div>

      <div className="food-card-info">
        <h2 className="food-card-name">{food.name}</h2>
        <div className="food-card-tags">
          {food.tags.map((tag, i) => (
            <span key={i} className="food-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
