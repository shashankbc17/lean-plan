import React from 'react';
import { Flame, RotateCcw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  showReset?: boolean;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showReset, onReset }) => {
  return (
    <header className="app-header">
      <div className="brand-badge">
        <div className="brand-logo-icon">
          <Flame size={20} />
        </div>
        <span>AEROMEGA<span style={{ color: 'var(--primary)' }}>LEAN</span></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="free-tag">
          <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
          100% Free · No Payment
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
