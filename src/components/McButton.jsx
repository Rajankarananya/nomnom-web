import './McButton.css';

export default function McButton({ children, onClick, variant = 'default', size = 'medium', className = '' }) {
  return (
    <button
      className={`mc-btn mc-btn--${variant} mc-btn--${size} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
