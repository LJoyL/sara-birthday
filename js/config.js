/* ==================================================================
   SAKURA ISLAND - settings

   This is the only file you need to edit. It holds who the game is
   for, the presents, every word on screen, and every difficulty and
   payout knob.

   Quick balance guide:
   - She earns Bells faster:   raise the bells* values, or lower the goals.
   - Rounds get shorter:       lower the duration values.
   - The presents come sooner: lower gifts[].price, or set
                               options.requireAllGamesBeforeGifts to false.
   Anything you delete falls back to the built-in default, so you can
   trim this file down to only the lines you care about.
   ================================================================== */

window.GAME_CONFIG = {
  // Who is playing (shown all over the island)
  playerName: "Sara",

  // Who the island is from (signature of the birthday letter)
  fromName: "Me",

  // The little villager who guides the player
  hostName: "Coco",
  hostIcon: "🐱",

  options: {
    // Sound on the first time she opens the game (she can toggle it any time)
    soundOn: true,

    // Falling cherry blossom petals over the whole page
    petals: true,

    // Show the "Reset progress" button on the title screen
    showResetButton: true,

    // The gift shop stays shut until she has finished a round at every spot
    requireAllGamesBeforeGifts: true,

    // Bells she starts with, if you want to give her a head start
    startingBells: 0,

    // Which spots appear on the island, and in which order they are listed.
    // Remove one to leave that mini-game out of the game entirely.
    spots: ["bugs", "orchard", "fishing", "dig", "rain", "memory", "concert"],
  },

  // The real presents, wrapped inside the game.
  // price = how many Bells she needs to redeem it at the shop.
  // photo = optional path to a real photo, e.g. "assets/gifts/shoes.jpg".
  //         If the file is missing the game quietly falls back to the emoji.
  gifts: [
    {
      id: "shoes",
      icon: "👟",
      price: 900,
      // photo: "assets/gifts/shoes.jpg",
      photo: "",
      colorA: "#ffd6e8",
      colorB: "#ff9ec4",
    },
    {
      id: "jacket",
      icon: "🧥",
      price: 1400,
      // photo: "assets/gifts/jacket.jpg",
      photo: "",
      colorA: "#cfe9ff",
      colorB: "#8fc8ff",
    },
  ],

  // Photos for the slideshow in the finale. Drop images in assets/memories/
  // and list them here. Any file that fails to load is skipped, and if none
  // load the slideshow simply does not appear.
  memories: [
    // { src: "assets/memories/01.jpg", caption: "Our rainy walk" },
    // { src: "assets/memories/02.jpg", caption: "" },
  ],

  /* ----------------------------------------------------------------
     Mini-game tuning. Every value here is optional: delete a line and
     the game uses its built-in default.
     ---------------------------------------------------------------- */
  games: {
    bugs: {
      duration: 45, // seconds in a round
      goal: 12, // catches needed to win
      onField: 6, // how many bugs are out at once
      netRadius: 36, // bigger = easier to catch
      fleeDistance: 110, // how close the net gets before bugs run (0 = never)
      bellsPerCatch: 45,
      winBonus: 150,
      // glyph, points scored, and how fast that bug moves
      bugs: [
        { glyph: "🦋", points: 1, speed: 52 },
        { glyph: "🐞", points: 1, speed: 44 },
        { glyph: "🐝", points: 1, speed: 74 },
        { glyph: "🦗", points: 1, speed: 66 },
        { glyph: "🐛", points: 1, speed: 30 },
        { glyph: "🦂", points: 2, speed: 86 },
      ],
    },

    orchard: {
      duration: 45,
      goal: 10, // perfect picks needed to win
      onTree: 4, // fruits ripening at once
      ripenFrom: 0.3, // slowest ripening speed (units per second)
      ripenTo: 0.46, // fastest ripening speed
      perfectFrom: 0.78, // the golden ring window: wider = easier
      perfectTo: 1.02,
      overripeAt: 1.28, // past this the fruit drops by itself
      bellsPerPerfect: 60,
      bellsPerLate: 18, // picked slightly overripe
      winBonus: 180,
      fruit: ["🍑", "🍊", "🍎", "🍐", "🍒"],
    },

    fishing: {
      goal: 5, // fish needed to win
      casts: 8, // casts allowed
      biteWindow: 0.95, // seconds to react once it bites: higher = easier
      waitFrom: 1.4, // shortest wait before a bite
      waitTo: 4.2, // longest wait before a bite
      winBonus: 200,
      // chance is relative, so these do not have to add up to anything
      fish: [
        { glyph: "🐟", chance: 40, bells: 60, name: "River Fish" },
        { glyph: "🐠", chance: 22, bells: 90, name: "Ribbon Fish" },
        { glyph: "🐡", chance: 14, bells: 120, name: "Puffer" },
        { glyph: "🦐", chance: 10, bells: 100, name: "Sweet Shrimp" },
        { glyph: "🦀", chance: 8, bells: 140, name: "Sunset Crab" },
        { glyph: "🐙", chance: 4, bells: 220, name: "Shy Octopus" },
        { glyph: "👑", chance: 2, bells: 400, name: "Tiny Crown (?!)" },
      ],
    },

    dig: {
      cols: 6,
      rows: 4,
      fossils: 5, // how many are buried
      digs: 13, // how many holes she may dig
      goal: 4, // fossils needed to win
      bellsPerFossil: 170,
      bellsPerSpareDig: 25,
      winBonus: 180,
      treasures: ["🦴", "🦕", "🐚", "🗿", "💎"],
    },

    rain: {
      duration: 60,
      goal: 350, // points needed to win
      hearts: 3,
      mercySeconds: 1.2, // invulnerable time after a hit
      catchWidth: 38, // reach for good things: bigger = easier
      dodgeWidth: 24, // reach of the lightning: smaller = kinder
      spawnFrom: 0.34, // fastest gap between falling things
      spawnTo: 0.72, // slowest gap
      bellsPerPoint: 1.2,
      winBonus: 200,
      items: [
        { glyph: "☂️", points: 30, chance: 34, good: true },
        { glyph: "🍂", points: 15, chance: 26, good: true },
        { glyph: "🌸", points: 20, chance: 16, good: true },
        { glyph: "⭐", points: 60, chance: 8, good: true },
        { glyph: "⚡", points: 0, chance: 13, good: false },
      ],
    },

    memory: {
      parMoves: 16, // moves she is allowed before the payout drops
      parSeconds: 60, // same idea for the clock
      baseBells: 800,
      bellsPerExtraMove: 18,
      bellsPerExtraSecond: 4,
      minBells: 220,
      symbols: ["🌸", "🍡", "🐱", "⭐", "🍜", "🎐", "🦊", "☕"],
    },

    concert: {
      bpm: 104, // slower = easier
      bars: 16, // song length
      leadIn: 2.4, // count-in before the first note
      travel: 1.55, // seconds a note takes to fall: higher = more warning
      perfectWindow: 0.085, // seconds either side of the beat
      goodWindow: 0.17,
      accuracyToWin: 0.7, // 0.7 = 70%
      minNotesToWin: 20,
      bellsPerScore: 0.05, // score x this
      bellsPerCombo: 2,
      winBonus: 200,
      laneKeys: ["d", "f", "j", "k"],
      // the bars cycle through these lane patterns
      patterns: [
        [0, 1, 2, 3],
        [0, 2, 1, 3],
        [3, 2, 1, 0],
        [0, 3, 1, 2],
        [1, 1, 2, 2],
        [0, 0, 3, 3],
      ],
    },
  },
};

