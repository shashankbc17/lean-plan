import type { UserMetrics, DayPlan, WorkoutRoutine, MealItem } from '../types';

export function calculatePlan(metrics: UserMetrics): DayPlan {
  const { gender, currentWeightKg, heightCm, targetWeightKg, activityLevel, dietPreference, focusArea } = metrics;

  // Age midpoint estimation
  let age = 28;
  if (metrics.ageGroup === '18-29') age = 24;
  else if (metrics.ageGroup === '30-39') age = 34;
  else if (metrics.ageGroup === '40-49') age = 44;
  else age = 54;

  // Mifflin-St Jeor Formula
  let bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr -= 78;
  }
  bmr = Math.round(bmr);

  // Activity multiplier
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725
  };
  const multiplier = multipliers[activityLevel] || 1.3;
  const tdee = Math.round(bmr * multiplier);

  // Safe sustainable 20-25% deficit for leaning down
  const calorieDeficitTarget = Math.max(1200, Math.round(tdee * 0.78));

  // Protein target: 1.8g to 2.0g per kg of target weight to maintain tone
  const proteinGrams = Math.round(targetWeightKg * 1.9);
  const proteinCalories = proteinGrams * 4;

  // Fat target: ~25% of total deficit calories
  const fatCalories = Math.round(calorieDeficitTarget * 0.25);
  const fatsGrams = Math.round(fatCalories / 9);

  // Carb target: remaining calories
  const carbCalories = Math.max(200, calorieDeficitTarget - proteinCalories - fatCalories);
  const carbsGrams = Math.round(carbCalories / 4);

  // Timeline computation (0.65 kg healthy fat loss per week)
  const weightToLose = Math.max(2, currentWeightKg - targetWeightKg);
  const targetTimelineWeeks = Math.max(4, Math.ceil(weightToLose / 0.65));

  // Water target (35ml per kg of bodyweight + 500ml for exercise)
  const waterTargetLiters = Number(((currentWeightKg * 0.035) + 0.5).toFixed(1));

  // Fasting window recommendation
  const fastingWindow = dietPreference === 'intermittent_fasting' ? '16:8 (Fasting 8 PM - 12 PM)' : '12:12 (Digestive Rest 8 PM - 8 AM)';

  // Workouts tailored to focus area
  const workout = generateWorkout(focusArea);

  // Meals tailored to preference and calorie budget
  const meals = generateMeals(dietPreference, calorieDeficitTarget, proteinGrams);

  const habits = [
    'Drink 500ml of warm water with lemon upon waking up to jumpstart digestive enzymes',
    'Follow the 15-minute fat-burning routine before your highest carbohydrate meal',
    'Stop all caloric intake at least 2.5 hours before bedtime for optimal night-time lipolysis',
    'Prioritize 7.5 to 8 hours of sleep: poor sleep elevates cortisol and locks visceral fat'
  ];

  return {
    bmr,
    tdee,
    calorieDeficitTarget,
    macros: {
      calories: calorieDeficitTarget,
      proteinGrams,
      carbsGrams,
      fatsGrams
    },
    targetTimelineWeeks,
    projectedWeightLossKg: weightToLose,
    waterTargetLiters,
    fastingWindow,
    workout,
    meals,
    habits
  };
}

