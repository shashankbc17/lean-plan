import { useState, useEffect } from 'react';
import type { UserMetrics, DayPlan, ExerciseItem } from './types';
import { calculatePlan } from './data/planGenerator';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { QuizStepContainer } from './components/QuizStepContainer';
import { CalculationLoader } from './components/CalculationLoader';
import { FreeUnlockModal } from './components/FreeUnlockModal';
import { Dashboard } from './components/Dashboard';
import { AdminExerciseStudio } from './components/AdminExerciseStudio';
import { ExerciseAnimationModal } from './components/ExerciseAnimationModal';
import type { AdminExerciseDefinition } from './data/adminExercises';
import './styles/theme.css';

export function App() {
  const [viewState, setViewState] = useState<'landing' | 'quiz' | 'calculating' | 'dashboard' | 'admin'>('landing');
  const [previousView, setPreviousView] = useState<'landing' | 'quiz' | 'calculating' | 'dashboard'>('landing');
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [detailedModalExercise, setDetailedModalExercise] = useState<ExerciseItem | null>(null);
  const [detailedModalGender, setDetailedModalGender] = useState<'male' | 'female'>('male');

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

  const handleOpenAdmin = () => {
    if (viewState !== 'admin') {
      setPreviousView(viewState);
      setViewState('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewState(previousView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseAdmin = () => {
    setViewState(previousView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetailedModal = (ex: AdminExerciseDefinition, gender: 'male' | 'female') => {
    setDetailedModalExercise(ex);
    setDetailedModalGender(gender);
  };

  return (
    <>
      <div className="ambient-glow" />

      <div className="app-shell" style={viewState === 'admin' ? { maxWidth: '1100px' } : undefined}>
        <Header
          showReset={viewState === 'dashboard'}
          onReset={handleRetake}
          onOpenAdmin={handleOpenAdmin}
          isAdminActive={viewState === 'admin'}
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

          {viewState === 'admin' && (
            <AdminExerciseStudio
              onBack={handleCloseAdmin}
              onOpenDetailedModal={handleOpenDetailedModal}
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

      {/* Biomechanical Motion Detail Modal */}
      {detailedModalExercise && (
        <ExerciseAnimationModal
          exercise={detailedModalExercise}
          userGender={detailedModalGender}
          onClose={() => setDetailedModalExercise(null)}
          onStartTimer={() => {
            setDetailedModalExercise(null);
          }}
        />
      )}
    </>
  );
}

export default App;
