import fs from 'fs';

const routines = [
  // Belly Shred (5 exercises)
  { id: 'ex-1', name: 'High Knees', m: 'male-Bodyweight-high-knees-front.mp4', f: 'female-Bodyweight-high-knees-front.mp4' },
  { id: 'ex-2', name: 'Plank Knee Drive', m: 'male-Bodyweight-plank-knee-drive-front.mp4', f: 'female-Bodyweight-plank-knee-drive-front.mp4' },
  { id: 'ex-3', name: 'Bicycle Crunch', m: 'male-Bodyweight-bicycle-crunch-front.mp4', f: 'female-Bodyweight-bicycle-crunch-front.mp4' },
  { id: 'ex-4', name: 'Mountain Climbers', m: 'male-Bodyweight-mountain-climbers-front.mp4', f: 'female-Bodyweight-mountain-climbers-front.mp4' },
  { id: 'ex-5', name: 'Flutter Kicks', m: 'male-Bodyweight-flutter-kicks-front.mp4', f: 'female-Bodyweight-flutter-kicks-front.mp4' },

  // Lean Legs (4 exercises)
  { id: 'ex-t1', name: 'Bodyweight Squat', m: 'male-Bodyweight-bodyweight-squat-front.mp4', f: 'female-Bodyweight-bodyweight-squat-front.mp4' },
  { id: 'ex-t2', name: 'Curtsy Lunge', m: 'male-Bodyweight-curtsy-lunge-front.mp4', f: 'female-Bodyweight-curtsy-lunge-front.mp4' },
  { id: 'ex-t3', name: 'Glute Bridge', m: 'male-Bodyweight-glute-bridge-front.mp4', f: 'female-Bodyweight-glute-bridge-front.mp4' },
  { id: 'ex-t4', name: 'Lateral Speed Skaters', m: 'male-Bodyweight-speed-skaters-front.mp4', f: 'female-Bodyweight-speed-skaters-front.mp4' },

  // Full Body (5 exercises)
  { id: 'ex-fb1', name: 'Jumping Jacks to Cross Punches', m: 'male-Bodyweight-jumping-jacks-punches-front.mp4', f: 'female-Bodyweight-jumping-jacks-punches-front.mp4' },
  { id: 'ex-fb2', name: 'Push-Up', m: 'male-Bodyweight-push-up-front.mp4', f: 'female-Bodyweight-push-up-front.mp4' },
  { id: 'ex-fb3', name: 'Mountain Climbers', m: 'male-Bodyweight-mountain-climbers-front.mp4', f: 'female-Bodyweight-mountain-climbers-front.mp4' },
  { id: 'ex-fb4', name: 'Bodyweight Squat', m: 'male-Bodyweight-bodyweight-squat-front.mp4', f: 'female-Bodyweight-bodyweight-squat-front.mp4' },
  { id: 'ex-fb5', name: 'Plank Shoulder Taps', m: 'male-Bodyweight-plank-shoulder-taps-front.mp4', f: 'female-Bodyweight-plank-shoulder-taps-front.mp4' }
];

console.log('========================================================================');
console.log('AUDIT OF ALL WORKOUT ROUTINE VIDEO ASSETS (MALE & FEMALE)');
console.log('========================================================================');

let allOk = true;
for (const item of routines) {
  const mPath = 'public/videos/' + item.m;
  const fPath = 'public/videos/' + item.f;

  const mExists = fs.existsSync(mPath);
  const fExists = fs.existsSync(fPath);

  const mSize = mExists ? fs.statSync(mPath).size : 0;
  const fSize = fExists ? fs.statSync(fPath).size : 0;

  const mHeader = mExists ? fs.readFileSync(mPath).subarray(4, 12).toString('utf-8') : 'N/A';
  const fHeader = fExists ? fs.readFileSync(fPath).subarray(4, 12).toString('utf-8') : 'N/A';

  const mValid = mExists && mSize > 1000000 && mHeader.startsWith('ftyp');
  const fValid = fExists && fSize > 1000000 && fHeader.startsWith('ftyp');

  console.log('[' + item.id + '] ' + item.name + ':');
  console.log('  - MALE:   ' + (mValid ? 'PASS' : 'FAIL') + ' | ' + mSize.toLocaleString() + ' bytes | Header: ' + mHeader + ' (' + item.m + ')');
  console.log('  - FEMALE: ' + (fValid ? 'PASS' : 'FAIL') + ' | ' + fSize.toLocaleString() + ' bytes | Header: ' + fHeader + ' (' + item.f + ')');

  if (!mValid || !fValid) allOk = false;
}

console.log('========================================================================');
console.log('OVERALL STATUS:', allOk ? '100% COMPLETE & VERIFIED!' : 'SOME ASSETS MISSING');
console.log('========================================================================');
