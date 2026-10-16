import React, { useState, useEffect } from 'react';
import type { DayPlan, UserMetrics, ExerciseItem } from '../types';
import {
  Flame,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Utensils,
  Droplets,
  TrendingDown,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Eye,
  Zap
} from 'lucide-react';
import { ExerciseAnimationModal } from './ExerciseAnimationModal';
import { getExerciseGifPath, CDN_FALLBACK_MAP } from '../data/exerciseMedia';

interface DashboardProps {
  plan: DayPlan;
  metrics: UserMetrics;
  onRetake: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ plan, metrics, onRetake }) => {
  const [activeTab, setActiveTab] = useState<'workout' | 'meals' | 'fasting' | 'timeline'>('workout');

  // Workout state
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeTimerExercise, setActiveTimerExercise] = useState<ExerciseItem | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [animatingExercise, setAnimatingExercise] = useState<ExerciseItem | null>(null);

  // Meals state
  const [completedMeals, setCompletedMeals] = useState<string[]>([]);

  // Water tracker (8 glasses, 250ml each)
  const [waterCups, setWaterCups] = useState<number>(3);

  // Fasting timer state
  const [fastingElapsedSeconds, setFastingElapsedSeconds] = useState<number>(14 * 3600 + 22 * 60); // start at ~14h12m for demo
  const [isFastingActive, setIsFastingActive] = useState<boolean>(true);

  // Copy notification
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Exercise Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSecondsLeft > 0) {
      timer = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (activeTimerExercise) {
              setCompletedExercises((curr) => [...new Set([...curr, activeTimerExercise.id])]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerSecondsLeft, activeTimerExercise]);

  const startExerciseTimer = (exercise: ExerciseItem) => {
    const duration = exercise.durationSeconds || 45;
    setActiveTimerExercise(exercise);
    setTimerSecondsLeft(duration);
    setIsTimerRunning(true);
  };

  const toggleExerciseCheck = (id: string) => {
    setCompletedExercises((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleMealCheck = (name: string) => {
    setCompletedMeals((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const toggleWaterCup = (index: number) => {
    setWaterCups(index + 1 === waterCups ? index : index + 1);
  };

  const handleCopySummary = () => {
    const summary = `🔥 MY AEROMEGA LEANING PLAN (100% Free)
🎯 Goal: Drop ${plan.projectedWeightLossKg} kg (Target: ${metrics.targetWeightKg} kg)
⚡ Daily Calorie Target: ${plan.calorieDeficitTarget} kcal
🍗 Protein: ${plan.macros.proteinGrams}g | Carbs: ${plan.macros.carbsGrams}g | Fat: ${plan.macros.fatsGrams}g
⏱️ Fasting: ${plan.fastingWindow}
🏃 Routine: 15-Min ${plan.workout.title} (${plan.workout.circuitRounds} Rounds)
💧 Water: ${plan.waterTargetLiters} Liters/day`;

    navigator.clipboard.writeText(summary);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Workout progress
  const workoutProgress = Math.round(
    (completedExercises.length / plan.workout.exercises.length) * 100
  );

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Top Hero Summary Card */}
      <div className="dashboard-header-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>
              <Sparkles size={14} />
              <span>CUSTOM BODY LEANING ROADMAP</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>
              Target: <span style={{ color: 'var(--accent-green)' }}>{metrics.targetWeightKg} kg</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Current: {metrics.currentWeightKg} kg · Total to lose: <strong style={{ color: '#fff' }}>{plan.projectedWeightLossKg} kg</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="free-tag">UNLOCKED FREE</span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              ~{plan.targetTimelineWeeks} weeks timeline
            </div>
          </div>
        </div>

        {/* 3 Core Stats */}
        <div className="dashboard-stats-grid">
          <div className="dash-stat-box">
            <div className="dash-stat-val" style={{ color: 'var(--primary)' }}>
              {plan.calorieDeficitTarget}
            </div>
            <div className="dash-stat-lbl">Daily Calories</div>
          </div>

          <div className="dash-stat-box">
            <div className="dash-stat-val" style={{ color: 'var(--accent-cyan)' }}>
              {plan.macros.proteinGrams}g
            </div>
            <div className="dash-stat-lbl">Protein Target</div>
          </div>

          <div className="dash-stat-box">
            <div className="dash-stat-val" style={{ color: 'var(--accent-green)' }}>
              15 min
            </div>
            <div className="dash-stat-lbl">Daily Workout</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          <Flame size={15} />
          <span>15-Min Workout</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          <Utensils size={15} />
          <span>Meal Plan</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'fasting' ? 'active' : ''}`}
          onClick={() => setActiveTab('fasting')}
        >
          <Clock size={15} />
          <span>Fasting & Water</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <TrendingDown size={15} />
          <span>Timeline</span>
        </button>
      </div>

      {/* TAB 1: WORKOUT */}
      {activeTab === 'workout' && (
        <div>
          {/* Active Timer Box if launched */}
          {activeTimerExercise && (
            <div className="active-timer-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="live-pulse-indicator" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      WORKOUT HUD · LIVE CADENCE
                    </span>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    🎯 {activeTimerExercise.targetMuscle}
                  </span>
                </div>

                <div className="timer-hud-content">
                  {/* Left: Animated Looping Form Demo */}
                  {(() => {
                    const timerGif = getExerciseGifPath(activeTimerExercise.id, activeTimerExercise.gifUrl);
                    return (
                      <div
                        className="timer-gif-wrap"
                        onClick={() => setAnimatingExercise(activeTimerExercise)}
                        title="Tap to enlarge animation studio"
                      >
                        <img
                          src={timerGif}
                          alt={activeTimerExercise.name}
                          className="timer-gif-img"
                          onError={(e) => {
                            const fallback = CDN_FALLBACK_MAP[activeTimerExercise.id];
                            if (fallback && !e.currentTarget.src.includes('jsdelivr')) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="timer-gif-badge">
                          <Zap size={11} />
                          <span>Tap to Enlarge</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Right: Countdown & Controls */}
                  <div className="timer-clock-wrap">
                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px', color: '#fff' }}>{activeTimerExercise.name}</h3>
                    <div className="timer-countdown-number" style={{ color: timerSecondsLeft > 0 ? '#fff' : 'var(--accent-green)' }}>
                      {timerSecondsLeft > 0 ? `${timerSecondsLeft}s` : 'DONE! 🔥'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      {timerSecondsLeft > 0 ? 'Match your cadence with the live demonstration' : 'Great set! Logged to your circuit.'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {timerSecondsLeft > 0 ? (
                        <button
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {isTimerRunning ? <Pause size={15} /> : <Play size={15} />}
                          <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => {
                          setActiveTimerExercise(null);
                          setIsTimerRunning(false);
                        }}
                        className="btn-back"
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      >
                        <RotateCcw size={15} />
                        <span>Close</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workout Overview Header */}
          <div className="plan-section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  TODAY'S 15-MINUTE SESSION
                </span>
                <h3 style={{ fontSize: '1.3rem' }}>{plan.workout.title}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  ~{plan.workout.estimatedBurn} kcal
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.workout.circuitRounds} Rounds</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
              {plan.workout.tagline}
            </p>

            {/* Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
              <span>Circuit Completion</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>{workoutProgress}%</span>
            </div>
            <div className="funnel-progress-bar">
              <div className="funnel-progress-fill" style={{ width: `${workoutProgress}%` }} />
            </div>
          </div>

          {/* Exercise List */}
          <div className="plan-section-card" style={{ padding: '8px 20px' }}>
            {plan.workout.exercises.map((ex, idx) => {
              const isChecked = completedExercises.includes(ex.id);
              const isExpanded = expandedExerciseId === ex.id;

              return (
                <div key={ex.id} className="exercise-row">
                  {/* Mini Animated Demonstration Thumbnail */}
                  {(() => {
                    const rowGif = getExerciseGifPath(ex.id, ex.gifUrl);
                    return (
                      <button
                        onClick={() => setAnimatingExercise(ex)}
                        className="exercise-mini-thumb"
                        title="Tap to launch motion studio"
                      >
                        <img
                          src={rowGif}
                          alt={ex.name}
                          className="exercise-mini-thumb-img"
                          onError={(e) => {
                            const fallback = CDN_FALLBACK_MAP[ex.id];
                            if (fallback && !e.currentTarget.src.includes('jsdelivr')) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                        />
                        <div className="exercise-mini-thumb-play">
                          <Play size={10} fill="#fff" color="#fff" />
                        </div>
                      </button>
                    );
                  })()}

                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                        0{idx + 1}
                      </span>
                      <strong style={{
                        fontSize: '0.98rem',
                        color: isChecked ? 'var(--text-muted)' : '#fff',
                        textDecoration: isChecked ? 'line-through' : 'none'
                      }}>
                        {ex.name}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                      <span>🎯 {ex.targetMuscle}</span>
                      <span>·</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        {ex.durationSeconds ? `${ex.durationSeconds}s interval` : ex.reps}
                      </span>
                    </div>

                    {isExpanded && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px 14px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.83rem',
                        color: 'var(--text-main)',
                        borderLeft: '3px solid var(--primary)'
                      }}>
                        <p style={{ marginBottom: '6px' }}>{ex.instructions}</p>
                        <p style={{ color: 'var(--accent-gold)', fontSize: '0.78rem' }}>
                          💡 <strong>Form Tip:</strong> {ex.tip}
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* View Animation / Form Demo */}
                    <button
                      onClick={() => setAnimatingExercise(ex)}
                      className="btn-back"
                      style={{ padding: '6px 9px', fontSize: '0.75rem', color: 'var(--accent-cyan)', borderColor: 'rgba(0, 229, 255, 0.3)' }}
                      title="View Motion Animation"
                    >
                      <Eye size={12} />
                      <span>Studio</span>
                    </button>

                    {/* Launch timer button if interval */}
                    {ex.durationSeconds && (
                      <button
                        onClick={() => startExerciseTimer(ex)}
                        className="btn-back"
                        style={{ padding: '6px 9px', fontSize: '0.75rem', color: 'var(--primary)' }}
                        title="Start Timer"
                      >
                        <Play size={12} />
                        <span>Timer</span>
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                      className="btn-back"
                      style={{ padding: '6px', border: 'none' }}
                      title="Toggle instructions"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    <div
                      className={`check-circle ${isChecked ? 'completed' : ''}`}
                      onClick={() => toggleExerciseCheck(ex.id)}
                    >
                      {isChecked && <CheckCircle size={18} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MEALS */}
      {activeTab === 'meals' && (
        <div>
          {/* Macro Breakdown Header */}
          <div className="plan-section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  CALIBRATED NUTRITION
                </span>
                <h3 style={{ fontSize: '1.3rem' }}>Daily Macro Distribution</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {plan.calorieDeficitTarget} kcal
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>-22% Fat-Loss Deficit</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem', fontWeight: 800 }}>
                  {plan.macros.proteinGrams}g
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PROTEIN</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', fontWeight: 800 }}>
                  {plan.macros.carbsGrams}g
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CARBS</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ color: '#ff7043', fontSize: '1.1rem', fontWeight: 800 }}>
                  {plan.macros.fatsGrams}g
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HEALTHY FATS</div>
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {plan.meals.map((meal, idx) => {
              const isChecked = completedMeals.includes(meal.name);

              return (
                <div key={idx} className="plan-section-card" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        background: 'rgba(255, 87, 34, 0.1)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        display: 'inline-block',
                        marginBottom: '4px'
                      }}>
                        {meal.mealType}
                      </span>
                      <h4 style={{
                        fontSize: '1.05rem',
                        color: isChecked ? 'var(--text-muted)' : '#fff',
                        textDecoration: isChecked ? 'line-through' : 'none'
                      }}>
                        {meal.name}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                          {meal.calories} kcal
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>{meal.protein}g protein</div>
                      </div>

                      <div
                        className={`check-circle ${isChecked ? 'completed' : ''}`}
                        onClick={() => toggleMealCheck(meal.name)}
                      >
                        {isChecked && <CheckCircle size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <strong style={{ color: '#fff' }}>Ingredients:</strong> {meal.ingredients.join(', ')}
                  </div>

                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--accent-gold)',
                    background: 'rgba(255, 214, 0, 0.05)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 214, 0, 0.15)'
                  }}>
                    💡 {meal.tip}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FASTING & WATER */}
      {activeTab === 'fasting' && (
        <div>
          {/* Fasting Clock Card */}
          <div className="plan-section-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-cyan)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              <Clock size={14} />
              <span>INTERMITTENT FASTING (16:8 PROTOCOL)</span>
            </div>

            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.8rem',
              fontWeight: 900,
              color: '#fff',
              margin: '8px 0'
            }}>
              {Math.floor(fastingElapsedSeconds / 3600)}h {Math.floor((fastingElapsedSeconds % 3600) / 60)}m
            </div>

            <p style={{ color: 'var(--accent-green)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '16px' }}>
              🔥 Deep Fat-Oxidation Window Active (Autophagy & Ketosis Boost)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => setIsFastingActive(!isFastingActive)}
                className="btn-back"
                style={{ padding: '8px 16px', color: '#fff' }}
              >
                {isFastingActive ? 'Pause Tracker' : 'Resume Fasting'}
              </button>

              <button
                onClick={() => setFastingElapsedSeconds(16 * 3600)}
                className="btn-back"
                style={{ padding: '8px 16px', color: 'var(--accent-green)' }}
              >
                Complete 16h Fast
              </button>
            </div>
          </div>

          {/* Water Tracker Card */}
          <div className="plan-section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                  DAILY HYDRATION TRACKER
                </span>
                <h3 style={{ fontSize: '1.2rem' }}>Target: {plan.waterTargetLiters} Liters/day</h3>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {(waterCups * 0.25).toFixed(2)}L / {plan.waterTargetLiters}L
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
              Hydration increases metabolic resting expenditure and suppresses artificial hunger signals. Click a glass to track:
            </p>

            {/* 8 Glass Tracker */}
            <div className="water-cups-grid">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`water-cup ${idx < waterCups ? 'filled' : ''}`}
                  onClick={() => toggleWaterCup(idx)}
                >
                  <Droplets size={20} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, marginTop: '4px' }}>250ml</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fat Loss Habits Card */}
          <div className="plan-section-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>
              Daily Metabolic Habits to Accelerate Leaning
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.habits.map((habit, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                  <Award size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'var(--text-main)' }}>{habit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROGRESS TIMELINE */}
      {activeTab === 'timeline' && (
        <div>
          <div className="plan-section-card">
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 700, textTransform: 'uppercase' }}>
              PROJECTED WEIGHT DECLINE TRAJECTORY
            </span>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>
              From {metrics.currentWeightKg} kg to {metrics.targetWeightKg} kg
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>
              Calculated at a healthy sustainable pace of ~0.65 kg pure fat loss per week to protect lean muscle mass.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { week: 'Week 1-2', drop: '-1.4 kg', label: 'Glycogen & Water Shedding', detail: 'Noticeable reduction in face puffiness and lower abdomen bloating.' },
                { week: 'Week 3-4', drop: '-2.8 kg', label: 'Active Visceral Lipolysis', detail: 'Pants feel looser at waist; energy levels stabilize.' },
                { week: 'Week 6-8', drop: '-5.2 kg', label: 'Midway Transformation', detail: 'Visible core contour and defined jawline/arms.' },
                { week: `Week ${plan.targetTimelineWeeks}`, drop: `-${plan.projectedWeightLossKg} kg`, label: 'Target Dream Body Reached', detail: 'Sustained lean metabolic rate with zero rebound effect.' }
              ].map((milestone, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>{milestone.week}</span>
                      <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{milestone.label}</strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {milestone.detail}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-green)' }}>
                    {milestone.drop}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export / Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
        <button
          onClick={handleCopySummary}
          className="btn-back"
          style={{ flex: 1, justifyContent: 'center', padding: '14px', background: 'var(--bg-card)' }}
        >
          <Share2 size={16} />
          <span>{copiedNotification ? 'Copied to Clipboard! ✓' : 'Copy Plan to Notes'}</span>
        </button>

        <button
          onClick={() => window.print()}
          className="btn-back"
          style={{ flex: 1, justifyContent: 'center', padding: '14px', background: 'var(--bg-card)' }}
        >
          <Printer size={16} />
          <span>Print / PDF Plan</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={onRetake}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Change Answers or Recalculate Metrics
        </button>
      </div>

      {/* Exercise Biomechanical Animation Modal */}
      {animatingExercise && (
        <ExerciseAnimationModal
          exercise={animatingExercise}
          userGender={metrics.gender}
          onClose={() => setAnimatingExercise(null)}
          onStartTimer={(ex) => startExerciseTimer(ex)}
        />
      )}
    </div>
  );
};
