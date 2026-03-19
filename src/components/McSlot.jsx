import './McSlot.css';

export default function McSlot({ children, onClick, active = false, className = '' }) {
  return (
    <div
      className={`mc-slot-component ${active ? 'mc-slot-component--active' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
