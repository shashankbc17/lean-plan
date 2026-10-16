import React from 'react';
import { ArrowRight, Zap, Target, Apple, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroLandingProps {
  onStart: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onStart }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0 32px' }}>
      {/* Top Banner Tag */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(255, 87, 34, 0.12)',
        border: '1px solid rgba(255, 87, 34, 0.3)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-pill)',
        color: 'var(--primary)',
        fontSize: '0.85rem',
        fontWeight: 700,
        marginBottom: '20px'
      }}>
        <Sparkles size={15} />
        <span>SCIENTIFIC METABOLIC DEFICIT & LEANING FORMULA</span>
      </div>

      <h1 className="hero-title" style={{ fontSize: '2.5rem', maxWidth: '580px', textTransform: 'uppercase' }}>
        BUILD YOUR <span style={{ color: 'var(--primary)', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LEANEST</span> BODY YET
      </h1>

      <p className="hero-subtitle">
        Custom 15-minute daily home workouts and calibrated nutrition target designed specifically to burn stubborn fat and get toned. <strong>100% Free — No paywall, no card required.</strong>
      </p>

      {/* Hero Visual Card */}
      <div style={{
        width: '100%',
        background: 'radial-gradient(ellipse at center, rgba(255, 87, 34, 0.15) 0%, rgba(20, 22, 28, 0.8) 70%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 20px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Zap size={22} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>15 Min/Day</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No gym equipment</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Target size={22} color="var(--accent-cyan)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Exact Deficit</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mifflin-St Jeor BMR</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Apple size={22} color="var(--accent-green)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Custom Meals</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IF, Keto, or Balanced</div>
          </div>
        </div>

        {/* Feature Checkpoints */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          textAlign: 'left',
          maxWidth: '380px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>Target belly fat, love handles, and leg sculpting</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>Personalized daily calorie & macro targets</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>Free interactive tracking dashboard included</span>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button onClick={onStart} className="btn-primary" style={{ maxWidth: '380px', marginBottom: '16px' }}>
        <span>Build My Free Leaning Plan</span>
        <ArrowRight size={20} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <ShieldAlert size={14} color="var(--primary)" />
        <span>Takes 2 minutes · No registration or credit card required</span>
      </div>
    </div>
  );
};
