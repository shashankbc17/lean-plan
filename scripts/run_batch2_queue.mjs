import { generateExerciseVideo } from './batch_generate_exercises.mjs';

const BATCH2_QUEUE = [
  // 1. Speed Skaters (Male)
  {
    exerciseId: 'ex-t4',
    name: 'Lateral Speed Skaters',
    gender: 'male',
    slug: 'speed-skaters',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic male fitness model in dark compression shorts and athletic tank, balanced low in mid-lateral skating leap on right leg with knee bent 60 degrees, left leg sweeping diagonally behind, arms in athletic counter-swing. Dark gym studio with blue and amber rim lighting, front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete smoothly bounding side-to-side in dynamic skater hops, landing softly on outer foot and absorbing shock, rhythmic athletic motion, steady front camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-speed-skaters-front.mp4'
  },
  // 2. Speed Skaters (Female)
  {
    exerciseId: 'ex-t4',
    name: 'Lateral Speed Skaters',
    gender: 'female',
    slug: 'speed-skaters',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic female fitness model in dark gym shorts and sports bra, balanced low in mid-lateral skating leap on left leg with knee bent 60 degrees, right leg sweeping diagonally behind, arms in athletic counter-swing. Dark gym studio with blue and amber rim lighting, front 45-degree angle, high contrast, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete smoothly bounding side-to-side in dynamic skater hops, landing softly on outer foot and absorbing shock, rhythmic athletic motion, steady front camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-speed-skaters-front.mp4'
  },
  // 3. Jumping Jacks to Cross Punches (Male)
  {
    exerciseId: 'ex-fb1',
    name: 'Jumping Jacks to Cross Punches',
    gender: 'male',
    slug: 'jumping-jacks-punches',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic male boxer in dark training apparel, standing in crisp athletic boxing stance with fists guarding chin, ready to strike. Dark minimalist gym studio with vibrant neon cyan and orange rim lighting, front eye-level view, high contrast, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete performing 2 crisp jumping jacks immediately followed by 4 sharp alternating cross punches with torso rotation, fluid athletic rhythm, steady front camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-jumping-jacks-punches-front.mp4'
  },
  // 4. Jumping Jacks to Cross Punches (Female)
  {
    exerciseId: 'ex-fb1',
    name: 'Jumping Jacks to Cross Punches',
    gender: 'female',
    slug: 'jumping-jacks-punches',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic female boxer in dark training apparel and sports bra, standing in crisp athletic boxing stance with fists guarding chin, ready to strike. Dark minimalist gym studio with vibrant neon cyan and orange rim lighting, front eye-level view, high contrast, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete performing 2 crisp jumping jacks immediately followed by 4 sharp alternating cross punches with torso rotation, fluid athletic rhythm, steady front camera, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-jumping-jacks-punches-front.mp4'
  },
  // 5. Active Plank Shoulder Taps (Male)
  {
    exerciseId: 'ex-fb5',
    name: 'Active Plank Shoulder Taps',
    gender: 'male',
    slug: 'plank-shoulder-taps',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic male fitness model in high push-up plank on black gym mat, left hand lifted tapping right shoulder, core braced with completely flat and level hips, feet slightly wider than shoulders. Dark minimalist gym studio, neon cyan rim light, front 45-degree angle, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: male athlete performing controlled alternating shoulder taps from high plank, hips staying rock solid and level without rocking or twisting, slow steady tempo, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/male-Bodyweight-plank-shoulder-taps-front.mp4'
  },
  // 6. Active Plank Shoulder Taps (Female)
  {
    exerciseId: 'ex-fb5',
    name: 'Active Plank Shoulder Taps',
    gender: 'female',
    slug: 'plank-shoulder-taps',
    angle: 'front',
    imagePrompt: 'Create an image: Athletic female fitness model in high push-up plank on black gym mat, right hand lifted tapping left shoulder, core braced with completely flat and level hips, feet slightly wider than shoulders. Dark minimalist gym studio, neon cyan rim light, front 45-degree angle, photorealistic 8k.',
    motionPrompt: 'Animate this image into a seamless looping video with Omni 1.1 Flash: female athlete performing controlled alternating shoulder taps from high plank, hips staying rock solid and level without rocking or twisting, slow steady tempo, 60fps.',
    targetFile: 'C:/Users/Shashank/.gemini/antigravity-ide/scratch/lean-plan/public/videos/female-Bodyweight-plank-shoulder-taps-front.mp4'
  }
];

async function main() {
  console.log(`Starting Batch 2 Queue (${BATCH2_QUEUE.length} exercises)...`);
  for (const item of BATCH2_QUEUE) {
    try {
      const ok = await generateExerciseVideo(item);
      console.log(`Finished ${item.name} [${item.gender}]: success = ${ok}`);
    } catch (err) {
      console.error(`Failed ${item.name} [${item.gender}]:`, err.message);
    }
  }
  console.log('Batch 2 Queue completed!');
}

main();
