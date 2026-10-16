import { useState, useEffect } from 'react';
import type { UserMetrics, DayPlan } from './types';
import { calculatePlan } from './data/planGenerator';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { QuizStepContainer } from './components/QuizStepContainer';
import { CalculationLoader } from './components/CalculationLoader';
import { FreeUnlockModal } from './components/FreeUnlockModal';
import { Dashboard } from './components/Dashboard';
import './styles/theme.css';

export function App() {
  const [viewState, setViewState] = useState<'landing' | 'quiz' | 'calculating' | 'dashboard'>('landing');
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);

  // Restore existing plan from localStorage if available
  useEffect(() => {
    try {
      const savedMetrics = localStorage.getItem('aerolean_user_metrics');
      if (savedMetrics) {
        const parsedMetrics = JSON.parse(savedMetrics);
        const freshPlan = calculatePlan(parsedMetrics);
        setMetrics(parsedMetrics);
        setPlan(freshPlan);
        localStorage.setItem('aerolean_user_plan', JSON.stringify(freshPlan));
        setViewState('dashboard');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleStartQuiz = () => {
    setViewState('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizComplete = (newMetrics: UserMetrics) => {
    setMetrics(newMetrics);
    const generatedPlan = calculatePlan(newMetrics);
    setPlan(generatedPlan);

    // Save to localStorage
    try {
      localStorage.setItem('aerolean_user_metrics', JSON.stringify(newMetrics));
      localStorage.setItem('aerolean_user_plan', JSON.stringify(generatedPlan));
    } catch (e) {}

    // Show calculating simulation
    setViewState('calculating');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculationDone = () => {
    setShowUnlockModal(true);
    setViewState('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    localStorage.removeItem('aerolean_user_metrics');
    localStorage.removeItem('aerolean_user_plan');
    setMetrics(null);
    setPlan(null);
    setShowUnlockModal(false);
    setViewState('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="ambient-glow" />

      <div className="app-shell">
        <Header
          showReset={viewState === 'dashboard'}
          onReset={handleRetake}
        />

        <main style={{ flex: 1 }}>
          {viewState === 'landing' && (
            <HeroLanding onStart={handleStartQuiz} />
          )}

          {viewState === 'quiz' && (
            <QuizStepContainer
              onComplete={handleQuizComplete}
              onCancel={() => setViewState('landing')}
            />
          )}

          {viewState === 'calculating' && (
            <CalculationLoader onComplete={handleCalculationDone} />
          )}

          {viewState === 'dashboard' && plan && metrics && (
            <Dashboard
              plan={plan}
              metrics={metrics}
              onRetake={handleRetake}
            />
          )}
        </main>
      </div>

      {/* 100% Free Unlock Celebration Modal */}
      {showUnlockModal && plan && (
        <FreeUnlockModal
          plan={plan}
          onUnlock={() => setShowUnlockModal(false)}
        />
      )}
    </>
  );
}

export default App;
