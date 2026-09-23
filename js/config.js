/* ==================================================================
   SAKURA ISLAND - settings

   This is the only file you need to edit. It holds who the game is
   for, the presents, every word on screen, and every difficulty and
   payout knob.

   Quick balance guide:
   - She earns Bells faster:   raise the bells* values, or lower the goals.
                               A clean win is tuned to about 600 Bells.
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

  // Background music.
  // Pick a track for the main screens (title, island, shop, passport, finale),
  // for the reward moments (the results screen and unwrapping a present),
  // and for each mini-game. Use a name from `tracks`, or "" for silence.
  //
  // Each built-in name plays a small original tune. To use your own recording,
  // set src to a file, e.g. "assets/music/island.mp3", and that file replaces
  // the tune. mp3, ogg and wav all work. A missing file just goes quiet.
  // volume is 0 (silent) to 1 (full). The mute button still turns it all off.
  music: {
    volume: 0.75,

    tracks: {
      island: { name: "Island Morning", src: "" },
      meadow: { name: "Meadow Skip", src: "" },
      garden: { name: "Herb Garden", src: "" },
      river: { name: "Quiet River", src: "" },
      dig: { name: "Buried Coins", src: "" },
      rain: { name: "Rain on the Roof", src: "" },
      cafe: { name: "Café Music Box", src: "" },
      concert: { name: "Soft Encore", src: "" },
      reward: { name: "You Did It", src: "" },
      // ours: { name: "Our Song", src: "assets/music/ours.mp3" },
    },

    main: "island",
    reward: "reward",
    games: {
      bugs: "meadow",
      orchard: "garden",
      fishing: "river",
      dig: "dig",
      rain: "rain",
      memory: "cafe",
      concert: "concert",
    },
  },

  // The real presents, wrapped inside the game.
  // They are redeemed in this order: the next one stays locked until the
  // one before it has been unwrapped. The shop keeps a present's name
  // hidden until its opening animation has finished.
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
      price: 1100,
      // photo: "assets/gifts/jacket.jpg",
      photo: "",
      colorA: "#cfe9ff",
      colorB: "#8fc8ff",
    },
    {
      id: "bouquet",
      icon: "💐",
      price: 1000,
      photo: "",
      colorA: "#ffe4f1",
      colorB: "#f4a5c4",
    },
    {
      id: "sushi",
      icon: "🍣",
      price: 1100,
      photo: "",
      colorA: "#fff3d6",
      colorB: "#ffb4a2",
    },
    {
      id: "apothecary",
      icon: "🌿",
      price: 1200,
      photo: "",
      colorA: "#d8f3dc",
      colorB: "#95d5b2",
    },
    {
      id: "mistborn",
      icon: "🪙",
      price: 1300,
      photo: "",
      colorA: "#e7e5fb",
      colorB: "#b8c0ff",
    },
    {
      id: "encore",
      icon: "🎧",
      price: 1400,
      photo: "",
      colorA: "#ffd6e8",
      colorB: "#c9b6ff",
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
      bellsPerCatch: 30, // a clean win (the goal, right on time) pays about 600
      winBonus: 240,
      // glyph, points scored, and how fast that bug moves
      bugs: [
        { glyph: "🦋", points: 1, speed: 52, name: "Flower Butterfly" },
        { glyph: "🐞", points: 1, speed: 44, name: "Ladybug" },
        { glyph: "🐝", points: 1, speed: 78, name: "Protein Bee" },
        { glyph: "🦗", points: 1, speed: 66, name: "Mist Cricket" },
        { glyph: "🐛", points: 1, speed: 30, name: "Herb Caterpillar" },
        { glyph: "🐰", points: 2, speed: 90, name: "Bad Bunny" },
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
      bellsPerPerfect: 32,
      bellsPerLate: 10, // picked slightly overripe
      winBonus: 260,
      fruit: [
        { glyph: "🍊", name: "Valencia Orange" },
        { glyph: "🌸", name: "Orange Blossom" },
        { glyph: "🌺", name: "Carnation" },
        { glyph: "🌷", name: "Tulip" },
        { glyph: "🌿", name: "Maomao's Herb" },
        { glyph: "🍄", name: "Curious Mushroom" },
        { glyph: "🍑", name: "Peach" },
      ],
    },

    fishing: {
      goal: 5, // fish needed to win
      casts: 8, // casts allowed
      biteWindow: 0.95, // seconds to react once it bites: higher = easier
      waitFrom: 1.4, // shortest wait before a bite
      waitTo: 4.2, // longest wait before a bite
      winBonus: 200,
      // chance is relative, so these do not have to add up to anything.
      // a typical catch is worth about 75, so five fish and the win bonus
      // land near 600. The rare ones are a treat, not a payday.
      fish: [
        { glyph: "🍣", chance: 28, bells: 60, name: "Salmon Nigiri" },
        { glyph: "🐟", chance: 18, bells: 50, name: "Cádiz Sardine" },
        { glyph: "🐠", chance: 16, bells: 70, name: "Tuna Sashimi" },
        { glyph: "🦐", chance: 12, bells: 80, name: "Sweet Shrimp" },
        { glyph: "🍳", chance: 10, bells: 65, name: "Tamago" },
        { glyph: "🐙", chance: 7, bells: 110, name: "Octopus Nigiri" },
        { glyph: "🦀", chance: 5, bells: 120, name: "Galician Crab" },
        { glyph: "🪙", chance: 3, bells: 170, name: "Coin from the Mists" },
        { glyph: "💎", chance: 1, bells: 240, name: "Bead of Atium" },
      ],
    },

    dig: {
      cols: 6,
      rows: 4,
      fossils: 5, // how many are buried
      digs: 13, // how many holes she may dig
      goal: 4, // fossils needed to win
      bellsPerFossil: 80,
      bellsPerSpareDig: 12,
      winBonus: 240,
      treasures: [
        { glyph: "🪙", name: "Coin from the Mists" },
        { glyph: "💎", name: "Bead of Atium" },
        { glyph: "🌿", name: "Maomao's Herb" },
        { glyph: "🌸", name: "Pressed Flower" },
        { glyph: "🪭", name: "Fan from Seville" },
      ],
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
      bellsPerPoint: 0.8,
      winBonus: 300,
      items: [
        { glyph: "☂️", points: 30, chance: 24, good: true, name: "Umbrella" },
        { glyph: "🌸", points: 22, chance: 14, good: true, name: "Sakura" },
        { glyph: "🌺", points: 22, chance: 12, good: true, name: "Carnation" },
        {
          glyph: "🪭",
          points: 28,
          chance: 12,
          good: true,
          name: "Spanish Fan",
        },
        {
          glyph: "🥤",
          points: 40,
          chance: 10,
          good: true,
          name: "Protein Shake",
        },
        { glyph: "🍣", points: 34, chance: 8, good: true, name: "Sushi" },
        {
          glyph: "🌫️",
          points: 48,
          chance: 7,
          good: true,
          name: "Pocket of Mist",
        },
        { glyph: "⭐", points: 60, chance: 6, good: true, name: "Star" },
        { glyph: "⚡", points: 0, chance: 13, good: false, name: "Lightning" },
      ],
    },

    memory: {
      parMoves: 16, // moves she is allowed before the payout drops
      parSeconds: 55, // same idea for the clock
      baseBells: 620,
      bellsPerExtraMove: 16,
      bellsPerExtraSecond: 4,
      minBells: 220,
      symbols: ["🌸", "🍣", "🥤", "🐰", "🌿", "🪙", "🦻", "💃"],
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
      bellsPerScore: 0.03, // score x this. a perfect song lands near 750
      bellsPerCombo: 1,
      winBonus: 240,
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
  bugs_desc:
    "The meadow is all flowers, with a mist cricket, a protein bee, and one bunny who is absolutely not a bug.",
  bugs_hint:
    "Move with your finger, mouse or arrow keys. Click / tap / space to swing the net.",
  bugs_caught: "Caught",

  orchard_name: "Peach Orchard",
  orchard_title: "Perfect Picking",
  orchard_desc:
    "Maomao would wait for this exact moment. Spanish oranges, orange blossom, carnations, herbs and one curious mushroom.",
  orchard_hint:
    "Tap a fruit, herb or flower the moment its ring turns golden. Too early is a snack, too late is jam.",
  orchard_perfect: "Perfect",
  orchard_picked: "Picked",
  orchard_early: "Too soon!",
  orchard_late: "Overripe...",
  orchard_nice: "Perfect!",

  fishing_name: "Quiet River",
  fishing_title: "Fishing",
  fishing_desc:
    "The river is serving sushi, plus a sardine that swears it is from Cádiz. Something older is biting too. Wait for it.",
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
    "Coins from the mists, a bead of atium, dried herbs, a pressed flower, a fan from Seville. The dirt says how close you are.",
  dig_hint:
    "Dig a tile. A number means that many fossils are touching that tile.",
  dig_found: "Fossils",
  dig_digs: "Digs left",

  rain_name: "Rainy Path",
  rain_title: "Rainy Day Dash",
  rain_desc:
    "Catch flowers, a Spanish fan, sushi and a protein shake. Pocket the mist. Dodge the lightning.",
  rain_hint: "Move with your finger, mouse or arrow keys.",

  memory_name: "Cozy Café",
  memory_title: "Memory Match",
  memory_desc:
    "Coco shuffled sushi, flowers, a protein shake, Bad Bunny, Bad Gyal, a hearing aid, Maomao's herbs and a coin from the mists.",
  memory_hint: "Flip two cards. If they match, they stay open.",
  memory_moves: "Moves",
  memory_pairs: "Pairs",

  concert_name: "K.K. Concert",
  concert_title: "Saturday Night Concert",
  concert_desc:
    "K.K. starts the night, then Bad Bunny takes a set and Bad Gyal takes the encore. Hearing aids up.",
  concert_hint:
    "Hearing aids up. Tap a lane (or press D F J K) when its note reaches the line. Bad Bunny, then Bad Gyal.",
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
  shop_intro:
    "The presents come out one at a time. Unwrap one, and the next one wakes up.",
  shop_need_previous: "Unwrap the previous present first",
  shop_opening: "Unwrapping...",
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
    "Seven of them, one at a time. The sneakers and the jacket are real. I'm not even kidding.",
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
    name: "Gym-Day Sneakers",
    tagline: "For the gym, the flowers, and the walk after sushi.",
    note: "A real pair. Protein powder is in the bag, and little flowers sit where you'll see them between sets. Try them on, they are yours.",
  },
  jacket: {
    name: "Misty Rain Jacket",
    tagline: "Spain in the rain. You'll hear all of it.",
    note: "Closer to a mistcloak than a raincoat, which feels right. Wear it when Spain turns grey, turn the hearing aids up, and let Bad Bunny and Bad Gyal fight the weather. I'll be right next to you.",
  },
  bouquet: {
    name: "A Bouquet with Your Name",
    tagline: "Flowers. The real kind, not the pixel ones.",
    note: "Every flower on the island was practice. These ones you can put in water. I paid attention to the ones you stop to look at.",
  },
  sushi: {
    name: "Sushi Night",
    tagline: "Sit down. I'll order too much.",
    note: "Salmon nigiri, the extra tamago, and the seat next to mine. This one isn't a picture of dinner. It's dinner.",
  },
  apothecary: {
    name: "Maomao's Apothecary Box",
    tagline: "The books, and a little box of herbs to read them with.",
    note: "For the girl who would absolutely taste the suspicious mushroom. Please don't. The stories are enough, and I'll read the good parts out loud.",
  },
  mistborn: {
    name: "Coins from the Mists",
    tagline: "The books, and one coin for your pocket.",
    note: "So you can disappear into the mists whenever you like, and still find your way back. I'll be on the other side of the page.",
  },
  encore: {
    name: "Encore Night",
    tagline: "Bad Bunny, then Bad Gyal. Hearing aids up.",
    note: "A night that is loud on purpose, so you can hear all of it. If Spain is raining, we dance inside. I'll take the second verse.",
  },
};

/* ------------------------------------------------------------------
   The birthday letter in the finale. One line per paragraph.
   ------------------------------------------------------------------ */

window.LETTER_TEXT = [
  "Happy birthday, {name}.",
  "I built you an island because I wanted your present to last longer than the five seconds it takes to open a box.",
  "You caught bugs in the flowers, fished up sushi, dug a coin out of the mist, and kept a concert loud enough to hear. The sneakers and the jacket are real, and so is the rest of the counter: flowers, dinner, books, and a night with the volume up.",
  "Thank you for every ordinary day you turn into a good one. Here's to another year of walks, rain, and you.",
];
