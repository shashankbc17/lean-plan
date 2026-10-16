import React, { useState, useEffect } from 'react';
import { Check, Activity } from 'lucide-react';

interface CalculationLoaderProps {
  onComplete: () => void;
}

export const CalculationLoader: React.FC<CalculationLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'Computing Basal Metabolic Rate (BMR) & Daily TDEE', min: 0, done: progress >= 25 },
    { label: 'Calibrating safe 20% fat-loss deficit window', min: 25, done: progress >= 50 },
    { label: 'Structuring 15-minute visceral fat burn circuits', min: 50, done: progress >= 75 },
    { label: 'Formulating protein & macro synthesis plan', min: 75, done: progress >= 95 },
    { label: 'Unlocking 100% Free Plan (No Payment Required)', min: 95, done: progress >= 100 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        // Random incremental tick
        const next = prev + Math.floor(Math.random() * 4) + 2;
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  // SVG dash calculation (radius = 70, circumference = 2 * PI * 70 ≈ 440)
  const strokeOffset = 440 - (440 * progress) / 100;

  return (
    <div className="calculating-container">
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--primary)',
        fontSize: '0.85rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: '16px'
      }}>
        <Activity size={16} />
        <span>Synthesizing Your Fat-Loss Profile</span>
      </div>

      <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
        ANALYZING YOUR DATA
      </h2>
      <p className="hero-subtitle" style={{ marginBottom: '24px' }}>
        Please wait while our metabolic algorithm creates your personalized body leaning roadmap.
      </p>

      {/* Circular Progress Gauge */}
      <div className="circular-gauge">
        <svg viewBox="0 0 160 160">
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5722" />
              <stop offset="100%" stopColor="#ff9100" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r="70" className="gauge-bg" />
          <circle
            cx="80"
            cy="80"
            r="70"
            className="gauge-fill"
            style={{ strokeDashoffset: strokeOffset }}
          />
        </svg>
        <div className="gauge-label">{progress}%</div>
      </div>

      {/* Step Progress Checklist */}
      <div className="calc-step-list">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`calc-step-item ${step.done ? 'done' : progress >= step.min ? 'active' : ''}`}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: step.done ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: step.done ? 'var(--accent-green)' : 'var(--text-muted)',
              flexShrink: 0
            }}>
              {step.done ? <Check size={12} strokeWidth={3} /> : <span style={{ fontSize: '10px' }}>{idx + 1}</span>}
            </div>
            <span style={{ fontWeight: 500 }}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
