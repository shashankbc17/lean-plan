import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ArrowRight, HeartHandshake } from 'lucide-react';
import type { DayPlan } from '../types';

interface FreeUnlockModalProps {
  plan: DayPlan;
  onUnlock: () => void;
}

export const FreeUnlockModal: React.FC<FreeUnlockModalProps> = ({ plan, onUnlock }) => {
  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff5722', '#00e5ff', '#00e676', '#ffd600', '#ffffff']
      });
    } catch(e) {
      // ignore
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(0, 230, 118, 0.15)',
          border: '1px solid rgba(0, 230, 118, 0.4)',
          color: 'var(--accent-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Sparkles size={28} />
        </div>

        <div style={{
          display: 'inline-block',
          background: 'rgba(0, 230, 118, 0.12)',
          color: 'var(--accent-green)',
          border: '1px solid rgba(0, 230, 118, 0.3)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          ZERO PAYMENT · NO HIDDEN FEES
        </div>

        <h2 style={{ fontSize: '1.85rem', marginBottom: '8px' }}>
          YOUR CUSTOM PLAN IS READY!
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
          We believe fitness guidance should be accessible to everyone. No credit card, no trials, and no subscriptions.
        </p>

        {/* Projected Value Breakdown */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>Target Deficit: <strong style={{ color: '#fff' }}>{plan.calorieDeficitTarget} kcal/day</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>Projected Fat Loss: <strong style={{ color: '#fff' }}>{plan.projectedWeightLossKg} kg</strong> in ~{plan.targetTimelineWeeks} weeks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>Daily 15-Minute Home Fat-Burn Routine</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            <span>Full Daily Meal & Macro Nutrition Blueprint</span>
          </div>
        </div>

        <button onClick={onUnlock} className="btn-primary">
          <span>Access My Full Plan For Free</span>
          <ArrowRight size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <HeartHandshake size={14} color="var(--primary)" />
          <span>Made for your personal health transformation</span>
        </div>
      </div>
    </div>
  );
};