/* ------------------------------------------------------------------
   Everything the player reads.
   ------------------------------------------------------------------ */

window.GAME_TEXT = {
  // --- generic UI ---
  game_title: "Sakura Island",
  game_subtitle: "A Birthday Adventure",
  start: "Start the adventure",
  continue: "Continue",
  back_to_island: "Back to the island",
  play_again: "Play again",
  play: "Play",
  quit: "Leave",
  close: "Close",
  bells: "Bells",
  score: "Score",
  time: "Time",
  goal: "Goal",
  lives: "Hearts",
  best: "Best",
  passport: "Passport",
  shop: "Gift Shop",
  map_title: "Sakura Island",
  reset: "Reset progress",
  reset_confirm: "Erase all progress and start over?",
  new_record: "New record!",
  you_earned: "You earned",

  // --- title screen ---
  title_hello:
    "A tiny island was built just for you. Catch bugs, fish, play, and win your presents.",

  // --- map ---
  map_hint: "Choose a spot on the island",

  // short labels used on the island map
  bugs_short: "Meadow",
  orchard_short: "Orchard",
  fishing_short: "River",
  dig_short: "Dig Site",
  rain_short: "Rain",
  memory_short: "Café",
  concert_short: "Concert",
  shop_short: "Shop",
  plaza_short: "Plaza",

  // --- locations / mini-games ---
  bugs_name: "Flower Meadow",
  bugs_title: "Bug Catching",
  bugs_desc: "Chase the bugs with your net before the sun goes down.",
  bugs_hint:
    "Move with your finger, mouse or arrow keys. Click / tap / space to swing the net.",
  bugs_caught: "Caught",

  orchard_name: "Peach Orchard",
  orchard_title: "Perfect Picking",
  orchard_desc: "Fruit is best the second it ripens. Not before, not after.",
  orchard_hint:
    "Tap a fruit the moment its ring turns golden. Too early is a snack, too late is jam.",
  orchard_perfect: "Perfect",
  orchard_picked: "Picked",
  orchard_early: "Too soon!",
  orchard_late: "Overripe...",
  orchard_nice: "Perfect!",

  fishing_name: "Quiet River",
  fishing_title: "Fishing",
  fishing_desc:
    "Wait for the bite, then reel it in. Patience, always patience.",
  fishing_hint:
    "Click / tap / space to cast. When the bobber goes ! reel it in fast!",
  fishing_casts: "Casts left",
  fishing_fish: "Fish",
  fishing_wait: "Waiting for a bite...",
  fishing_bite: "A bite! Reel it in!",
  fishing_caught: "You caught a",
  fishing_missed: "It got away...",
  fishing_cast_prompt: "Cast your line!",

  dig_name: "Fossil Dig",
  dig_title: "Fossil Dig",
  dig_desc:
    "Something old is buried here. The dirt will tell you how close you are.",
  dig_hint:
    "Dig a tile. A number means that many fossils are touching that tile.",
  dig_found: "Fossils",
  dig_digs: "Digs left",

  rain_name: "Rainy Path",
  rain_title: "Rainy Day Dash",
  rain_desc:
    "A storm rolled in. Catch umbrellas and stars, dodge the thunderclouds.",
  rain_hint: "Move with your finger, mouse or arrow keys.",

  memory_name: "Cozy Café",
  memory_title: "Memory Match",
  memory_desc: "Coco mixed up the café cards again. Find every pair.",
  memory_hint: "Flip two cards. If they match, they stay open.",
  memory_moves: "Moves",
  memory_pairs: "Pairs",

  concert_name: "K.K. Concert",
  concert_title: "Saturday Night Concert",
  concert_desc:
    "K.K. is warming up. Keep the beat and the whole island sings along.",
  concert_hint: "Tap a lane (or press D F J K) when its note reaches the line.",
  concert_combo: "Combo",
  concert_perfect: "Perfect",
  concert_good: "Good",
  concert_miss: "Miss",
  concert_accuracy: "Accuracy",

  // --- results ---
  result_win: "Wonderful!",
  result_lose: "So close!",
  result_win_sub: "The whole island is clapping for you.",
  result_lose_sub: "No worries, the island is open forever. Try again?",

  // --- shop ---
  shop_title: "Coco's Gift Shop",
  shop_intro: "Two presents are waiting behind the counter. Bells, please!",
  shop_need_more: "Not enough Bells yet",
  shop_redeem: "Redeem",
  shop_claimed: "Unwrapped",
  shop_view: "Look at it again",
  shop_empty_hint: "Play the mini-games on the island to earn Bells.",
  shop_locked: "Finish every spot first",
  shop_locked_hint:
    "Coco only opens the counter once you have played a full round at every spot on the island.",
  shop_progress: "Mini-games finished",

  // --- gift reveal ---
  gift_tap_to_open: "Tap the present to unwrap it",

  // --- passport ---
  passport_title: "Island Passport",
  passport_sub: "Stamps collected on Sakura Island",
  passport_not_yet: "not played yet",
  passport_total: "Total Bells earned",
  passport_gifts: "Presents unwrapped",

  // --- finale ---
  finale_ready: "Something is happening at the plaza...",
  finale_title: "Happy Birthday!",
  finale_memories: "Our year, roughly",
  finale_replay: "Stay on the island",

  // --- host dialogue ---
  dlg_welcome: [
    "Oh! You made it! Welcome to Sakura Island, {name}!",
    "I'm {host}, the mayor, the shopkeeper and the entire tourism office.",
    "Today is your birthday, so the island made you a deal: play, earn Bells, and I'll hand over the presents hidden behind my counter.",
    "Two of them. Real ones. I'm not even kidding.",
  ],
  dlg_first_bells: [
    "Look at all those Bells! The shop is that pink building on the map.",
  ],
  dlg_shop_ready: ["Psst, {name}. You have enough Bells for a present now!"],
  dlg_all_games: ["You played everything on the island. Show-off. I love it."],
  dlg_finale: [
    "The whole island gathered at the plaza for you, {name}.",
    "Before the fireworks, there's a letter with your name on it...",
  ],
};

/* ------------------------------------------------------------------
   The presents: what she reads when each one is unwrapped.
   ------------------------------------------------------------------ */

window.GIFT_TEXT = {
  shoes: {
    name: "Cherry Blossom Sneakers",
    tagline: "A real pair. Waiting for you in the real world.",
    note: "For every walk we still have to take together. Try them on, they are yours.",
  },
  jacket: {
    name: "Rainy Day Jacket",
    tagline: "So the weather stops having an opinion about our plans.",
    note: "Now the rain is just a nice sound. Go outside anyway, I'll be right next to you.",
  },
};

/* ------------------------------------------------------------------
   The birthday letter in the finale. One line per paragraph.
   ------------------------------------------------------------------ */

window.LETTER_TEXT = [
  "Happy birthday, {name}.",
  "I built you an island because I wanted your present to last longer than the five seconds it takes to open a box.",
  "You caught bugs, you fished, you dug up fossils, you played a whole concert, you beat a storm, and you found both presents. They are real, and they are already waiting for you.",
  "Thank you for every ordinary day you turn into a good one. Here's to another year of walks, rain, and you.",
];
