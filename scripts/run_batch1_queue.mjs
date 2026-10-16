import { generateExerciseVideo } from './batch_generate_exercises.mjs';

const BATCH1_QUEUE = [
  // 1. Mountain Climber (Male)
  {
    exerciseId: 'ex-4',
    name: 'Mountain Climbers',
    gender: 'male',
    slug: 'mountain-climbers',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic male fitness model in dark compression pants and athletic tank, held in perfect push-up plank position on a black gym mat, left knee driven up towards chest, right leg extended back on toes, flat spine, neutral neck. Dark minimalist gym studio with dramatic cyan and amber rim lighting, side-front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete smoothly alternating mountain climber knee drives into chest with flat back and level hips, rapid rhythmic cadence, steady tripod camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-mountain-climbers-front.mp4'
  },
  // 2. Mountain Climber (Female)
  {
    exerciseId: 'ex-4',
    name: 'Mountain Climbers',
    gender: 'female',
    slug: 'mountain-climbers',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic female fitness model in dark compression shorts and sports bra, held in perfect push-up plank position on a black gym mat, right knee driven up towards chest, left leg extended back on toes, flat spine, neutral neck. Dark minimalist gym studio with dramatic cyan and amber rim lighting, side-front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete smoothly alternating mountain climber knee drives into chest with flat back and level hips, rapid rhythmic cadence, steady tripod camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-mountain-climbers-front.mp4'
  },
  // 3. Hollow Body Flutter Kicks (Male)
  {
    exerciseId: 'ex-5',
    name: 'Hollow Body Flutter Kicks',
    gender: 'male',
    slug: 'flutter-kicks',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic male fitness model lying flat on back on black gym mat in hollow body hold, shoulder blades elevated 2 inches, lower back pressed into floor, straight legs hovered 6 inches off ground with toes pointed. Dark minimalist gym studio with cyan and neon-orange rim lights, side 45-degree angle, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete performing smooth, continuous alternating flutter kicks with straight legs and pointed toes, lower back glued to floor, steady camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-flutter-kicks-front.mp4'
  },
  // 4. Hollow Body Flutter Kicks (Female)
  {
    exerciseId: 'ex-5',
    name: 'Hollow Body Flutter Kicks',
    gender: 'female',
    slug: 'flutter-kicks',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic female fitness model lying flat on back on black gym mat in hollow body hold, shoulder blades elevated 2 inches, lower back pressed into floor, straight legs hovered 6 inches off ground with toes pointed. Dark minimalist gym studio with cyan and neon-orange rim lights, side 45-degree angle, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete performing smooth, continuous alternating flutter kicks with straight legs and pointed toes, lower back glued to floor, steady camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-flutter-kicks-front.mp4'
  }
];

async function main() {
  console.log(`Starting Batch 1 Queue (${BATCH1_QUEUE.length} exercises)...`);
  for (const item of BATCH1_QUEUE) {
    try {
      const ok = await generateExerciseVideo(item);
      console.log(`Finished ${item.name} [${item.gender}]: success = ${ok}`);
    } catch (err) {
      console.error(`Failed ${item.name} [${item.gender}]:`, err.message);
    }
  }
  console.log('Batch 1 Queue completed!');
}

main();
