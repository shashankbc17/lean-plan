export interface ExercisePhase {
  step: number;
  title: string;
  action: string;
  bodyCues: string[];
  breathing: string;
  focusMuscles: string;
}

export interface KinematicGuide {
  summaryMotion: string;
  commonMistake: string;
  proFix: string;
  tempoAdvice: string;
  phases: ExercisePhase[];
  keyJointCheckpoints: { joint: string; rule: string; angle: string }[];
}

export const EXERCISE_KINEMATICS: Record<string, KinematicGuide> = {
  // 1. High Knees
  'ex-1': {
    summaryMotion: 'Explosive vertical knee drives in place with synchronized counter-arm pumping.',
    commonMistake: 'Leaning backward while driving knees up, which strains the lower lumbar spine.',
    proFix: 'Maintain a 5° forward athletic torso lean and drive knees up using lower abdominal power.',
    tempoAdvice: 'Rapid cadence (1.2 strides/second) with spring-loaded balls-of-feet contact.',
    phases: [
      {
        step: 1,
        title: 'Starting Stance',
        action: 'Stand upright, feet hip-width apart, arms bent 90° at elbows in athletic runner stance.',
        bodyCues: ['Ribcage down', 'Core engaged', 'Shoulders relaxed'],
        breathing: 'Inhale through nose to prime oxygen intake',
        focusMuscles: 'Core & Hip Flexors'
      },
      {
        step: 2,
        title: 'Explosive Drive Up',
        action: 'Drive right knee upward toward hip height (90° bend) while pumping left arm forward.',
        bodyCues: ['Thigh parallel to floor', 'Dorsiflex right ankle (toes up)', 'Brace obliques'],
        breathing: 'Sharp rhythmic exhale',
        focusMuscles: 'Lower Abdominals & Quads'
      },
      {
        step: 3,
        title: 'Spring Transition',
        action: 'Land lightly on the ball of right foot without heels slamming, immediately loading the left side.',
        bodyCues: ['Knee stays soft (spring absorption)', 'Stay upright, zero lumbar arch'],
        breathing: 'Inhale briefly between transitions',
        focusMuscles: 'Calves & Glutes'
      },
      {
        step: 4,
        title: 'Opposite Leg Sprint',
        action: 'Explosively power left knee upward while pumping right arm forward at high cadence.',
        bodyCues: ['Eyes focused forward', 'Steady sprint rhythm'],
        breathing: 'Rhythmic boxer breathing (exhale on each peak)',
        focusMuscles: 'Cardiovascular & Rectus Abdominis'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Hips', rule: 'Drive thigh to 90° parallel plane', angle: '90°' },
      { joint: 'Torso', rule: 'Slight 5° forward lean, zero backward arch', angle: '85°-90°' },
      { joint: 'Foot Strike', rule: 'Ball of foot spring rebound', angle: 'Soft 15°' }
    ]
  },

  // 2. Plank Knee-to-Elbow
  'ex-2': {
    summaryMotion: 'Push-up plank position with cross-body knee tucks to contract transverse abs and obliques.',
    commonMistake: 'Hips sagging toward floor or glutes piked high in the air.',
    proFix: 'Tuck pelvis slightly (posterior pelvic tilt) and imagine balancing a cup of water on your lower back.',
    tempoAdvice: '2 seconds forward drive, 1 second peak squeeze, 2 seconds controlled return.',
    phases: [
      {
        step: 1,
        title: 'Rigid Plank Setup',
        action: 'Place hands directly under shoulders, fingers spread, feet together, body forming a straight plank line.',
        bodyCues: ['Gaze 6 inches ahead of hands', 'Squeeze glutes & quads', 'Shoulder blades flat'],
        breathing: 'Deep diaphragmatic inhale',
        focusMuscles: 'Full Core & Serratus Anterior'
      },
      {
        step: 2,
        title: 'Cross-Body Knee Tuck',
        action: 'Lift right foot and drive right knee diagonally across toward the left elbow.',
        bodyCues: ['Keep hips level with shoulders', 'Round upper spine slightly for extra core burn'],
        breathing: 'Forced exhale as knee approaches elbow',
        focusMuscles: 'Internal & External Obliques'
      },
      {
        step: 3,
        title: 'Peak Contraction Hold',
        action: 'Pause for 1 second with knee 1 inch from elbow, maximizing waist-taper tension.',
        bodyCues: ['Squeeze navel toward spine', 'Keep base left leg locked rigid'],
        breathing: 'Hold breath for half second at peak crunch',
        focusMuscles: 'Transverse Abdominis'
      },
      {
        step: 4,
        title: 'Controlled Reset',
        action: 'Smoothly extend right leg back to starting high plank before switching to the left leg.',
        bodyCues: ['Zero hip swaying', 'Reset pelvic alignment'],
        breathing: 'Smooth inhale on reset',
        focusMuscles: 'Core Stability'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Shoulders & Wrists', rule: 'Vertical stack 90° angle', angle: '90°' },
      { joint: 'Spine & Hips', rule: 'Straight line from heels to ears', angle: '180°' },
      { joint: 'Knee Diagonal', rule: 'Drive across centerline', angle: '45° Cross' }
    ]
  },

  // 3. Bicycle Crunches
  'ex-3': {
    summaryMotion: 'Alternating rotational core crunches combining spinal flexion and deep oblique torque.',
    commonMistake: 'Yanking on the back of the neck with hands, which causes cervical strain.',
    proFix: 'Keep fingertips light on temples with elbows flared wide, and rotate from the thoracic ribcage.',
    tempoAdvice: 'Deliberate cadence: 2 seconds per side. No jerky rushing.',
    phases: [
      {
        step: 1,
        title: 'Supine Hollow Base',
        action: 'Lie flat on back, press lower back firmly into the floor with zero gap underneath.',
        bodyCues: ['Fingertips beside ears', 'Elbows wide', 'Knees bent at 90° in tabletop'],
        breathing: 'Inhale deeply through belly',
        focusMuscles: 'Lower Abdominals'
      },
      {
        step: 2,
        title: 'Diagonal Rotation',
        action: 'Peel shoulder blades off floor and rotate left shoulder (not just elbow) toward right knee.',
        bodyCues: ['Extend left leg out straight at 45°', 'Keep right knee fixed at 90°'],
        breathing: 'Exhale fully as torso twists',
        focusMuscles: 'Obliques & Upper Rectus'
      },
      {
        step: 3,
        title: 'Peak Oblique Flex',
        action: 'Hold the contraction for 1 count, feeling the rotational burn across the waistline.',
        bodyCues: ['Maintain elbow flare', 'Keep lower back glued to floor'],
        breathing: 'Empty all air from lungs',
        focusMuscles: 'Deep Transverse Core'
      },
      {
        step: 4,
        title: 'Fluid Reversal',
        action: 'Rotate smoothly through center to opposite side without letting shoulder blades touch the ground.',
        bodyCues: ['Continuous core tension', 'Switch leg extension simultaneously'],
        breathing: 'Inhale during mid-transition, exhale on next twist',
        focusMuscles: 'Full Abdominal Wall'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Lower Back', rule: 'Zero gap between lumbar spine and floor', angle: '0° Flat' },
      { joint: 'Extended Leg', rule: 'Leg hovering above floor for leverage', angle: '45°' },
      { joint: 'Torso Rotation', rule: 'Twist from mid-spine ribcage', angle: '30° Rotation' }
    ]
  },

  // 4. Mountain Climbers
  'ex-4': {
    summaryMotion: 'Continuous rapid horizontal sprinting in a locked push-up plank.',
    commonMistake: 'Bouncing hips up and down like a pogo stick.',
    proFix: 'Lock your glutes and core down so hips remain at shoulder level throughout the entire burst.',
    tempoAdvice: 'Fast & rhythmic: 2 knee drives per second while keeping upper body completely still.',
    phases: [
      {
        step: 1,
        title: 'Locked Plank Anchor',
        action: 'Grip floor firmly with hands under shoulders, spine neutral, heels driving back.',
        bodyCues: ['Press floor away with palms', 'Lock shoulder blades in place'],
        breathing: 'Steady rhythmic breathing',
        focusMuscles: 'Shoulders & Core'
      },
      {
        step: 2,
        title: 'Piston Knee Drive',
        action: 'Drive right knee straight into chest without letting toes scrape the ground.',
        bodyCues: ['Hips stay level', 'Right knee stops just below chest'],
        breathing: 'Exhale sharply on forward drive',
        focusMuscles: 'Lower Abs & Hip Flexors'
      },
      {
        step: 3,
        title: 'Mid-Air Leg Switch',
        action: 'Quickly shoot right leg back while simultaneously driving left knee forward in a piston motion.',
        bodyCues: ['Upper torso stays totally motionless', 'Keep weight balanced over hands'],
        breathing: 'Continuous rhythmic breaths',
        focusMuscles: 'Cardio & Deep Core'
      },
      {
        step: 4,
        title: 'Cadence Flow',
        action: 'Maintain continuous rhythmic turnover, feeling the metabolic heat building in core and shoulders.',
        bodyCues: ['Do not let hips hike above shoulders', 'Land only on balls of feet'],
        breathing: 'Paced breath: Inhale 2 strides, exhale 2 strides',
        focusMuscles: 'Full Metabolic Shred'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Shoulder Stack', rule: 'Hands directly underneath shoulders', angle: '90°' },
      { joint: 'Hip Plane', rule: 'Hips level with shoulder blade line', angle: '180°' },
      { joint: 'Knee Depth', rule: 'Drive knee toward chin/chest', angle: '90° Flexion' }
    ]
  },

  // 5. Flutter Kicks
  'ex-5': {
    summaryMotion: 'Low-amplitude alternating leg scissor flutters in a hollow-body supine position.',
    commonMistake: 'Kicking legs too high (above 60°) which removes tension from the lower abs.',
    proFix: 'Keep kicks short (6 to 10 inches off floor) and push your lower lumbar into the mat continuously.',
    tempoAdvice: 'Quick steady tempo: 2 flutter kicks per second with pointed toes.',
    phases: [
      {
        step: 1,
        title: 'Hollow Anchor Set',
        action: 'Lie flat, place hands along hips or palms under tailbone for lumbar support.',
        bodyCues: ['Press navel down', 'Tuck chin slightly to engage upper abs'],
        breathing: 'Inhale into chest',
        focusMuscles: 'Lower Abdominals'
      },
      {
        step: 2,
        title: 'Leg Hover & Point',
        action: 'Raise both legs 6 inches off the floor with knees straight and toes pointed forward.',
        bodyCues: ['Locked knees', 'Zero arch in lower back'],
        breathing: 'Smooth rhythmic breaths',
        focusMuscles: 'Hip Flexors & Core'
      },
      {
        step: 3,
        title: 'Scissor Elevation',
        action: 'Raise right foot 6 inches higher while lowering left foot to 2 inches off ground.',
        bodyCues: ['Small precise flutter movements', 'Movement originates from hips, not knees'],
        breathing: 'Exhale smoothly',
        focusMuscles: 'Rectus Abdominis'
      },
      {
        step: 4,
        title: 'Continuous Flutter',
        action: 'Alternate legs rhythmically without allowing feet to touch the floor until the set completes.',
        bodyCues: ['Maintain hollow body tension', 'Keep quads flexed'],
        breathing: 'Steady continuous breathing',
        focusMuscles: 'Lower Stomach Flattening'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Hover Height', rule: 'Legs remain 4-10 inches off ground', angle: '15°-25°' },
      { joint: 'Knee Lock', rule: 'Knees locked straight for lever arm', angle: '180°' },
      { joint: 'Lumbar Spine', rule: 'Firmly pressed into floor', angle: '0° Flat' }
    ]
  },

  // 6. Pulse Squats
  'ex-t1': {
    summaryMotion: 'Deep parallel squat with a rhythmic bottom pulse before driving explosively through heels.',
    commonMistake: 'Knees caving inward (valgus collapse) or heels lifting off the floor.',
    proFix: 'Screw feet into floor, push knees outward over your small toes, and keep chest proud.',
    tempoAdvice: 'Down in 2 seconds, pulse twice (1 second), explode up in 1 second.',
    phases: [
      {
        step: 1,
        title: 'Shoulder-Width Stance',
        action: 'Stand with feet slightly wider than shoulders, toes angled out 15°, hands clasped at chest.',
        bodyCues: ['Chest lifted proud', 'Core braced', 'Weight centered over midfoot'],
        breathing: 'Deep diaphragmatic inhale',
        focusMuscles: 'Posture & Core'
      },
      {
        step: 2,
        title: 'Hip Hinge & Descent',
        action: 'Push hips back like sitting into a low chair, bending knees until thighs are parallel to ground.',
        bodyCues: ['Knees track over 2nd & 3rd toes', 'Spine straight at 45° forward angle', 'Heels firmly planted'],
        breathing: 'Hold breath through descent',
        focusMuscles: 'Quads & Glutes'
      },
      {
        step: 3,
        title: 'The Bottom Double Pulse',
        action: 'At parallel depth, pulse upward 2 inches and back down twice without standing up.',
        bodyCues: ['Keep constant time-under-tension', 'Do not bounce on knee joints'],
        breathing: 'Short controlled breath',
        focusMuscles: 'Gluteus Maximus & Quad Burn'
      },
      {
        step: 4,
        title: 'Explosive Heel Drive',
        action: 'Drive forcefully through your heels to stand fully upright, squeezing glutes hard at the top.',
        bodyCues: ['Lock hips forward', 'Do not hyperextend lower back'],
        breathing: 'Powerful exhale at top of rep',
        focusMuscles: 'Glutes & Posterior Chain'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Hip Depth', rule: 'Thighs parallel to floor (crease below knee)', angle: '90°' },
      { joint: 'Knee Track', rule: 'Knees push outwards along foot line', angle: 'Aligned' },
      { joint: 'Chest Angle', rule: 'Torso matches shin angle for balance', angle: '45°' }
    ]
  },

  // 7. Curtsy Lunges
  'ex-t2': {
    summaryMotion: 'Cross-behind diagonal lunge targeting the outer glute medius and inner thigh contour.',
    commonMistake: 'Twisting the front knee inward or stepping too far across.',
    proFix: 'Keep front foot and front knee pointed dead straight ahead; only the rear leg steps across.',
    tempoAdvice: 'Controlled descent (2s), brief pause (1s), drive up through front heel (1s).',
    phases: [
      {
        step: 1,
        title: 'Tall Upright Stance',
        action: 'Stand tall with feet hip-width apart, hands on hips for stability, shoulders square.',
        bodyCues: ['Hips square forward', 'Core braced', 'Eyes looking forward'],
        breathing: 'Inhale to prepare',
        focusMuscles: 'Core Stability'
      },
      {
        step: 2,
        title: 'Diagonal Cross Step',
        action: 'Step left leg diagonally behind your right leg at a 45° angle, keeping front right foot forward.',
        bodyCues: ['Front knee stays aligned over front ankle', 'Weight stays on front right heel'],
        breathing: 'Smooth controlled inhale',
        focusMuscles: 'Outer Glutes & Adductors'
      },
      {
        step: 3,
        title: 'Depth & Bow Pause',
        action: 'Bend both knees until front thigh is parallel to floor and back knee hovers 2 inches above ground.',
        bodyCues: ['Torso stays tall and upright', 'Feel intense stretch and burn in outer right hip'],
        breathing: 'Hold for split second',
        focusMuscles: 'Gluteus Medius'
      },
      {
        step: 4,
        title: 'Front Heel Push',
        action: 'Push through the right front heel to return cleanly to standing, then switch legs.',
        bodyCues: ['Do not drag back foot', 'Stand tall and squeeze glutes'],
        breathing: 'Exhale forcefully to standing',
        focusMuscles: 'Hamstrings & Glutes'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Front Knee', rule: 'Directly over ankle, zero inward wobble', angle: '90°' },
      { joint: 'Back Knee', rule: 'Hovers 2 inches above floor', angle: '90°' },
      { joint: 'Hips', rule: 'Pelvis stays squared forward', angle: 'Square 0°' }
    ]
  },

  // 8. Glute Bridge
  'ex-t3': {
    summaryMotion: 'Supine pelvic thrust with 3-second peak glute contraction to sculpt posterior chain.',
    commonMistake: 'Arching through the lower lumbar spine instead of extending from hips.',
    proFix: 'Tuck ribcage down, keep chin tucked, and push through heels so glutes do 100% of the work.',
    tempoAdvice: 'Lift in 1s, hold and squeeze for 3 seconds, lower in 2 seconds.',
    phases: [
      {
        step: 1,
        title: 'Flat Floor Setup',
        action: 'Lie on back, bend knees at 90°, place feet flat hip-width apart about 8 inches from glutes.',
        bodyCues: ['Arms flat at sides', 'Flatten lower back onto mat', 'Toes pointing straight'],
        breathing: 'Deep belly inhale',
        focusMuscles: 'Lower Back & Core'
      },
      {
        step: 2,
        title: 'Pelvic Lift Off',
        action: 'Drive through your heels, peeling hips off the floor until body forms a straight ramp from knees to shoulders.',
        bodyCues: ['Do not push through toes', 'Keep knees parallel (do not let them splay)'],
        breathing: 'Exhale as hips elevate',
        focusMuscles: 'Gluteus Maximus & Hamstrings'
      },
      {
        step: 3,
        title: '3-Second Peak Contraction',
        action: 'Clamp glutes together at the top for 3 full seconds. Imagine holding a coin between your glutes.',
        bodyCues: ['Ribcage stays tucked down', 'Feel burn in glutes, zero pinch in lower back'],
        breathing: 'Steady controlled breath hold',
        focusMuscles: 'Peak Glute Toning'
      },
      {
        step: 4,
        title: 'Controlled Roll Down',
        action: 'Slowly lower hips back to 1 inch above floor without resting weight, immediately initiating next rep.',
        bodyCues: ['Maintain glute engagement throughout', 'Soft tap and go'],
        breathing: 'Inhale as hips descend',
        focusMuscles: 'Posterior Chain'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Hip Extension', rule: 'Straight line from shoulders to knees', angle: '180° Bridge' },
      { joint: 'Knee Joint', rule: 'Feet placed so shins are vertical at top', angle: '90°' },
      { joint: 'Foot Drive', rule: 'Force directed entirely through heels', angle: 'Heel Anchor' }
    ]
  },

  // 9. Speed Skaters
  'ex-t4': {
    summaryMotion: 'Athletic lateral bounds leaping side-to-side with single-leg deceleration.',
    commonMistake: 'Landing with stiff straight knees, which shocks joints.',
    proFix: 'Land softly into a quarter-squat on the outside foot, loading your hip and glute like a spring.',
    tempoAdvice: 'Dynamic athletic cadence: 1 bound per second with smooth lateral sway.',
    phases: [
      {
        step: 1,
        title: 'Athletic Quarter Squat',
        action: 'Start on right leg in a slight mini squat, left leg hovering, torso tilted slightly forward.',
        bodyCues: ['Knee soft and spring-loaded', 'Core braced', 'Opposite arm ready to pump'],
        breathing: 'Inhale to load spring',
        focusMuscles: 'Right Glute & Quad'
      },
      {
        step: 2,
        title: 'Lateral Explosive Bound',
        action: 'Push laterally off the right foot and leap sideways 3 to 4 feet to the left.',
        bodyCues: ['Swing right arm across body', 'Keep hips low for balance'],
        breathing: 'Sharp exhale during bound',
        focusMuscles: 'Abductors & Calves'
      },
      {
        step: 3,
        title: 'Soft Single-Leg Landing',
        action: 'Land softly on left foot, sinking hips down to absorb force while trailing right foot taps behind.',
        bodyCues: ['Knee stays aligned over toes', 'Glute medius fires to stabilize pelvis'],
        breathing: 'Absorb with breath',
        focusMuscles: 'Outer Hip & Balance'
      },
      {
        step: 4,
        title: 'Rebound & Return',
        action: 'Immediately load the left hip and bound back to the right in a continuous skating flow.',
        bodyCues: ['Stay low like a speed skater', 'Keep head level'],
        breathing: 'Rhythmic breath per bound',
        focusMuscles: 'Agility & High Caloric Burn'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Landing Knee', rule: 'Absorbs landing into soft quarter squat', angle: '120°-135°' },
      { joint: 'Torso Angle', rule: 'Athletic forward hinge', angle: '45°' },
      { joint: 'Lateral Distance', rule: '3-4 feet controlled jump', angle: 'Lateral Bound' }
    ]
  },

  // 10. Jumping Jacks to Cross Punches
  'ex-fb1': {
    summaryMotion: 'Dynamic cardio combination: 2 jumping jacks immediately followed by 4 sharp boxing punches.',
    commonMistake: 'Flipping arms lazily without pivoting hips on punches.',
    proFix: 'Pivot on the ball of rear foot and rotate your hip into each punch for full-body rotational burn.',
    tempoAdvice: 'High energy: 2 jacks (2s) -> 4 punches (1.5s) -> Repeat.',
    phases: [
      {
        step: 1,
        title: 'Jack Star Jump',
        action: 'Jump feet wide while clapping arms overhead in a full star formation.',
        bodyCues: ['Land soft on balls of feet', 'Arms sweep in full circle', 'Core tight'],
        breathing: 'Inhale on jump',
        focusMuscles: 'Deltoids & Calves'
      },
      {
        step: 2,
        title: 'Jack Reset to Fight Stance',
        action: 'Jump feet back together, landing immediately in athletic boxing stance with hands guarding chin.',
        bodyCues: ['Hands at cheekbone height', 'Knees bent slightly', 'Chin tucked'],
        breathing: 'Quick sharp exhale',
        focusMuscles: 'Agility & Coordination'
      },
      {
        step: 3,
        title: '1-2 Cross Punch Combo',
        action: 'Throw a sharp lead jab followed by a powerful cross punch, pivoting your rear hip and foot.',
        bodyCues: ['Turn knuckles over at full extension', 'Rotate hips to generate core power'],
        breathing: 'Sharp "tsh-tsh" boxing exhales',
        focusMuscles: 'Shoulders, Chest & Obliques'
      },
      {
        step: 4,
        title: '3-4 Combo Finish & Loop',
        action: 'Throw 2 more alternating cross punches with full extension, then immediately burst into next jumping jack.',
        bodyCues: ['Snap punches back to chin', 'Zero resting delay between combos'],
        breathing: 'Exhale on final punch, inhale into next jack',
        focusMuscles: 'Full Body Cardio Shred'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Punch Extension', rule: 'Arm extends 95% straight without hyperextending elbow', angle: '175°' },
      { joint: 'Hip Pivot', rule: 'Rear foot squashes bug to rotate hip', angle: '45° Pivot' },
      { joint: 'Jack Stance', rule: 'Feet land 1.5x shoulder width', angle: 'Star Stance' }
    ]
  },

  // 11. Push-Up to T-Spine
  'ex-fb2': {
    summaryMotion: 'Full bodyweight push-up transitioning smoothly into a side plank with rotational arm reach.',
    commonMistake: 'Flaring elbows out at 90° (T-shape) which pinches rotator cuffs.',
    proFix: 'Tuck elbows at 45° to torso (arrowhead shape) and rotate hips and feet together as one unit.',
    tempoAdvice: '2 seconds lowering, 1 second press, 2 seconds thoracic rotation hold.',
    phases: [
      {
        step: 1,
        title: 'High Plank Arrowhead',
        action: 'Hands under shoulders, fingers spread, body rigid from heels to crown of head.',
        bodyCues: ['Squeeze glutes & abs', 'Tuck chin', 'Scapulae engaged'],
        breathing: 'Deep inhale to set chest',
        focusMuscles: 'Pectorals & Core'
      },
      {
        step: 2,
        title: 'Controlled Chest Lowering',
        action: 'Lower chest until 2 inches from floor, keeping elbows at a 45° arrowhead angle to torso.',
        bodyCues: ['Zero lower back sag', 'Forearms remain vertical'],
        breathing: 'Inhale on descent',
        focusMuscles: 'Pectoralis Major & Triceps'
      },
      {
        step: 3,
        title: 'Press & Thoracic Pivot',
        action: 'Press floor away to high plank, then rotate torso raising right arm straight toward the ceiling.',
        bodyCues: ['Roll onto sides of feet', 'Stack shoulders vertically', 'Look up at top hand'],
        breathing: 'Powerful exhale through the press and reach',
        focusMuscles: 'Anterior Deltoids & Obliques'
      },
      {
        step: 4,
        title: 'T-Spine Extension & Return',
        action: 'Hold the side T-plank for 1 count, then rotate right hand back to floor and repeat on left side.',
        bodyCues: ['Keep hips high (do not sag in side plank)', 'Return with control'],
        breathing: 'Smooth inhale as hand returns',
        focusMuscles: 'Rotational Core & Scapular T-Spine'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Elbows', rule: 'Tucked at 45° arrowhead angle, not flared', angle: '45°' },
      { joint: 'T-Spine Reach', rule: 'Arms form 180° vertical cross line', angle: '180° Vertical' },
      { joint: 'Plank Line', rule: 'Heels, hips, and shoulders aligned', angle: '180°' }
    ]
  },

  // 12. Squat Thruster Reach
  'ex-fb4': {
    summaryMotion: 'Compound power movement combining a full deep squat with an explosive overhead ceiling push.',
    commonMistake: 'Reaching overhead before legs have fully extended, losing lower-body power transfer.',
    proFix: 'Drive hard through your legs first; use the vertical upward momentum to launch arms overhead.',
    tempoAdvice: 'Smooth 2s descent, explosive 1s upward rocket press.',
    phases: [
      {
        step: 1,
        title: 'Loaded Rack Stance',
        action: 'Feet shoulder-width apart, elbows bent with hands held at collarbone height like holding weights.',
        bodyCues: ['Chest tall', 'Core braced', 'Weight distributed evenly on feet'],
        breathing: 'Inhale deep into abdomen',
        focusMuscles: 'Full Body Alignment'
      },
      {
        step: 2,
        title: 'Deep Power Squat',
        action: 'Squat hips back and down to parallel depth while keeping elbows tucked inside knees.',
        bodyCues: ['Knees track over toes', 'Back stays neutral at 45°', 'Keep hands at shoulders'],
        breathing: 'Hold air in core to stabilize spine',
        focusMuscles: 'Quads & Glutes'
      },
      {
        step: 3,
        title: 'Explosive Leg Drive',
        action: 'Drive violently through heels, transferring the kinetic energy straight up through your hips and spine.',
        bodyCues: ['Squeeze glutes at top', 'Stand tall'],
        breathing: 'Forceful explosive exhale',
        focusMuscles: 'Hips & Posterior Chain'
      },
      {
        step: 4,
        title: 'Overhead Power Reach',
        action: 'Extend arms straight overhead toward ceiling, reaching high with palms facing forward.',
        bodyCues: ['Biceps beside ears', 'Ribcage down (do not arch lower back)'],
        breathing: 'Empty lungs at top reach, then lower hands as you squat into next rep',
        focusMuscles: 'Shoulders, Triceps & Upper Back'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Squat Depth', rule: 'Thighs parallel to floor', angle: '90°' },
      { joint: 'Overhead Lockout', rule: 'Arms vertically stacked over shoulders', angle: '180° Straight' },
      { joint: 'Spine Alignment', rule: 'Zero lumbar hyperextension during overhead reach', angle: 'Neutral' }
    ]
  },

  // 13. Active Plank Shoulder Taps
  'ex-fb5': {
    summaryMotion: 'High plank anti-rotation protocol holding hips dead still while alternating hand-to-shoulder taps.',
    commonMistake: 'Rocking hips from side to side like a boat in rough water.',
    proFix: 'Widen your feet to slightly wider than shoulder width to create a stable tripod base.',
    tempoAdvice: 'Slow & controlled: 1 tap every 2 seconds. The slower you move, the harder the abs work.',
    phases: [
      {
        step: 1,
        title: 'Wide-Base Plank Setup',
        action: 'High push-up position with hands under shoulders and feet set slightly wider than shoulder width.',
        bodyCues: ['Feet wide for tripod stability', 'Squeeze glutes rock hard', 'Tuck pelvis'],
        breathing: 'Inhale deeply',
        focusMuscles: 'Core Stability'
      },
      {
        step: 2,
        title: 'Weight Shift & Lift',
        action: 'Shift weight smoothly into your left palm without allowing your hips to rotate or tilt.',
        bodyCues: ['Push floor away with left hand', 'Keep hips parallel to floor'],
        breathing: 'Hold steady breath',
        focusMuscles: 'Left Shoulder & Obliques'
      },
      {
        step: 3,
        title: 'Opposite Shoulder Tap',
        action: 'Lift right hand and tap left shoulder softly for 1 count, keeping torso completely motionless.',
        bodyCues: ['Imagine a glass of hot tea on your lower back', 'Zero torso wobble'],
        breathing: 'Exhale softly during tap',
        focusMuscles: 'Anti-Rotational Core'
      },
      {
        step: 4,
        title: 'Smooth Hand Reset',
        action: 'Place right hand back down quietly under shoulder, stabilize for a half second, then repeat with left hand.',
        bodyCues: ['Quiet soft hand placement', 'Reset core brace before next side'],
        breathing: 'Inhale on reset',
        focusMuscles: 'Full Transverse Abdominal Wall'
      }
    ],
    keyJointCheckpoints: [
      { joint: 'Hip Rotation', rule: 'Zero degree rotation (hips locked parallel to floor)', angle: '0° Tilt' },
      { joint: 'Foot Stance', rule: 'Feet slightly wider than shoulders for stability', angle: 'Wide Base' },
      { joint: 'Base Arm', rule: 'Support arm vertical stack', angle: '90°' }
    ]
  }
};

export function getExerciseKinematics(id: string): KinematicGuide {
  return EXERCISE_KINEMATICS[id] || EXERCISE_KINEMATICS['ex-1'];
}
