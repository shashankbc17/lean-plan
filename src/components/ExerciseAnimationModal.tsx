import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ExerciseItem, Gender } from '../types';
import { getExerciseVideoPath, getExerciseGifPath, CDN_FALLBACK_MAP } from '../data/exerciseMedia';
import { getExerciseKinematics } from '../data/exerciseKinematics';
import { getDecodedGif, type DecodedGif } from '../services/gifFrameDecoder';
import {
  X,
  Play,
  Pause,
  Zap,
  CheckCircle2,
  Sliders,
  Compass,
  AlertTriangle,
  Wind,
  Camera,
  Layers,
  Repeat,
  Sparkles
} from 'lucide-react';

interface ExerciseAnimationModalProps {
  exercise: ExerciseItem | null;
  userGender?: Gender;
  onClose: () => void;
  onStartTimer: (exercise: ExerciseItem) => void;
}

export const ExerciseAnimationModal: React.FC<ExerciseAnimationModalProps> = ({
  exercise,
  userGender = 'male',
  onClose,
  onStartTimer
}) => {
  const [currentGender, setCurrentGender] = useState<'male' | 'female'>(
    userGender === 'female' ? 'female' : 'male'
  );
  const [cameraAngle, setCameraAngle] = useState<'front' | 'side'>('front');
  const [isSlowMo, setIsSlowMo] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Step Loop vs Full Loop Mode:
  // When a step is clicked, isStepLoop is true and activeStepIndex determines the exact slice.
  // When 'Full Rep' is clicked, isStepLoop is false and the entire movement loops continuously.
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isStepLoop, setIsStepLoop] = useState<boolean>(false);

  // Time & Video tracking
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'video' | 'breakdown' | 'anatomy'>('video');

  // Canvas / GIF decoding state
  const [decodedGif, setDecodedGif] = useState<DecodedGif | null>(null);
  const [isLoadingGif, setIsLoadingGif] = useState<boolean>(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);

  // Reset state when exercise changes
  useEffect(() => {
    setActiveStepIndex(0);
    setIsStepLoop(false);
    setCurrentTime(0);
    setIsPaused(false);
    setCurrentFrameIndex(0);
    currentFrameRef.current = 0;
  }, [exercise?.id]);

  // Derived media and kinematics (safely computed for hook safety)
  const { videoUrl, hasSideAngle } = exercise
    ? getExerciseVideoPath(exercise.id, currentGender, cameraAngle)
    : { videoUrl: null, hasSideAngle: false };
  const kinematics = exercise ? getExerciseKinematics(exercise.id) : null;
  const activePhase = kinematics?.phases[activeStepIndex] || kinematics?.phases[0];
  const gifUrl = exercise ? getExerciseGifPath(exercise.id, exercise.gifUrl) : '';

  // -------------------------------------------------------------
  // Load & Decode GIF frames for pixel-perfect frame seeking
  // -------------------------------------------------------------
  useEffect(() => {
    if (!videoUrl && gifUrl) {
      let isMounted = true;
      setIsLoadingGif(true);

      getDecodedGif(gifUrl).then((decoded) => {
        if (!isMounted) return;
        setDecodedGif(decoded);
        setIsLoadingGif(false);
      });

      return () => {
        isMounted = false;
      };
    } else {
      setDecodedGif(null);
      setIsLoadingGif(false);
    }
  }, [videoUrl, gifUrl]);

  // -------------------------------------------------------------
  // Calculate bounds for Video & Canvas
  // -------------------------------------------------------------
  const getStepFrameBounds = useCallback(
    (stepIdx: number, totalUnits: number) => {
      if (!isStepLoop || stepIdx < 0 || stepIdx > 3) {
        return { start: 0, end: totalUnits - 1 };
      }
      const quarter = totalUnits / 4;
      const start = Math.floor(stepIdx * quarter);
      const end = stepIdx === 3 ? totalUnits - 1 : Math.floor((stepIdx + 1) * quarter) - 1;
      return { start, end: Math.max(start, end) };
    },
    [isStepLoop]
  );

  const getStepTimeBounds = useCallback(
    (stepIdx: number, totalDuration: number) => {
      if (!isStepLoop || stepIdx < 0 || stepIdx > 3 || totalDuration <= 0) {
        return { start: 0, end: totalDuration };
      }
      const quarter = totalDuration / 4;
      const start = stepIdx * quarter;
      const end = stepIdx === 3 ? totalDuration : (stepIdx + 1) * quarter;
      return { start, end };
    },
    [isStepLoop]
  );

  // -------------------------------------------------------------
  // Video Playback Control & Loop Segmentation
  // -------------------------------------------------------------
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = isSlowMo ? 0.5 : 1.0;
    }
  }, [isSlowMo]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  // Jump to step start time ONLY when isStepLoop is active
  useEffect(() => {
    if (isStepLoop && videoRef.current && duration > 0) {
      const bounds = getStepTimeBounds(activeStepIndex, duration);
      // Only set if out of bounds to avoid jitter
      const cur = videoRef.current.currentTime;
      if (cur < bounds.start - 0.05 || cur > bounds.end) {
        videoRef.current.currentTime = bounds.start;
        setCurrentTime(bounds.start);
      }
    }
  }, [activeStepIndex, isStepLoop, duration, getStepTimeBounds]);

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || duration;
    setCurrentTime(cur);
    if (dur && dur !== duration) setDuration(dur);

    if (dur > 0) {
      const bounds = getStepTimeBounds(activeStepIndex, dur);

      // Check if video reached the end of the selected step
      if (isStepLoop) {
        if (cur >= bounds.end - 0.04 || cur < bounds.start - 0.1) {
          videoRef.current.currentTime = bounds.start;
        }
      } else {
        // In full loop, sync the active step indicator with current position
        const quarter = dur / 4;
        const currentStep = Math.min(3, Math.floor(cur / quarter));
        if (currentStep !== activeStepIndex) {
          setActiveStepIndex(currentStep);
        }
      }
    }
  };

  // -------------------------------------------------------------
  // Canvas / Decoded GIF Animation Loop with Step Segmentation
  // -------------------------------------------------------------
  useEffect(() => {
    if (!decodedGif || !canvasRef.current || videoUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = decodedGif.width;
    canvas.height = decodedGif.height;

    if (isStepLoop) {
      const bounds = getStepFrameBounds(activeStepIndex, decodedGif.totalFrames);
      currentFrameRef.current = bounds.start;
      setCurrentFrameIndex(bounds.start);
    }
    lastFrameTimeRef.current = performance.now();

    const renderLoop = (timestamp: number) => {
      if (!isPaused) {
        const frame = currentFrameRef.current;
        const delay = (decodedGif.delays[frame] || 80) * (isSlowMo ? 2 : 1);
        const elapsed = timestamp - lastFrameTimeRef.current;

        if (elapsed >= delay) {
          lastFrameTimeRef.current = timestamp;

          // Paint current frame
          const imgData = decodedGif.frames[frame];
          if (imgData) {
            ctx.putImageData(imgData, 0, 0);
          }

          // Advance frame within step bounds
          const currentBounds = getStepFrameBounds(activeStepIndex, decodedGif.totalFrames);
          let nextFrame = frame + 1;

          if (isStepLoop) {
            if (nextFrame > currentBounds.end || nextFrame < currentBounds.start) {
              nextFrame = currentBounds.start;
            }
          } else {
            if (nextFrame >= decodedGif.totalFrames) {
              nextFrame = 0;
            }
            // Auto update step indicator when playing full flow
            const quarter = decodedGif.totalFrames / 4;
            const currentStep = Math.min(3, Math.floor(nextFrame / quarter));
            setActiveStepIndex(currentStep);
          }

          currentFrameRef.current = nextFrame;
          setCurrentFrameIndex(nextFrame);
        }
      } else {
        // Paused: ensure current frame is drawn
        const imgData = decodedGif.frames[currentFrameRef.current];
        if (imgData) {
          ctx.putImageData(imgData, 0, 0);
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [decodedGif, isPaused, isSlowMo, activeStepIndex, isStepLoop, videoUrl, getStepFrameBounds]);

  // Jump to step start frame on step selection
  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
    setIsStepLoop(true);

    if (decodedGif) {
      const bounds = getStepFrameBounds(index, decodedGif.totalFrames);
      currentFrameRef.current = bounds.start;
      setCurrentFrameIndex(bounds.start);
      lastFrameTimeRef.current = performance.now();
    }

    if (videoRef.current && duration > 0) {
      const bounds = getStepTimeBounds(index, duration);
      videoRef.current.currentTime = bounds.start;
      setCurrentTime(bounds.start);
    }
  };

  const handleToggleFullRep = () => {
    setIsStepLoop(!isStepLoop);
    if (isStepLoop) {
      // Switching to full rep
      if (decodedGif) {
        currentFrameRef.current = 0;
        setCurrentFrameIndex(0);
      }
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    } else {
      // Switching back to isolated step loop
      handleSelectStep(activeStepIndex);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetVal = parseFloat(e.target.value);
    if (videoUrl && videoRef.current) {
      setCurrentTime(targetVal);
      videoRef.current.currentTime = targetVal;
    } else if (decodedGif) {
      const frame = Math.min(decodedGif.totalFrames - 1, Math.max(0, Math.round(targetVal)));
      currentFrameRef.current = frame;
      setCurrentFrameIndex(frame);
    }
  };

  if (!exercise || !kinematics || !activePhase) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '620px',
          padding: '20px 20px 24px',
          textAlign: 'left',
          maxHeight: '94vh',
          overflowY: 'auto'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--primary)',
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                marginBottom: '2px'
              }}
            >
              <Zap size={14} />
              <span>60FPS HD MOTION STUDIO</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>
              {exercise.name}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '2px' }}>
              Target: {exercise.targetMuscle} · ~{exercise.caloriesBurn} kcal
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-back"
            style={{ padding: '6px', border: 'none', background: 'rgba(255,255,255,0.06)' }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="anim-studio-tabs" style={{ marginBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('video')}
            className={`anim-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
          >
            <Camera size={13} />
            <span>🎬 Kinetic Demonstration</span>
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`anim-tab-btn ${activeTab === 'breakdown' ? 'active' : ''}`}
          >
            <Compass size={13} />
            <span>📐 Step-by-Step Biomechanics</span>
          </button>

          <button
            onClick={() => setActiveTab('anatomy')}
            className={`anim-tab-btn ${activeTab === 'anatomy' ? 'active' : ''}`}
          >
            <Layers size={13} />
            <span>🎯 Joint Checkpoints</span>
          </button>
        </div>

        {/* Sub-bar: Athlete Model & Playback Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 12px',
            marginBottom: '10px'
          }}
        >
          {/* Athlete Gender Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Athlete:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setCurrentGender('male')}
                className={`gender-toggle-btn ${currentGender === 'male' ? 'active' : ''}`}
                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              >
                <span>♂ Male</span>
              </button>

              <button
                onClick={() => setCurrentGender('female')}
                className={`gender-toggle-btn ${currentGender === 'female' ? 'active' : ''}`}
                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              >
                <span>♀ Female</span>
              </button>
            </div>
          </div>

          {/* Camera Angle Toggle */}
          {hasSideAngle && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Angle:</span>
              <button
                onClick={() => setCameraAngle('front')}
                className={`gender-toggle-btn ${cameraAngle === 'front' ? 'active' : ''}`}
                style={{ padding: '3px 7px', fontSize: '0.72rem' }}
              >
                Front (0°)
              </button>
              <button
                onClick={() => setCameraAngle('side')}
                className={`gender-toggle-btn ${cameraAngle === 'side' ? 'active' : ''}`}
                style={{ padding: '3px 7px', fontSize: '0.72rem' }}
              >
                Side (90°)
              </button>
            </div>
          )}

          {/* Mode Switcher: Full Video vs Step Isolated Loop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => {
                if (isStepLoop) handleToggleFullRep();
              }}
              className={`gender-toggle-btn ${!isStepLoop ? 'active' : ''}`}
              style={{
                padding: '3px 9px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: !isStepLoop ? '#00e5ff' : 'var(--text-muted)',
                background: !isStepLoop ? 'rgba(0, 229, 255, 0.16)' : 'transparent',
                borderColor: !isStepLoop ? 'rgba(0, 229, 255, 0.4)' : 'transparent'
              }}
              title="Watch full uninterrupted repetition video"
            >
              <Sparkles size={11} color={!isStepLoop ? '#00e5ff' : 'currentColor'} />
              <span>Full Video</span>
            </button>

            <button
              onClick={() => {
                if (!isStepLoop) handleToggleFullRep();
              }}
              className={`gender-toggle-btn ${isStepLoop ? 'active' : ''}`}
              style={{
                padding: '3px 9px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isStepLoop ? '#ff8a65' : 'var(--text-muted)',
                background: isStepLoop ? 'rgba(255, 87, 34, 0.2)' : 'transparent',
                borderColor: isStepLoop ? 'var(--primary)' : 'transparent'
              }}
              title="Loop the active movement step segment"
            >
              <Repeat size={11} color={isStepLoop ? 'var(--primary)' : 'currentColor'} />
              <span>Step Isolated</span>
            </button>
          </div>

          {/* Playback Controls */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="gender-toggle-btn"
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              title="Pause / Resume"
            >
              {isPaused ? <Play size={11} /> : <Pause size={11} />}
              <span>{isPaused ? 'Resume' : 'Freeze'}</span>
            </button>

            <button
              onClick={() => setIsSlowMo(!isSlowMo)}
              className={`gender-toggle-btn ${isSlowMo ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              title="Toggle Slow-Mo"
            >
              <Sliders size={11} />
              <span>{isSlowMo ? '0.5x Slow-Mo' : '1.0x Realtime'}</span>
            </button>
          </div>
        </div>

        {/* ==========================================================
            VISUALIZATION STAGE: HIGH DEFINITION CINEMA ATHLETE
           ========================================================== */}
        {activeTab === 'video' && (
          <div>
            <div
              className="cinema-video-stage"
              style={{
                position: 'relative',
                width: '100%',
                height: '260px',
                background: 'radial-gradient(circle at center, #161b26 0%, #0a0d14 100%)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 35px rgba(0,0,0,0.6)'
              }}
            >
              {/* Top Stream Status Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-green)',
                    boxShadow: '0 0 6px var(--accent-green)'
                  }}
                />
                <span>{videoUrl ? '60 FPS ULTRA-HD ATHLETE' : '3D ANATOMICAL MOTION'}</span>
              </div>

              {/* Step Isolation Loop Badge (Clickable Toggle) */}
              <button
                onClick={handleToggleFullRep}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '12px',
                  background: isStepLoop ? 'rgba(255, 87, 34, 0.25)' : 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${isStepLoop ? 'var(--primary)' : 'rgba(0, 229, 255, 0.3)'}`,
                  padding: '4px 11px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: isStepLoop ? '#ff8a65' : '#00e5ff',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={isStepLoop ? 'Click to watch full continuous video' : 'Click to isolate active step'}
              >
                {isStepLoop ? (
                  <>
                    <Repeat size={11} color="var(--primary)" />
                    <span>Looping Step {activePhase.step} Segment (Click for Full Rep)</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={11} color="var(--accent-cyan)" />
                    <span>Full Continuous Rep (Click for Step Loop)</span>
                  </>
                )}
              </button>

              {/* RENDER VIDEO OR 3D DECODED CANVAS */}
              {videoUrl ? (
                <video
                  ref={videoRef}
                  key={`${exercise.id}-${currentGender}-${cameraAngle}`}
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onTimeUpdate={handleVideoTimeUpdate}
                  className="cinema-video-element"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'contrast(1.04) brightness(1.02)'
                  }}
                />
              ) : decodedGif ? (
                <canvas
                  ref={canvasRef}
                  style={{
                    maxHeight: '240px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))'
                  }}
                />
              ) : (
                /* Fallback while loading or if decoding not supported */
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    key={exercise.id + currentGender}
                    src={gifUrl}
                    alt={exercise.name}
                    className={isPaused ? 'gif-paused' : ''}
                    onError={(e) => {
                      const fallback = CDN_FALLBACK_MAP[exercise.id];
                      if (fallback && !e.currentTarget.src.includes('jsdelivr')) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    style={{
                      maxHeight: '240px',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))'
                    }}
                  />
                  {isLoadingGif && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '0.72rem',
                        color: 'var(--accent-cyan)',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    >
                      Calibrating step frames...
                    </div>
                  )}
                </div>
              )}

              {/* Active Muscle Floating Tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  zIndex: 10
                }}
              >
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>● Active Muscle:</span> {exercise.targetMuscle}
              </div>
            </div>

            {/* Video / Frame Interactive Scrubber Bar */}
            <div className="video-scrub-bar">
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {videoUrl ? `${currentTime.toFixed(1)}s` : `Frame ${currentFrameIndex + 1}`}
              </span>
              <input
                type="range"
                min="0"
                max={videoUrl ? duration || 1 : decodedGif ? decodedGif.totalFrames - 1 : 24}
                step={videoUrl ? 0.05 : 1}
                value={videoUrl ? currentTime : currentFrameIndex}
                onChange={handleSeek}
                className="video-scrub-slider"
                title="Scrub timeline frame by frame"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                {videoUrl ? `${duration.toFixed(1)}s Loop` : `${decodedGif?.totalFrames || 24} Frames`}
              </span>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 2: STEP-BY-STEP BIOMECHANICS & HOW TO MOVE
           ========================================================== */}
        {activeTab === 'breakdown' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              minHeight: '240px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>
                BIOMECHANICAL KINETIC CHECKPOINTS
              </span>
              <h4 style={{ fontSize: '1.05rem', color: '#fff', marginTop: '2px' }}>
                How to Move Your Body During {exercise.name}
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {kinematics.phases.map((ph, idx) => (
                <div
                  key={ph.step}
                  onClick={() => handleSelectStep(idx)}
                  className={`phase-detail-card ${activeStepIndex === idx ? 'active-border' : ''}`}
                  style={{
                    background: activeStepIndex === idx ? 'rgba(255, 87, 34, 0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeStepIndex === idx ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          background: activeStepIndex === idx ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                          color: '#fff',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 800
                        }}
                      >
                        {ph.step}
                      </span>
                      <strong style={{ color: '#fff', fontSize: '0.86rem' }}>{ph.title}</strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {ph.focusMuscles}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
                    {ph.action}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.74rem', color: 'var(--accent-green)' }}>
                    <Wind size={12} />
                    <span><strong>Breathing:</strong> {ph.breathing}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 3: JOINT CHECKPOINTS & ANGLE RULES
           ========================================================== */}
        {activeTab === 'anatomy' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              minHeight: '240px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>
                KINETIC POSTURE & DEGREE SPECIFICATIONS
              </span>
              <h4 style={{ fontSize: '1.05rem', color: '#fff', marginTop: '2px' }}>
                Precision Alignment Guidelines
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {kinematics.keyJointCheckpoints.map((cp, i) => (
                <div
                  key={i}
                  className="angle-card"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.86rem' }}>{cp.joint}</strong>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {cp.rule}
                    </div>
                  </div>
                  <span
                    className="angle-badge"
                    style={{
                      background: 'rgba(0, 229, 255, 0.1)',
                      color: 'var(--accent-cyan)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.76rem',
                      fontWeight: 700
                    }}
                  >
                    {cp.angle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP-BY-STEP BREAKDOWN CONTROLLER WITH SEGMENT LOOPING
           ======================================================== */}
        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4
              style={{
                fontSize: '0.86rem',
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={14} color="var(--primary)" />
              <span>Step-by-Step Bodily Movement:</span>
            </h4>

            {/* Toggle Full Flow vs Step Loop */}
            <button
              onClick={handleToggleFullRep}
              style={{
                background: !isStepLoop ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 87, 34, 0.15)',
                border: `1px solid ${!isStepLoop ? 'var(--accent-cyan)' : 'var(--primary)'}`,
                color: !isStepLoop ? 'var(--accent-cyan)' : '#ff8a65',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
              title={isStepLoop ? 'Click to play full uninterrupted repetition' : 'Click to isolate active step segment'}
            >
              {!isStepLoop ? <Sparkles size={12} /> : <Repeat size={12} />}
              <span>{isStepLoop ? 'Switch to Full Video' : 'Switch to Step Loop'}</span>
            </button>
          </div>

          {/* 4 Step Selector Buttons (With Segment Trigger) */}
          <div className="phase-scrubber-bar" style={{ marginTop: '8px' }}>
            {kinematics.phases.map((ph, idx) => (
              <button
                key={ph.step}
                onClick={() => handleSelectStep(idx)}
                className={`phase-step-pill ${activeStepIndex === idx ? 'active' : ''}`}
                title={`Loop Step ${ph.step}: ${ph.title}`}
              >
                <span className="step-num">Step {ph.step}</span>
                <span>{ph.title}</span>
              </button>
            ))}
          </div>

          {/* Active Phase Detail Card */}
          <div className="phase-detail-card" style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <div>
                <strong style={{ color: '#fff', fontSize: '0.92rem' }}>
                  Phase {activePhase.step}: {activePhase.title}
                </strong>
                <div style={{ fontSize: '0.74rem', color: isStepLoop ? 'var(--primary)' : 'var(--accent-cyan)', fontWeight: 600, marginTop: '2px' }}>
                  {isStepLoop
                    ? `▶ Active Loop: Showing Step ${activePhase.step} only`
                    : '● Continuous Rep Flow'}
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, background: 'rgba(255, 87, 34, 0.1)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                {activePhase.focusMuscles}
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.45 }}>
              {activePhase.action}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
              {activePhase.bodyCues.map((cue, i) => (
                <span key={i} className="phase-cue-pill">
                  <CheckCircle2 size={11} />
                  <span>{cue}</span>
                </span>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.76rem',
                color: 'var(--accent-cyan)',
                background: 'rgba(0, 229, 255, 0.06)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Wind size={13} />
              <span>
                <strong>Breathwork Cue:</strong> {activePhase.breathing}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            COMMON MISTAKE VS PRO-FIX COACH
           ======================================================== */}
        <div className="form-coach-grid" style={{ marginTop: '10px' }}>
          <div className="coach-box-mistake">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ff5252', fontWeight: 700, marginBottom: '3px' }}>
              <AlertTriangle size={13} />
              <span>#1 Common Mistake:</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', lineHeight: 1.35 }}>
              {kinematics.commonMistake}
            </div>
          </div>

          <div className="coach-box-fix">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-green)', fontWeight: 700, marginBottom: '3px' }}>
              <CheckCircle2 size={13} />
              <span>Pro Execution Fix:</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', lineHeight: 1.35 }}>
              {kinematics.proFix}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            onClick={() => {
              onStartTimer(exercise);
              onClose();
            }}
            className="btn-primary"
            style={{ flex: 1, padding: '12px 20px', fontSize: '0.96rem' }}
          >
            <Play size={16} />
            <span>Start Exercise Timer ({exercise.durationSeconds ? `${exercise.durationSeconds}s` : exercise.reps})</span>
          </button>

          <button
            onClick={onClose}
            className="btn-back"
            style={{ padding: '12px 18px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