function generateWorkout(focusArea: string): WorkoutRoutine {
  if (focusArea === 'belly') {
    return {
      title: '15-Min Visceral Belly Shred & Core Sculpt',
      tagline: 'High-metabolic intensity interval protocol designed to flatten lower abdomen and tighten obliques.',
      totalMinutes: 15,
      estimatedBurn: 180,
      circuitRounds: 3,
      exercises: [
        {
          id: 'ex-1',
          name: 'High Knees to Sprint March',
          targetMuscle: 'Cardiovascular & Lower Abs',
          durationSeconds: 45,
          caloriesBurn: 35,
          instructions: 'Drive knees up explosively towards chest level while pumping arms rhythmically. Keep your core braced throughout.',
          tip: 'Land on the balls of your feet to minimize joint impact and maximize caloric burn.',
          gifUrl: '/exercises/ex-1.gif'
        },
        {
          id: 'ex-2',
          name: 'Plank Knee-to-Elbow Drives',
          targetMuscle: 'Transverse Abdominis & Obliques',
          reps: '16 reps (8 each side)',
          caloriesBurn: 30,
          instructions: 'From a push-up position, bring right knee across to touch left elbow, pause for a split second, then return and switch.',
          tip: 'Draw your navel directly towards your spine to engage the deep girdle muscles.',
          gifUrl: '/exercises/ex-2.gif'
        },
        {
          id: 'ex-3',
          name: 'Bicycle Crunches with Tempo Hold',
          targetMuscle: 'Rectus Abdominis & Waist Taper',
          reps: '20 controlled reps',
          caloriesBurn: 32,
          instructions: 'Lie on back, hands behind ears. Rotate torso to bring opposite elbow to knee while extending other leg straight out.',
          tip: 'Do not pull on your neck; focus on torso rotation using your abdominal muscles.',
          gifUrl: '/exercises/ex-3.gif'
        },
        {
          id: 'ex-4',
          name: 'Mountain Climber Interval Burst',
          targetMuscle: 'Full Core & Full-Body Fat Burn',
          durationSeconds: 40,
          caloriesBurn: 40,
          instructions: 'Drive knees rhythmically into chest at a rapid pace while keeping hips level and shoulder blades stabilized.',
          tip: 'Keep your hips low—do not let your glutes rise higher than your shoulders.',
          gifUrl: '/exercises/ex-4.gif'
        },
        {
          id: 'ex-5',
          name: 'Hollow Body Flutter Kicks',
          targetMuscle: 'Lower Abdominal Toning',
          durationSeconds: 35,
          caloriesBurn: 25,
          instructions: 'Lie flat, press lower back into floor, raise feet 6 inches and perform smooth flutter kicks.',
          tip: 'If your lower back arches, raise your feet slightly higher until back remains flat.',
          gifUrl: '/exercises/ex-5.gif'
        }
      ]
    };
  }

  if (focusArea === 'thighs') {
    return {
      title: '15-Min Lean Legs & Glute Sculpt Routine',
      tagline: 'Dynamic bodyweight toning routine focused on burning leg fat, tightening inner thighs, and lifting glutes.',
      totalMinutes: 15,
      estimatedBurn: 175,
      circuitRounds: 3,
      exercises: [
        {
          id: 'ex-t1',
          name: 'Pulse Squats to Stand',
          targetMuscle: 'Quadriceps, Glutes & Core',
          reps: '15 reps with pulse',
          caloriesBurn: 36,
          instructions: 'Drop into a parallel squat, pulse 2 inches up and down twice, then stand explosively through heels.',
          tip: 'Keep chest lifted and ensure knees track inline with second toe.',
          gifUrl: '/exercises/ex-t1.gif'
        },
        {
          id: 'ex-t2',
          name: 'Reverse Curtsy Lunges',
          targetMuscle: 'Outer Glutes & Inner Thighs',
          reps: '16 reps (alternating)',
          caloriesBurn: 34,
          instructions: 'Step diagonally behind your front foot and lower hips until front thigh is parallel to ground.',
          tip: 'Drive through the front heel to maximize glute activation and tone the hip contour.',
          gifUrl: '/exercises/ex-t2.gif'
        },
        {
          id: 'ex-t3',
          name: 'Glute Bridge with 3-Second Hold',
          targetMuscle: 'Posterior Chain & Hamstrings',
          reps: '15 reps',
          caloriesBurn: 28,
          instructions: 'Lie on back, feet flat. Drive hips upward until straight line forms from knees to shoulders; squeeze glutes hard.',
          tip: 'Maintain tension at the peak; do not hyperextend your lower lumbar spine.',
          gifUrl: '/exercises/ex-t3.gif'
        },
        {
          id: 'ex-t4',
          name: 'Lateral Speed Skaters',
          targetMuscle: 'Adductors, Calves & Fat Burn',
          durationSeconds: 45,
          caloriesBurn: 42,
          instructions: 'Leap bound sideways from right foot to left foot in a skating motion, tapping trailing foot behind.',
          tip: 'Stay low in the hips for maximum athletic toning and stamina.',
          gifUrl: '/exercises/ex-t4.gif'
        }
      ]
    };
  }

  // Default: Full Body Lean & Metabolic Shred
  return {
    title: '15-Min Full Body Fat Shred & Metabolic Fire',
    tagline: 'EPOC-inducing bodyweight circuit designed to maximize calorie burn during and up to 24 hours after your session.',
    totalMinutes: 15,
    estimatedBurn: 195,
    circuitRounds: 3,
    exercises: [
      {
        id: 'ex-fb1',
        name: 'Jumping Jacks to Cross Punches',
        targetMuscle: 'Full Body Cardio & Shoulder Tone',
        durationSeconds: 45,
        caloriesBurn: 38,
        instructions: 'Perform 2 jumping jacks followed immediately by 4 sharp alternating cross punches in boxing stance.',
        tip: 'Breathe rhythmically and pivot on ball of foot during punches.',
        gifUrl: '/exercises/ex-fb1.gif'
      },
      {
        id: 'ex-fb2',
        name: 'Bodyweight Push-Up to T-Spine Rotation',
        targetMuscle: 'Chest, Triceps, Shoulders & Core',
        reps: '12 controlled reps',
        caloriesBurn: 32,
        instructions: 'Complete a standard or knee push-up, then rotate torso raising one arm straight toward the ceiling.',
        tip: 'Keep neck neutral and maintain a rigid plank line throughout.',
        gifUrl: '/exercises/ex-fb2.gif'
      },
      {
        id: 'ex-fb3',
        name: 'Speed Mountain Climbers',
        targetMuscle: 'Abdominals & Caloric Burn',
        durationSeconds: 40,
        caloriesBurn: 42,
        instructions: 'Drive knees into chest rapidly in a push-up position, driving metabolic heart rate to peak zone.',
        tip: 'Distribute weight evenly across both palms to protect wrists.',
        gifUrl: '/exercises/ex-fb3.gif'
      },
      {
        id: 'ex-fb4',
        name: 'Squat Thruster Reach',
        targetMuscle: 'Quads, Glutes, Deltoids',
        reps: '14 reps',
        caloriesBurn: 38,
        instructions: 'Squat deeply, then stand explosively while extending both arms directly overhead in a power push.',
        tip: 'Use the momentum generated from your legs to drive arms upward.',
        gifUrl: '/exercises/ex-fb4.gif'
      },
      {
        id: 'ex-fb5',
        name: 'Active Plank Shoulder Taps',
        targetMuscle: 'Core Anti-Rotation & Balance',
        durationSeconds: 40,
        caloriesBurn: 30,
        instructions: 'Hold high plank with feet slightly wider than shoulders. Tap right shoulder with left hand without rocking hips.',
        tip: 'Imagine balancing a glass of water on your lower back to prevent swaying.',
        gifUrl: '/exercises/ex-fb5.gif'
      }
    ]
  };
}

