import type { ExerciseItem } from '../types';

export interface AdminExerciseDefinition extends ExerciseItem {
  category: 'core' | 'lower' | 'fullbody' | 'upper';
  categoryLabel: string;
  intensity: 'Low' | 'Moderate' | 'High' | 'HIIT';
  hasSideAngle: boolean;
  videoSlug: string;
}

export const ALL_ADMIN_EXERCISES: AdminExerciseDefinition[] = [
  // --- CORE & ABS CATEGORY ---
  {
    id: 'ex-1',
    name: 'High Knees to Sprint March',
    category: 'core',
    categoryLabel: 'Core & Cardio Shred',
    targetMuscle: 'Cardiovascular & Lower Abs',
    intensity: 'HIIT',
    durationSeconds: 45,
    caloriesBurn: 35,
    instructions: 'Drive knees up explosively towards chest level while pumping arms rhythmically. Keep your core braced throughout.',
    tip: 'Land on the balls of your feet to minimize joint impact and maximize caloric burn.',
    gifUrl: '/exercises/ex-1.gif',
    hasSideAngle: false,
    videoSlug: 'high-knees'
  },
  {
    id: 'ex-2',
    name: 'Plank Knee-to-Elbow Drives',
    category: 'core',
    categoryLabel: 'Core & Cardio Shred',
    targetMuscle: 'Transverse Abdominis & Obliques',
    intensity: 'High',
    reps: '16 reps (8 each side)',
    caloriesBurn: 30,
    instructions: 'From a push-up position, bring right knee across to touch left elbow, pause for a split second, then return and switch.',
    tip: 'Draw your navel directly towards your spine to engage the deep girdle muscles.',
    gifUrl: '/exercises/ex-2.gif',
    hasSideAngle: false,
    videoSlug: 'plank-knee-drive'
  },
  {
    id: 'ex-3',
    name: 'Bicycle Crunches with Tempo Hold',
    category: 'core',
    categoryLabel: 'Core & Cardio Shred',
    targetMuscle: 'Rectus Abdominis & Waist Taper',
    intensity: 'High',
    reps: '20 controlled reps',
    caloriesBurn: 32,
    instructions: 'Lie on back, hands behind ears. Rotate torso to bring opposite elbow to knee while extending other leg straight out.',
    tip: 'Do not pull on your neck; focus on torso rotation using your abdominal muscles.',
    gifUrl: '/exercises/ex-3.gif',
    hasSideAngle: false,
    videoSlug: 'bicycle-crunch'
  },
  {
    id: 'ex-4',
    name: 'Mountain Climber Interval Burst',
    category: 'core',
    categoryLabel: 'Core & Cardio Shred',
    targetMuscle: 'Full Core & Full-Body Fat Burn',
    intensity: 'HIIT',
    durationSeconds: 40,
    caloriesBurn: 40,
    instructions: 'Drive knees rhythmically into chest at a rapid pace while keeping hips level and shoulder blades stabilized.',
    tip: 'Keep your hips low—do not let your glutes rise higher than your shoulders.',
    gifUrl: '/exercises/ex-4.gif',
    hasSideAngle: false,
    videoSlug: 'mountain-climbers'
  },
  {
    id: 'ex-5',
    name: 'Hollow Body Flutter Kicks',
    category: 'core',
    categoryLabel: 'Core & Cardio Shred',
    targetMuscle: 'Lower Abdominal Toning',
    intensity: 'Moderate',
    durationSeconds: 35,
    caloriesBurn: 25,
    instructions: 'Lie flat, press lower back into floor, raise feet 6 inches and perform smooth flutter kicks.',
    tip: 'If your lower back arches, raise your feet slightly higher until back remains flat.',
    gifUrl: '/exercises/ex-5.gif',
    hasSideAngle: false,
    videoSlug: 'flutter-kicks'
  },
  {
    id: 'ex-crunch',
    name: 'Controlled Abdominal Crunches',
    category: 'core',
    categoryLabel: 'Core & Cardio Shred',
    targetMuscle: 'Upper & Middle Abdominals',
    intensity: 'Moderate',
    reps: '18 reps with contraction',
    caloriesBurn: 28,
    instructions: 'Lie on mat with knees bent at 90°. Contract ribcage towards pelvis smoothly, lifting shoulder blades off floor.',
    tip: 'Do not tuck your chin; look up at a 45° angle to keep cervical spine neutral.',
    gifUrl: '/exercises/ex-3.gif',
    hasSideAngle: true,
    videoSlug: 'crunch'
  },

  // --- LOWER BODY & GLUTES CATEGORY ---
  {
    id: 'ex-t1',
    name: 'Bodyweight Squats to Stand',
    category: 'lower',
    categoryLabel: 'Lower Body & Glute Sculpt',
    targetMuscle: 'Quadriceps, Glutes & Core',
    intensity: 'Moderate',
    reps: '15 reps with pulse',
    caloriesBurn: 36,
    instructions: 'Drop hips back and down into parallel squat, maintain neutral spine, then drive explosively through heels.',
    tip: 'Keep chest lifted and ensure knees track inline with second toe.',
    gifUrl: '/exercises/ex-t1.gif',
    hasSideAngle: true,
    videoSlug: 'bodyweight-squat'
  },
  {
    id: 'ex-t2',
    name: 'Reverse Curtsy Lunges',
    category: 'lower',
    categoryLabel: 'Lower Body & Glute Sculpt',
    targetMuscle: 'Outer Glutes & Inner Thighs',
    intensity: 'High',
    reps: '16 reps (alternating)',
    caloriesBurn: 34,
    instructions: 'Step diagonally behind your front foot and lower hips until front thigh is parallel to ground.',
    tip: 'Drive through the front heel to maximize glute activation and tone the hip contour.',
    gifUrl: '/exercises/ex-t2.gif',
    hasSideAngle: true,
    videoSlug: 'curtsy-lunge'
  },
  {
    id: 'ex-t3',
    name: 'Glute Bridge with 3-Second Hold',
    category: 'lower',
    categoryLabel: 'Lower Body & Glute Sculpt',
    targetMuscle: 'Posterior Chain & Hamstrings',
    intensity: 'Moderate',
    reps: '15 reps',
    caloriesBurn: 28,
    instructions: 'Lie on back, feet flat. Drive hips upward until straight line forms from knees to shoulders; squeeze glutes hard.',
    tip: 'Maintain tension at the peak; do not hyperextend your lower lumbar spine.',
    gifUrl: '/exercises/ex-t3.gif',
    hasSideAngle: true,
    videoSlug: 'glute-bridge'
  },
  {
    id: 'ex-t4',
    name: 'Lateral Speed Skaters',
    category: 'lower',
    categoryLabel: 'Lower Body & Glute Sculpt',
    targetMuscle: 'Adductors, Calves & Fat Burn',
    intensity: 'HIIT',
    durationSeconds: 45,
    caloriesBurn: 42,
    instructions: 'Leap bound sideways from right foot to left foot in a skating motion, tapping trailing foot behind.',
    tip: 'Stay low in the hips for maximum athletic toning and stamina.',
    gifUrl: '/exercises/ex-t4.gif',
    hasSideAngle: false,
    videoSlug: 'speed-skaters'
  },

  // --- FULL BODY & METABOLIC BURN ---
  {
    id: 'ex-fb1',
    name: 'Jumping Jacks to Cross Punches',
    category: 'fullbody',
    categoryLabel: 'Full Body & Metabolic HIIT',
    targetMuscle: 'Full Body Cardio & Shoulder Tone',
    intensity: 'HIIT',
    durationSeconds: 45,
    caloriesBurn: 38,
    instructions: 'Perform 2 jumping jacks followed immediately by 4 sharp alternating cross punches in boxing stance.',
    tip: 'Breathe rhythmically and pivot on ball of foot during punches.',
    gifUrl: '/exercises/ex-fb1.gif',
    hasSideAngle: false,
    videoSlug: 'jumping-jacks-punches'
  },
  {
    id: 'ex-fb3',
    name: 'Rapid Sprint Mountain Climbers',
    category: 'fullbody',
    categoryLabel: 'Full Body & Metabolic HIIT',
    targetMuscle: 'Abdominals & Caloric Burn',
    intensity: 'HIIT',
    durationSeconds: 40,
    caloriesBurn: 42,
    instructions: 'Drive knees into chest rapidly in a push-up position, driving metabolic heart rate to peak zone.',
    tip: 'Distribute weight evenly across both palms to protect wrists.',
    gifUrl: '/exercises/ex-fb3.gif',
    hasSideAngle: false,
    videoSlug: 'mountain-climbers'
  },

  // --- UPPER BODY & STABILIZATION ---
  {
    id: 'ex-fb2',
    name: 'Bodyweight Push-Up to T-Spine Rotation',
    category: 'upper',
    categoryLabel: 'Upper Body & Core Strength',
    targetMuscle: 'Chest, Triceps, Shoulders & Core',
    intensity: 'High',
    reps: '12 controlled reps',
    caloriesBurn: 32,
    instructions: 'Complete a standard or knee push-up, then rotate torso raising one arm straight toward the ceiling.',
    tip: 'Keep neck neutral and maintain a rigid plank line throughout.',
    gifUrl: '/exercises/ex-fb2.gif',
    hasSideAngle: true,
    videoSlug: 'push-up'
  },
  {
    id: 'ex-fb5',
    name: 'Active Plank Shoulder Taps',
    category: 'upper',
    categoryLabel: 'Upper Body & Core Strength',
    targetMuscle: 'Core Anti-Rotation & Balance',
    intensity: 'Moderate',
    durationSeconds: 40,
    caloriesBurn: 30,
    instructions: 'Hold high plank with feet slightly wider than shoulders. Tap right shoulder with left hand without rocking hips.',
    tip: 'Imagine balancing a glass of water on your lower back to prevent swaying.',
    gifUrl: '/exercises/ex-fb5.gif',
    hasSideAngle: false,
    videoSlug: 'plank-shoulder-taps'
  }
];

export const EXERCISE_CATEGORIES = [
  { id: 'all', label: 'All Exercises', icon: 'Sparkles' },
  { id: 'core', label: 'Core & Shred', icon: 'Flame' },
  { id: 'lower', label: 'Lower Body & Glutes', icon: 'Activity' },
  { id: 'fullbody', label: 'Full Body HIIT', icon: 'Zap' },
  { id: 'upper', label: 'Upper & Stability', icon: 'Shield' }
] as const;
