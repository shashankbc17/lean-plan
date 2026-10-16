export type Gender = 'male' | 'female' | 'unisex';

export type AgeGroup = '18-29' | '30-39' | '40-49' | '50+';

export type FocusArea = 'belly' | 'fullbody' | 'thighs' | 'arms';

export type CurrentBodyType = 'chubby' | 'skinny_fat' | 'heavy' | 'soft_midsection';

export type TargetBodyType = 'lean_toned' | 'flat_stomach' | 'slim_cut' | 'shredded';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

export type DietPreference = 'balanced_deficit' | 'intermittent_fasting' | 'high_protein' | 'low_carb' | 'vegetarian';

export type ProblemObstacle = 'late_snacking' | 'sweet_tooth' | 'slow_metabolism' | 'no_time' | 'low_energy';

export interface UserMetrics {
  ageGroup: AgeGroup;
  gender: Gender;
  focusArea: FocusArea;
  currentBody: CurrentBodyType;
  targetBody: TargetBodyType;
  activityLevel: ActivityLevel;
  dietPreference: DietPreference;
  obstacles: ProblemObstacle[];
  currentWeightKg: number;
  heightCm: number;
  targetWeightKg: number;
}

export interface MacroSplit {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscle: string;
  durationSeconds?: number;
  reps?: string;
  caloriesBurn: number;
  instructions: string;
  tip: string;
  gifUrl?: string;
  femaleGifUrl?: string;
}

export interface WorkoutRoutine {
  title: string;
  tagline: string;
  totalMinutes: number;
  estimatedBurn: number;
  circuitRounds: number;
  exercises: ExerciseItem[];
}

export interface MealItem {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Metabolic Snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  preparationMinutes: number;
  tip: string;
}

export interface DayPlan {
  bmr: number;
  tdee: number;
  calorieDeficitTarget: number;
  macros: MacroSplit;
  targetTimelineWeeks: number;
  projectedWeightLossKg: number;
  waterTargetLiters: number;
  fastingWindow: string;
  workout: WorkoutRoutine;
  meals: MealItem[];
  habits: string[];
}
