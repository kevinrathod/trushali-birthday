// ============================================================================
//  🎀  EVERYTHING YOU MAY WANT TO CHANGE LIVES IN THIS ONE FILE  🎀
// ============================================================================
//  - Names, login, birthday date
//  - Love letter + birthday message
//  - Photos & captions (put the image files in public/assets/photos/)
//  - Timeline memories
//  - Compliments, happiness-jar notes
//  - Music file, theme colours
//
//  Tip: lines starting with // are comments. Only change what is inside quotes.
// ============================================================================

const sisterName = 'Trushali';

const birthdayConfig = {
  // ---------- Names & date ----------
  sisterName,
  brotherName: 'Your Brother', // shown in the small footer credit on the login page
  // Leave '' to hide the date. Otherwise use the format 'YYYY-MM-DD', e.g. '2026-11-02'
  birthdayDate: '',

  // false = every visit starts fresh from the login page (nothing is remembered).
  // true  = progress is saved in the browser so a refresh keeps her place.
  saveProgress: false,

  // ---------- Page 1: secret login ----------
  // NOTE: This is a *frontend-only* gate. Anyone who opens the browser's developer
  // tools can read these values. It is a cute surprise lock, NOT real security.
  // Never reuse a real password here.
  credentials: {
    username: 'butki',
    password: '2910',
    caseSensitive: false,
    hint: 'Hint: your username is your cutest nickname, and the password is your special day 🎂',
  },
  loginTitle: `Happiest Birthday ${sisterName}!`,
  loginSubtitle: 'A little secret is waiting for you. Unlock it to begin.',

  // ---------- Page 2: welcome ----------
  welcomeTitle: `Welcome to ${sisterName}'s Little Universe!`,
  welcomeSubtitle: 'Every star, heart and butterfly in here was made for one very special person: you.',

  // ---------- Page 3: memory matching game ----------
  // Cards flip over; match all the pairs to reveal a surprise message.
  // Each animal shows a photo if the file exists in public/assets/animals/,
  // otherwise it shows the emoji. Add or remove animals freely (6 = easy).
  memory: {
    animals: [
      { name: 'Puppy', emoji: '🐶', src: 'assets/animals/animal-01.jpg' },
      { name: 'Kitten', emoji: '🐱', src: 'assets/animals/animal-02.jpg' },
      { name: 'Bunny', emoji: '🐰', src: 'assets/animals/animal-03.jpg' },
      { name: 'Panda', emoji: '🐼', src: 'assets/animals/animal-04.jpg' },
      { name: 'Fox', emoji: '🦊', src: 'assets/animals/animal-05.jpg' },
      { name: 'Koala', emoji: '🐨', src: 'assets/animals/animal-06.jpg' },
    ],
    surpriseTitle: 'You matched every pair! 🎉',
    surpriseText: `Surprise, ${sisterName}! The next little surprise is waiting for you. 💗`,
  },

  // ---------- Page 4: love letter ----------
  letter: {
    greeting: 'To My Sweetest Bena, 💗🎀',
    paragraphs: [
      'Dear Bena,',
      'You are not just my sister, you are one of the sweetest blessings in my life. 🥹❤️',
      "I don't know if I am the best brother, but I promise that I will always try my best to make you smile, support you, tease you, and stand beside you whenever you need me. No matter how much we fight or annoy each other, you will always be my little princess. 👑🎀",
      'Life may change, we may grow older, and things may not always stay the same, but one thing will never change — you will always be my sweetest Bena, and I will always be your brother. ❤️🫂',
      'Always keep smiling, keep shining, and never forget how precious you are to me. 💗✨',
    ],
    signoff: [],
  },

  // ---------- Page 5: memory garden (photos) ----------
  // Put image files in public/assets/photos/ and list them here.
  // If a file is missing, a pretty placeholder frame is shown instead.
  // focus = which part of the picture stays visible when it is cropped into the frame
  // (e.g. 'center 20%' keeps the top, where faces usually are).
  // You can add or remove entries (5 are set up). Leave caption '' to show a gentle default.
  photos: [
    { src: 'assets/photos/photo-01.jpg', caption: '', focus: 'center 22%' },
    { src: 'assets/photos/photo-02.jpg', caption: '', focus: 'center 22%' },
    { src: 'assets/photos/photo-03.jpg', caption: '', focus: 'center 28%' },
    { src: 'assets/photos/photo-04.jpg', caption: '', focus: 'center 24%' },
    { src: 'assets/photos/photo-05.jpg', caption: '', focus: 'center 40%' },
  ],

  // ---------- Page 6: compliments (at least 25) ----------
  compliments: [
    'Your smile can brighten the cloudiest day.',
    'You make ordinary moments feel special.',
    'You are stronger than you realise.',
    'Your kindness is a quiet kind of magic.',
    'You deserve every happy thing coming your way.',
    'The world is better with you in it.',
    'Your laugh is the best sound.',
    'You are allowed to be proud of yourself today.',
    'You have a heart full of sunshine.',
    'You are braver than you think.',
    'Your dreams are worth chasing.',
    'You make people feel warm and welcome.',
    'You are one of a kind, and that is your superpower.',
    'You are growing into someone wonderful, every single day.',
    'Your happiness matters so much.',
    'You are loved far more than you know.',
    'You are the cutest little sister in the whole universe.',
    'Good things find you because you are good.',
    'You make life more fun just by being you.',
    'You are enough, exactly as you are.',
    'Your presence feels like home.',
    'You have the sweetest heart.',
    'Anything you set your mind to, you can do.',
    'You light up the room without even trying.',
    'You are a gift to everyone who knows you.',
    'Your future is bright and beautiful.',
    'You are a true princess, inside and out.',
    'Being your brother is one of my favourite things.',
  ],

  // ---------- Page 7: gift box ----------
  happinessJar: [
    'Take a deep breath. You are doing great.',
    'Today is a good day to smile at yourself in the mirror.',
    'Do one tiny thing that makes you happy today.',
    'You are never alone; I am always a call away.',
    'Remember to drink some water and be kind to yourself.',
    'Your next chapter is going to be beautiful.',
    'Laugh out loud at something silly today.',
    'It is okay to rest. You do not have to be perfect.',
    'Someone is thinking of you right now. (Hi!)',
    'Your smile is the best accessory.',
    'Dream big. Then take one small step.',
    'You are my favourite sister. Do not tell anyone else.',
  ],
  // Shown one at a time in the gift box ("Call me by a nickname")
  nicknames: ['Butki', 'Vandari', 'Booni', 'Chachundri', 'Chipakali', 'Moti', 'Sibli'],
  giftWish: `Happy Birthday, ${sisterName}! May this year bring you endless joy, beautiful surprises, and every reason to smile.`,

  // ---------- Page 8: cake ----------
  cakeCandles: 5,
  cakeWish: `May all your sweetest wishes come true, ${sisterName}!`,

  // ---------- Page 9: heartfelt message ----------
  message: {
    title: 'HAPPY BIRTHDAY, MY CUTEST SISTER VANDARI! 🎂💗',
    paragraphs: [
      'Today is all about you, your happiness, your dreams, and everything that makes you special.',
      'I wish you a life full of genuine happiness, laughter, good health, success, and wonderful opportunities.',
      'Never stop believing in yourself. Keep smiling, keep shining, and keep being the amazing person you are.',
      'Happy Birthday, meri pyari behen! 🫂❤️',
    ],
  },

  // ---------- Page 10: grand finale ----------
  finale: {
    line1: `${sisterName.toUpperCase()}, YOU WILL ALWAYS BE MY SPECIAL LITTLE SISTER. ❤️`,
    line2: 'THIS LITTLE UNIVERSE WAS CREATED JUST FOR YOU. 🎀',
    celebration: `Happy Birthday, ${sisterName}! 🎉`,
  },

  // ---------- Music ----------
  // Put your own file at public/assets/birthday-music.mp3 (optional).
  musicFile: 'assets/birthday-music.mp3',

  // ---------- Theme colours ----------
  theme: {
    rose: '#e0407f',
    lavender: '#9b7bff',
    blush: '#ffe6f0',
    plum: '#4a2468',
    night: '#150b36',
  },
};

export default birthdayConfig;
