import React, { useState } from 'react';
import type { UserMetrics, FocusArea, Gender, AgeGroup, CurrentBodyType, TargetBodyType, ActivityLevel, DietPreference, ProblemObstacle } from '../types';
import { ArrowLeft, ArrowRight, Check, Flame } from 'lucide-react';

interface QuizStepContainerProps {
  onComplete: (metrics: UserMetrics) => void;
  onCancel: () => void;
}

export const QuizStepContainer: React.FC<QuizStepContainerProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // State
  const [focusArea, setFocusArea] = useState<FocusArea>('belly');
  const [gender, setGender] = useState<Gender>('male');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('18-29');
  const [currentBody, setCurrentBody] = useState<CurrentBodyType>('soft_midsection');
  const [targetBody, setTargetBody] = useState<TargetBodyType>('lean_toned');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [dietPreference, setDietPreference] = useState<DietPreference>('balanced_deficit');
  const [obstacles, setObstacles] = useState<ProblemObstacle[]>(['late_snacking', 'no_time']);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(78);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(70);

  const toggleObstacle = (obs: ProblemObstacle) => {
    if (obstacles.includes(obs)) {
      if (obstacles.length > 1) {
        setObstacles(obstacles.filter(o => o !== obs));
      }
    } else {
      setObstacles([...obstacles, obs]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete({
        focusArea,
        gender,
        ageGroup,
        currentBody,
        targetBody,
        activityLevel,
        dietPreference,
        obstacles,
        currentWeightKg,
        heightCm,
        targetWeightKg
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Top Progress Bar */}
      <div className="funnel-progress-wrap">
        <div className="funnel-progress-header">
          <button onClick={handleBack} className="btn-back">
            <ArrowLeft size={14} />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          <span>STEP {currentStep} OF {totalSteps}</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{progressPercent}%</span>
        </div>
        <div className="funnel-progress-bar">
          <div className="funnel-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* STEP 1: Focus Area */}
      {currentStep === 1 && (
        <div>
          <h2 className="hero-title" style={{ fontSize: '1.85rem' }}>Where do you want to lose fat first?</h2>
          <p className="hero-subtitle">We will customize your 15-minute daily routine to prioritize these stubborn fat zones.</p>

          <div className="options-grid">
            <div
              className={`option-card ${focusArea === 'belly' ? 'selected' : ''}`}
              onClick={() => { setFocusArea('belly'); handleNext(); }}
            >
              <div className="option-card-left">
                <div className="option-icon-box">🔥</div>
                <div>
                  <div className="option-label">Lower Belly & Love Handles</div>
                  <div className="option-description">Target visceral fat, waistline slimming, and core tightness</div>
                </div>
              </div>
              <div className="option-radio">
                {focusArea === 'belly' && <div className="option-radio-dot" />}
              </div>
            </div>

            <div
              className={`option-card ${focusArea === 'fullbody' ? 'selected' : ''}`}
              onClick={() => { setFocusArea('fullbody'); handleNext(); }}
            >
              <div className="option-card-left">
                <div className="option-icon-box">⚡</div>
                <div>
                  <div className="option-label">Full Body Fat Shred</div>
                  <div className="option-description">Overall weight drop, metabolic acceleration, and full toning</div>
                </div>
              </div>
              <div className="option-radio">
                {focusArea === 'fullbody' && <div className="option-radio-dot" />}
              </div>
            </div>

            <div
              className={`option-card ${focusArea === 'thighs' ? 'selected' : ''}`}
              onClick={() => { setFocusArea('thighs'); handleNext(); }}
            >
              <div className="option-card-left">
                <div className="option-icon-box">🦵</div>
                <div>
                  <div className="option-label">Thighs, Hips & Glutes</div>
                  <div className="option-description">Inner thigh slimming, leg toning, and firm glute lift</div>
                </div>
              </div>
              <div className="option-radio">
                {focusArea === 'thighs' && <div className="option-radio-dot" />}
              </div>
            </div>

            <div
              className={`option-card ${focusArea === 'arms' ? 'selected' : ''}`}
              onClick={() => { setFocusArea('arms'); handleNext(); }}
            >
              <div className="option-card-left">
                <div className="option-icon-box">💪</div>
                <div>
                  <div className="option-label">Arms, Back & Chest</div>
                  <div className="option-description">Trim arm flab, tighten back rolls, and athletic posture</div>
                </div>
              </div>
              <div className="option-radio">
                {focusArea === 'arms' && <div className="option-radio-dot" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Gender & Age Bracket */}
      {currentStep === 2 && (
        <div>
          <h2 className="hero-title" style={{ fontSize: '1.85rem' }}>Select your biological profile</h2>
          <p className="hero-subtitle">Caloric burn and metabolic baseline are calculated directly from hormone and age parameters.</p>

          <div style={{ marginBottom: '24px' }}>
            <label className="input-label">GENDER</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(['male', 'female', 'unisex'] as Gender[]).map((g) => (
                <div
                  key={g}
                  className={`option-card ${gender === g ? 'selected' : ''}`}
                  style={{ justifyContent: 'center', textAlign: 'center', padding: '14px 8px' }}
                  onClick={() => setGender(g)}
                >
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">AGE GROUP</label>
            <div className="options-grid">
              {(['18-29', '30-39', '40-49', '50+'] as AgeGroup[]).map((age) => (
                <div
                  key={age}
                  className={`option-card ${ageGroup === age ? 'selected' : ''}`}
                  onClick={() => setAgeGroup(age)}
                >
                  <div className="option-card-left">
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{age}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>years old</span>
                  </div>
                  <div className="option-radio">
                    {ageGroup === age && <div className="option-radio-dot" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ marginTop: '16px' }}>
            <span>Continue</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* STEP 3: Current Body & Target Goal */}
      {currentStep === 3 && (
        <div>
          <h2 className="hero-title" style={{ fontSize: '1.85rem' }}>Your Current Shape vs Dream Body</h2>
          <p className="hero-subtitle">Define where you are starting and how lean you want to become.</p>

          <div style={{ marginBottom: '24px' }}>
            <label className="input-label">CURRENT BODY STATUS</label>
            <div className="options-grid">
              {[
                { id: 'soft_midsection', label: 'Soft Midsection / Love Handles', sub: 'Average build, but fat collects around belly and hips' },
                { id: 'skinny_fat', label: 'Skinny Fat', sub: 'Slim arms and legs, but soft belly with low muscle tone' },
                { id: 'chubby', label: 'Overweight / Heavy', sub: 'Carrying excess body fat across all body regions' }
              ].map((item) => (
                <div
                  key={item.id}
                  className={`option-card ${currentBody === item.id ? 'selected' : ''}`}
                  onClick={() => setCurrentBody(item.id as CurrentBodyType)}
                >
                  <div>
                    <div className="option-label">{item.label}</div>
                    <div className="option-description">{item.sub}</div>
                  </div>
                  <div className="option-radio">
                    {currentBody === item.id && <div className="option-radio-dot" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">TARGET DESIRED BODY</label>
            <div className="options-grid">
              {[
                { id: 'lean_toned', label: 'Lean & Toned (Recommended)', sub: 'Low body fat, visible muscle lines, healthy athletic shape' },
                { id: 'flat_stomach', label: 'Flat Stomach & Slim Waist', sub: 'Zero belly bulge, tight waist, light and agile feel' },
                { id: 'shredded', label: 'Ultra Shredded & Chiseled', sub: 'Single-digit/low teen body fat with prominent vascularity and cuts' }
              ].map((item) => (
                <div
                  key={item.id}
                  className={`option-card ${targetBody === item.id ? 'selected' : ''}`}
                  onClick={() => setTargetBody(item.id as TargetBodyType)}
                >
                  <div>
                    <div className="option-label">{item.label}</div>
                    <div className="option-description">{item.sub}</div>
                  </div>
                  <div className="option-radio">
                    {targetBody === item.id && <div className="option-radio-dot" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ marginTop: '16px' }}>
            <span>Continue</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* STEP 4: Activity Level */}
      {currentStep === 4 && (
        <div>
          <h2 className="hero-title" style={{ fontSize: '1.85rem' }}>How active is your daily routine?</h2>
          <p className="hero-subtitle">We use your Total Daily Energy Expenditure (TDEE) to set an exact fat-loss deficit.</p>

          <div className="options-grid">
            {[
              { id: 'sedentary', label: 'Sedentary Desk Job', sub: 'Under 4,000 steps/day · Sitting at computer/office most of the day', icon: '🪑' },
              { id: 'lightly_active', label: 'Lightly Active', sub: '4,000 - 7,000 steps/day · Occasional light walks, errands', icon: '🚶' },
              { id: 'moderately_active', label: 'Moderately Active', sub: '7,000 - 10,000 steps/day · On your feet frequently during the day', icon: '🏃' },
              { id: 'very_active', label: 'Highly Active', sub: '10,000+ steps/day · Physical job or active sports training', icon: '🔥' }
            ].map((item) => (
              <div
                key={item.id}
                className={`option-card ${activityLevel === item.id ? 'selected' : ''}`}
                onClick={() => { setActivityLevel(item.id as ActivityLevel); handleNext(); }}
              >
                <div className="option-card-left">
                  <div className="option-icon-box">{item.icon}</div>
                  <div>
                    <div className="option-label">{item.label}</div>
                    <div className="option-description">{item.sub}</div>
                  </div>
                </div>
                <div className="option-radio">
                  {activityLevel === item.id && <div className="option-radio-dot" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: Nutrition Preference */}
      {currentStep === 5 && (
        <div>
          <h2 className="hero-title" style={{ fontSize: '1.85rem' }}>Select your preferred diet style</h2>
          <p className="hero-subtitle">Diet sustainability is the #1 key to becoming thin without feeling starved.</p>

          <div className="options-grid">
            {[
              { id: 'balanced_deficit', label: 'Balanced Flexible Deficit', sub: 'Eat wholesome foods you love while staying in your exact deficit window', icon: '🥗' },
              { id: 'intermittent_fasting', label: '16:8 Intermittent Fasting', sub: 'Skip breakfast, 8-hour eating window, accelerates cellular autophagy and fat oxidation', icon: '⏱️' },
              { id: 'high_protein', label: 'High-Protein Muscle Guard', sub: 'Max satiety, prevents cravings, keeps metabolism burning hot', icon: '🍗' },
              { id: 'low_carb', label: 'Low-Carb / Keto Inspired', sub: 'Cuts water weight quickly, minimizes insulin spikes and hunger pangs', icon: '🥑' },
              { id: 'vegetarian', label: 'Plant-Powered Vegetarian', sub: 'Fiber-dense, clean protein sources and vibrant phytonutrients', icon: '🌱' }
            ].map((item) => (
              <div
                key={item.id}
                className={`option-card ${dietPreference === item.id ? 'selected' : ''}`}
                onClick={() => { setDietPreference(item.id as DietPreference); handleNext(); }}
              >
                <div className="option-card-left">
                  <div className="option-icon-box">{item.icon}</div>
                  <div>
                    <div className="option-label">{item.label}</div>
                    <div className="option-description">{item.sub}</div>
                  </div>
                </div>
                <div className="option-radio">
                  {dietPreference === item.id && <div className="option-radio-dot" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: Obstacles (Multi-Select) */}
      {currentStep === 6 && (
        <div>
          <h2 className="hero-title" style={{ fontSize: '1.85rem' }}>What has stopped you from getting thin before?</h2>
          <p className="hero-subtitle">Select all that apply. Our plan integrates habit triggers to solve each one.</p>

          <div className="options-grid">
            {[
              { id: 'late_snacking', label: 'Late-Night Snacking & Binging', sub: 'Cravings hit hardest between 8 PM and 11 PM' },
              { id: 'sweet_tooth', label: 'Sweet Tooth & Sugar Cravings', sub: 'Afternoon energy crashes leading to sugar or junk snacks' },
              { id: 'slow_metabolism', label: 'Slow Metabolism / Weight Plateaus', sub: 'Feeling like eating very little still doesn’t drop weight' },
              { id: 'no_time', label: 'Lack of Time for Long Workouts', sub: 'Busy schedule unable to dedicate 60-90 minutes at a commercial gym' },
              { id: 'low_energy', label: 'Chronic Low Energy & Fatigue', sub: 'Feeling too drained by the evening to exercise' }
            ].map((item) => {
              const isSelected = obstacles.includes(item.id as ProblemObstacle);
              return (
                <div
                  key={item.id}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleObstacle(item.id as ProblemObstacle)}
                >
                  <div>
                    <div className="option-label">{item.label}</div>
                    <div className="option-description">{item.sub}</div>
                  </div>
                  <div className="check-circle" style={{
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    borderColor: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.2)'
                  }}>
                    {isSelected && <Check size={16} color="#fff" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ marginTop: '16px' }}>
            <span>Confirm & Continue</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* STEP 7: Body Metrics (Weight & Height) */}
      {currentStep === 7 && (
        <div>
          <h2 className="hero-title" style={{ fontSize: '1.85rem' }}>Your Metrics & Target Weight</h2>
          <p className="hero-subtitle">We calculate your exact Mifflin-St Jeor metabolic calorie deficit and target timeline.</p>

          <div className="metric-card-input">
            <div className="metric-header">
              <span className="input-label" style={{ margin: 0 }}>CURRENT WEIGHT</span>
              <div>
                <span className="metric-number-display">{currentWeightKg}</span>
                <span className="metric-unit">kg ({Math.round(currentWeightKg * 2.20462)} lbs)</span>
              </div>
            </div>
            <input
              type="range"
              min="45"
              max="150"
              value={currentWeightKg}
              onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
            />
          </div>

          <div className="metric-card-input">
            <div className="metric-header">
              <span className="input-label" style={{ margin: 0 }}>HEIGHT</span>
              <div>
                <span className="metric-number-display">{heightCm}</span>
                <span className="metric-unit">cm ({Math.floor(heightCm / 30.48)}'{Math.round((heightCm % 30.48) / 2.54)}")</span>
              </div>
            </div>
            <input
              type="range"
              min="140"
              max="210"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
            />
          </div>

          <div className="metric-card-input" style={{ borderColor: 'rgba(0, 230, 118, 0.4)', background: 'rgba(0, 230, 118, 0.04)' }}>
            <div className="metric-header">
              <span className="input-label" style={{ margin: 0, color: 'var(--accent-green)' }}>GOAL / TARGET WEIGHT</span>
              <div>
                <span className="metric-number-display" style={{ color: 'var(--accent-green)' }}>{targetWeightKg}</span>
                <span className="metric-unit" style={{ color: 'var(--accent-green)' }}>kg ({Math.round(targetWeightKg * 2.20462)} lbs)</span>
              </div>
            </div>
            <input
              type="range"
              min="40"
              max={currentWeightKg - 1}
              value={Math.min(targetWeightKg, currentWeightKg - 1)}
              onChange={(e) => setTargetWeightKg(Number(e.target.value))}
              style={{ accentColor: 'var(--accent-green)' }}
            />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Projected Total Fat Loss: <strong style={{ color: '#fff' }}>{(currentWeightKg - targetWeightKg).toFixed(1)} kg</strong> ({((currentWeightKg - targetWeightKg) * 2.20462).toFixed(1)} lbs)
            </div>
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ marginTop: '20px' }}>
            <span>Calculate My 100% Free Plan</span>
            <Flame size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
