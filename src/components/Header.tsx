import { Flame, RotateCcw, ShieldCheck, Film } from 'lucide-react';

interface HeaderProps {
  showReset?: boolean;
  onReset?: () => void;
  onOpenAdmin?: () => void;
  isAdminActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showReset, onReset, onOpenAdmin, isAdminActive }) => {
  return (
    <header className="app-header">
      <div className="brand-badge">
        <div className="brand-logo-icon">
          <Flame size={20} />
        </div>
        <span>AEROMEGA<span style={{ color: 'var(--primary)' }}>LEAN</span></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenAdmin}
          className={`btn-admin-header ${isAdminActive ? 'active' : ''}`}
          title="Exercise Library & Video Stack"
        >
          <Film size={14} />
          <span>Exercise Studio</span>
        </button>

        <div className="free-tag">
          <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
          100% Free
        </div>

        {showReset && onReset && (
          <button onClick={onReset} className="btn-back" title="Retake Assessment">
            <RotateCcw size={14} />
            <span>Retake</span>
          </button>
        )}
      </div>
    </header>
  );
};
