import React, { useState } from 'react';
import type { AdminExerciseDefinition } from '../data/adminExercises';
import { ALL_ADMIN_EXERCISES, EXERCISE_CATEGORIES } from '../data/adminExercises';
import { getExerciseVideoPath } from '../data/exerciseMedia';
import { getExerciseKinematics } from '../data/exerciseKinematics';
import {
  Sparkles,
  Flame,
  Activity,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AdminExerciseStudioProps {
  onBack: () => void;
  onOpenDetailedModal: (exercise: AdminExerciseDefinition, gender: 'male' | 'female') => void;
}

export const AdminExerciseStudio: React.FC<AdminExerciseStudioProps> = ({
  onBack,
  onOpenDetailedModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'side'>('front');
  const [carouselIndexMap, setCarouselIndexMap] = useState<Record<string, number>>({});
  const [activeExpandedCardId, setActiveExpandedCardId] = useState<string | null>(null);

  // Filtered exercises
  const filteredExercises = ALL_ADMIN_EXERCISES.filter((ex) => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by category for stacked sections
  const groupedCategories = ['core', 'lower', 'fullbody', 'upper'].map((catId) => {
    const categoryInfo = EXERCISE_CATEGORIES.find((c) => c.id === catId);
    const exercisesInCat = filteredExercises.filter((ex) => ex.category === catId);
    return {
      id: catId,
      label: categoryInfo?.label || catId,
      exercises: exercisesInCat
    };
  }).filter(group => group.exercises.length > 0);

  const handleNextInCarousel = (catId: string, max: number) => {
    setCarouselIndexMap(prev => ({
      ...prev,
      [catId]: ((prev[catId] || 0) + 1) % max
    }));
  };

  const handlePrevInCarousel = (catId: string, max: number) => {
    setCarouselIndexMap(prev => ({
      ...prev,
      [catId]: ((prev[catId] || 0) - 1 + max) % max
    }));
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'core': return <Flame size={16} className="text-orange" />;
      case 'lower': return <Activity size={16} className="text-cyan" />;
      case 'fullbody': return <Zap size={16} className="text-yellow" />;
      case 'upper': return <Shield size={16} className="text-green" />;
      default: return <Sparkles size={16} className="text-orange" />;
    }
  };

  return (
    <div className="admin-studio-container">
      {/* Top Admin Banner */}
      <div className="admin-studio-header">
        <div className="admin-breadcrumb-row">
          <button onClick={onBack} className="btn-back">
            <ChevronLeft size={16} />
            <span>Exit Admin</span>
          </button>
          <div className="admin-mode-pill">
            <span className="live-dot" />
            ADMIN MASTER CATALOG · {ALL_ADMIN_EXERCISES.length} EXERCISES
          </div>
        </div>

        <div className="admin-title-row">
          <div>
            <h1 className="admin-headline">
              Exercise Library & Video Stack
            </h1>
            <p className="admin-subtitle">
              Browse cinematic motion captures, multi-angle video loops, biomechanical cues, and structured calorie burn metrics across all fitness categories.
            </p>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="admin-controls-bar">
          <div className="admin-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search exercise name, target muscle, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                ✕
              </button>
            )}
          </div>

          <div className="admin-toggles-row">
            {/* Gender Toggle */}
            <div className="admin-toggle-group">
              <span className="toggle-label">Talent:</span>
              <button
                className={`admin-toggle-btn ${selectedGender === 'male' ? 'active' : ''}`}
                onClick={() => setSelectedGender('male')}
              >
                Male
              </button>
              <button
                className={`admin-toggle-btn ${selectedGender === 'female' ? 'active' : ''}`}
                onClick={() => setSelectedGender('female')}
              >
                Female
              </button>
            </div>

            {/* Camera Angle */}
            <div className="admin-toggle-group">
              <span className="toggle-label">Angle:</span>
              <button
                className={`admin-toggle-btn ${selectedAngle === 'front' ? 'active' : ''}`}
                onClick={() => setSelectedAngle('front')}
              >
                Front View
              </button>
              <button
                className={`admin-toggle-btn ${selectedAngle === 'side' ? 'active' : ''}`}
                onClick={() => setSelectedAngle('side')}
              >
                Side View
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="admin-category-pills">
          {EXERCISE_CATEGORIES.map((cat) => {
            const count = cat.id === 'all' 
              ? ALL_ADMIN_EXERCISES.length 
              : ALL_ADMIN_EXERCISES.filter(e => e.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`admin-cat-pill ${isActive ? 'active' : ''}`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span className="cat-count-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Categorized Carousel Grid Stacks */}
      {groupedCategories.length === 0 ? (
        <div className="admin-empty-state">
          <AlertTriangle size={36} style={{ color: 'var(--text-muted)' }} />
          <h3>No exercises found</h3>
          <p>No results match "{searchQuery}". Try selecting another category or resetting the search filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="btn-action primary"
            style={{ marginTop: '16px' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="admin-categories-stack">
          {groupedCategories.map((group) => {
            const catIndex = carouselIndexMap[group.id] || 0;
            const canSlide = group.exercises.length > 1;

            return (
              <section key={group.id} className="admin-category-section">
                {/* Section Header with Carousel Nav */}
                <div className="admin-section-header">
                  <div className="admin-section-title">
                    <div className="section-icon-bubble">
                      {getCategoryIcon(group.id)}
                    </div>
                    <div>
                      <h2>{group.label}</h2>
                      <span className="section-subtitle">
                        {group.exercises.length} verified exercises with synced high-fps videos
                      </span>
                    </div>
                  </div>

                  <div className="admin-carousel-controls">
                    <button
                      className="carousel-arrow-btn"
                      onClick={() => handlePrevInCarousel(group.id, group.exercises.length)}
                      title="Previous Exercise"
                      disabled={!canSlide}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="carousel-page-indicator">
                      {catIndex + 1} / {group.exercises.length}
                    </span>
                    <button
                      className="carousel-arrow-btn"
                      onClick={() => handleNextInCarousel(group.id, group.exercises.length)}
                      title="Next Exercise"
                      disabled={!canSlide}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Grid Cards Stack */}
                <div className="admin-cards-grid">
                  {group.exercises.map((ex, idx) => {
                    const isCarouselFeatured = idx === catIndex;
                    const isExpanded = activeExpandedCardId === ex.id;
                    const videoData = getExerciseVideoPath(
                      ex.id,
                      selectedGender,
                      ex.hasSideAngle ? selectedAngle : 'front'
                    );
                    const kinematics = getExerciseKinematics(ex.id);

                    return (
                      <div
                        key={ex.id}
                        className={`admin-exercise-card ${isCarouselFeatured ? 'featured' : ''} ${isExpanded ? 'expanded' : ''}`}
                      >
                        {/* Video / GIF Player Container */}
                        <div className="admin-card-media-wrapper">
                          {videoData.videoUrl ? (
                            <video
                              key={`${videoData.videoUrl}-${selectedGender}-${selectedAngle}`}
                              src={videoData.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="admin-card-video"
                            />
                          ) : (
                            <div className="admin-media-fallback">
                              <img
                                src={ex.gifUrl}
                                alt={ex.name}
                                className="admin-card-video"
                              />
                            </div>
                          )}

                          {/* Media Overlay Badges */}
                          <div className="admin-media-badges">
                            <span className="badge-tag intensity">
                              {ex.intensity}
                            </span>
                            {ex.hasSideAngle && (
                              <span className="badge-tag angle">
                                Dual-Angle 3D
                              </span>
                            )}
                            <span className="badge-tag calories">
                              ~{ex.caloriesBurn} kcal
                            </span>
                          </div>

                          {/* Open Interactive Studio Button */}
                          <button
                            className="btn-interactive-open"
                            onClick={() => onOpenDetailedModal(ex, selectedGender)}
                            title="Open in Interactive Biomechanics Analyzer"
                          >
                            <Maximize2 size={16} />
                            <span>Detailed Motion Studio</span>
                          </button>
                        </div>

                        {/* Exercise Content Header */}
                        <div className="admin-card-content">
                          <div className="admin-card-meta-top">
                            <span className="exercise-id-chip">{ex.id}</span>
                            <span className="exercise-muscle-tag">{ex.targetMuscle}</span>
                          </div>

                          <h3 className="admin-card-title">{ex.name}</h3>

                          <p className="admin-card-instructions">
                            {ex.instructions}
                          </p>

                          {/* Coaching Tip */}
                          <div className="admin-card-tip">
                            <span className="tip-badge">Coach Tip</span>
                            <p>{ex.tip}</p>
                          </div>

                          {/* Kinematics Peek / Steps Toggle */}
                          <div className="admin-card-kinematics-preview">
                            <div className="kinematics-header">
                              <span className="label">
                                <Layers size={13} style={{ display: 'inline', marginRight: '4px' }} />
                                {kinematics.phases.length}-Phase Biomechanical Cadence
                              </span>
                              <button
                                className="btn-toggle-steps"
                                onClick={() => setActiveExpandedCardId(isExpanded ? null : ex.id)}
                              >
                                {isExpanded ? 'Hide Steps' : 'View Steps'}
                              </button>
                            </div>

                            {/* Collapsible Step Pills */}
                            {isExpanded && (
                              <div className="admin-steps-expansion-box">
                                <div className="mistake-alert-box">
                                  <AlertTriangle size={14} className="text-orange" />
                                  <div>
                                    <strong>Watch out:</strong> {kinematics.commonMistake}
                                  </div>
                                </div>

                                <div className="profix-alert-box">
                                  <CheckCircle2 size={14} className="text-green" />
                                  <div>
                                    <strong>Pro Fix:</strong> {kinematics.proFix}
                                  </div>
                                </div>

                                <div className="admin-steps-mini-list">
                                  {kinematics.phases.map((phase) => (
                                    <div key={phase.step} className="mini-step-item">
                                      <div className="step-num-bubble">{phase.step}</div>
                                      <div className="step-info">
                                        <div className="step-title">{phase.title}</div>
                                        <div className="step-action">{phase.action}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Footer Actions */}
                          <div className="admin-card-footer">
                            <div className="footer-dosage">
                              {ex.durationSeconds ? (
                                <span><strong>{ex.durationSeconds}s</strong> continuous interval</span>
                              ) : (
                                <span><strong>{ex.reps}</strong> controlled tempo</span>
                              )}
                            </div>

                            <button
                              className="btn-launch-player"
                              onClick={() => onOpenDetailedModal(ex, selectedGender)}
                            >
                              <span>Analyze Motion</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