function generateMeals(diet: string, totalCalories: number, targetProtein: number): MealItem[] {
  const bCal = Math.round(totalCalories * 0.25);
  const lCal = Math.round(totalCalories * 0.35);
  const dCal = Math.round(totalCalories * 0.30);
  const sCal = Math.round(totalCalories * 0.10);

  if (diet === 'intermittent_fasting') {
    return [
      {
        mealType: 'Breakfast',
        name: 'Zero-Calorie Fasting Elixir (Fasting Window: 8 AM)',
        calories: 10,
        protein: 0,
        carbs: 2,
        fat: 0,
        ingredients: ['Green tea or black specialty coffee', '1 squeeze fresh lemon', 'Pinch of Himalayan pink salt', 'Water (500ml)'],
        preparationMinutes: 3,
        tip: 'Maintains fasted state, blunts hunger grehlin spikes, and supports mineral hydration.'
      },
      {
        mealType: 'Lunch',
        name: '12:00 PM Fast-Breaker: Mediterranean Grilled Protein Bowl',
        calories: lCal + Math.round(bCal * 0.5),
        protein: Math.round(targetProtein * 0.45),
        carbs: 45,
        fat: 16,
        ingredients: ['200g Lean Chicken Breast or Tofu', '1 cup steamed quinoa', 'Cucumber & cherry tomato salad', '1 tbsp extra virgin olive oil', 'Lemon herb dressing'],
        preparationMinutes: 15,
        tip: 'Breaking your fast with clean lean protein and fibrous greens prevents insulin spikes and afternoon fatigue.'
      },
      {
        mealType: 'Dinner',
        name: '7:00 PM Metabolic Dinner: Herb-Baked Salmon & Greens',
        calories: dCal + Math.round(bCal * 0.5) - 30,
        protein: Math.round(targetProtein * 0.42),
        carbs: 30,
        fat: 20,
        ingredients: ['180g Wild Salmon fillet', '2 cups roasted asparagus & broccoli', 'Small baked sweet potato (120g)', 'Fresh dill & garlic seasoning'],
        preparationMinutes: 20,
        tip: 'Omega-3 fatty acids optimize cellular leptin sensitivity and promote fat oxidation overnight.'
      },
      {
        mealType: 'Metabolic Snack',
        name: '3:30 PM Pre-Workout Energy Crunch',
        calories: sCal + 20,
        protein: Math.round(targetProtein * 0.13),
        carbs: 18,
        fat: 6,
        ingredients: ['Greek Yogurt (0% fat, 150g)', 'Handful of organic blueberries (50g)', '10 crushed raw almonds'],
        preparationMinutes: 2,
        tip: 'Fast-digesting leucine fuels protein synthesis right before your 15-minute home workout.'
      }
    ];
  }

  if (diet === 'vegetarian') {
    return [
      {
        mealType: 'Breakfast',
        name: 'High-Protein Golden Chia & Oatmeal Bowl',
        calories: bCal,
        protein: Math.round(targetProtein * 0.25),
        carbs: 48,
        fat: 10,
        ingredients: ['50g Rolled oats', '1 scoop plant protein powder', '1 tbsp chia seeds', 'Unsweetened almond milk', 'Cinnamon dusting'],
        preparationMinutes: 5,
        tip: 'Complex beta-glucans in oats stabilize blood sugar for up to 4 hours.'
      },
      {
        mealType: 'Lunch',
        name: 'Crispy Tempeh & Edamame Quinoa Power Salad',
        calories: lCal,
        protein: Math.round(targetProtein * 0.38),
        carbs: 52,
        fat: 15,
        ingredients: ['150g Marinated organic tempeh', '1/2 cup shelled edamame', '1 cup mixed leafy greens', '1/2 cup cooked quinoa', 'Tahini lemon drizzle'],
        preparationMinutes: 15,
        tip: 'Fermented tempeh supports gut microbiome diversity for enhanced fat loss.'
      },
      {
        mealType: 'Dinner',
        name: 'Lentil & Spinach Coconut Curry Stew',
        calories: dCal,
        protein: Math.round(targetProtein * 0.30),
        carbs: 45,
        fat: 14,
        ingredients: ['1 cup cooked green/brown lentils', '2 cups fresh baby spinach', 'Light coconut milk (100ml)', 'Ginger, turmeric, cumin spice blend'],
        preparationMinutes: 20,
        tip: 'Turmeric curcumin is a natural anti-inflammatory agent that accelerates muscle recovery.'
      },
      {
        mealType: 'Metabolic Snack',
        name: 'Roasted Spicy Chickpeas & Apple Slices',
        calories: sCal,
        protein: Math.round(targetProtein * 0.07),
        carbs: 22,
        fat: 4,
        ingredients: ['1/2 cup roasted crunchy chickpeas', '1 green crisp granny smith apple'],
        preparationMinutes: 2,
        tip: 'High dietary fiber keeps you satiated without spiking calories.'
      }
    ];
  }

  // Default: Balanced High-Protein Deficit
  return [
    {
      mealType: 'Breakfast',
      name: 'Fluffy Spinach & Egg White Power Scramble',
      calories: bCal,
      protein: Math.round(targetProtein * 0.30),
      carbs: 28,
      fat: 12,
      ingredients: ['3 Egg whites + 1 whole pasture egg', '1 cup baby spinach & diced bell peppers', '1 slice sourdough or whole grain toast', '1/4 avocado'],
      preparationMinutes: 8,
      tip: 'High morning protein suppresses the hunger hormone ghrelin all morning.'
    },
    {
      mealType: 'Lunch',
      name: 'Grilled Lemon-Herb Chicken & Sweet Potato Bowl',
      calories: lCal,
      protein: Math.round(targetProtein * 0.38),
      carbs: 48,
      fat: 14,
      ingredients: ['180g Skinless chicken breast', '150g Roasted sweet potato cubes', 'Mixed greens with cherry tomatoes', '1 tsp olive oil & balsamic glaze'],
      preparationMinutes: 15,
      tip: 'Clean carbohydrates restock liver glycogen without spilling over into fat storage.'
    },
    {
      mealType: 'Dinner',
      name: 'Pan-Seared White Fish & Zucchini Ribbons',
      calories: dCal,
      protein: Math.round(targetProtein * 0.25),
      carbs: 22,
      fat: 11,
      ingredients: ['200g Cod or Tilapia fillet', '2 spiralized zucchinis sautéed in garlic', 'Steamed green beans (100g)', 'Fresh lemon & cracked pepper'],
      preparationMinutes: 15,
      tip: 'Ultra-lean white fish gives maximum protein density with minimal calorie density for evening leaning.'
    },
    {
      mealType: 'Metabolic Snack',
      name: 'Greek Yogurt & Berry Antioxidant Parfait',
      calories: sCal,
      protein: Math.round(targetProtein * 0.07),
      carbs: 16,
      fat: 2,
      ingredients: ['170g Non-fat Plain Greek Yogurt', '1/2 cup fresh raspberries', 'Dash of pure vanilla extract'],
      preparationMinutes: 3,
      tip: 'Slow-digesting casein protein protects muscle tone while you sleep.'
    }
  ];
}
