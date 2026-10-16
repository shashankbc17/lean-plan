// Mapping of exercise IDs to local bundled videos & GIFs
export const CDN_FALLBACK_MAP: Record<string, string> = {
  'ex-1': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/walking-high-knees-lunge.gif',
  'ex-2': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/bridge-mountain-climber-cross-body.gif',
  'ex-3': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cross-body-crunch.gif',
  'ex-4': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/mountain-climber.gif',
  'ex-5': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/flutter-kicks.gif',
  'ex-t1': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/jump-squat.gif',
  'ex-t2': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/curtsey-squat.gif',
  'ex-t3': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/glute-bridge-march.gif',
  'ex-t4': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/skater-hops.gif',
  'ex-fb1': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/jack-jump-male.gif',
  'ex-fb2': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/push-up-to-side-plank.gif',
  'ex-fb3': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/mountain-climber.gif',
  'ex-fb4': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/squat-to-overhead-reach.gif',
  'ex-fb5': 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/shoulder-tap.gif'
};

interface VideoAssetConfig {
  slug: string;
  hasSideAngle?: boolean;
}

const EXERCISE_VIDEO_MAP: Record<string, VideoAssetConfig> = {
  'ex-1': { slug: 'high-knees', hasSideAngle: false },
  'ex-2': { slug: 'plank-knee-drive', hasSideAngle: false },
  'ex-3': { slug: 'bicycle-crunch', hasSideAngle: false },
  'ex-4': { slug: 'mountain-climbers', hasSideAngle: false },
  'ex-5': { slug: 'flutter-kicks', hasSideAngle: false },
  'ex-t1': { slug: 'bodyweight-squat', hasSideAngle: true },
  'ex-t2': { slug: 'curtsy-lunge', hasSideAngle: true },
  'ex-t3': { slug: 'glute-bridge', hasSideAngle: true },
  'ex-t4': { slug: 'speed-skaters', hasSideAngle: false },
  'ex-fb1': { slug: 'jumping-jacks-punches', hasSideAngle: false },
  'ex-fb2': { slug: 'push-up', hasSideAngle: true },
  'ex-fb3': { slug: 'mountain-climbers', hasSideAngle: false },
  'ex-fb4': { slug: 'bodyweight-squat', hasSideAngle: true },
  'ex-fb5': { slug: 'plank-shoulder-taps', hasSideAngle: false },
  'ex-crunch': { slug: 'crunch', hasSideAngle: true }
};

export function getExerciseVideoPath(
  id: string,
  gender: 'male' | 'female' = 'male',
  angle: 'front' | 'side' = 'front'
): { videoUrl: string | null; hasSideAngle: boolean } {
  const config = EXERCISE_VIDEO_MAP[id];
  if (!config) {
    return { videoUrl: null, hasSideAngle: false };
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  const chosenAngle = config.hasSideAngle ? angle : 'front';
  const resolvedGender = gender;
  const videoFile = `${resolvedGender}-Bodyweight-${config.slug}-${chosenAngle}.mp4`;

  return {
    videoUrl: `${cleanBase}videos/${videoFile}`,
    hasSideAngle: !!config.hasSideAngle
  };
}

export function getExerciseGifPath(id: string, customGifUrl?: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';

  if (customGifUrl && customGifUrl.startsWith('/exercises/')) {
    return `${cleanBase}${customGifUrl.slice(1)}`;
  }

  return `${cleanBase}exercises/${id}.gif`;
}
