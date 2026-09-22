/* ------------------------------------------------------------------
   SAKURA ISLAND - personal settings
   This is the only file you need to edit to personalise the game.
   ------------------------------------------------------------------ */

window.GAME_CONFIG = {
  // "en" or "fr"
  lang: "en",

  // Who is playing (shown all over the island)
  playerName: "Sara",

  // Who the island is from (signature of the birthday letter)
  fromName: "Me",

  // The little villager who guides the player
  hostName: "Coco",
  hostIcon: "🐱",

  // Every mini-game has to be played at least once before the shop opens.
  requireAllGamesBeforeGifts: true,

  // The real presents, wrapped inside the game.
  // price = how many Bells she needs to redeem it at the shop.
  // photo  = optional path to a real photo, e.g. "assets/gifts/shoes.jpg".
  //          If the file is missing the game quietly falls back to the emoji.
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
    // { src: "assets/memories/01.jpg", caption: { en: "Our rainy walk", fr: "Notre balade sous la pluie" } },
    // { src: "assets/memories/02.jpg", caption: { en: "", fr: "" } },
  ],
};

/* ------------------------------------------------------------------
   Text packs. Everything the player reads lives here.
   ------------------------------------------------------------------ */

window.GAME_TEXT = {
  en: {
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
    sound_on: "Sound on",
    sound_off: "Sound off",
    passport: "Passport",
    shop: "Gift Shop",
    map_title: "Sakura Island",
    reset: "Reset progress",
    reset_confirm: "Erase all progress and start over?",
    new_record: "New record!",
    you_earned: "You earned",
    tap_to_continue: "tap to continue",

    // --- title screen ---
    title_hello:
      "A tiny island was built just for you. Catch bugs, fish, play, and win your presents.",

    // --- map ---
    map_hint: "Choose a spot on the island",
    locked: "Locked",

    // --- locations / mini-games ---
    // short labels used on the island map
    bugs_short: "Meadow",
    fishing_short: "River",
    memory_short: "Café",
    rain_short: "Rain",
    orchard_short: "Orchard",
    dig_short: "Dig Site",
    concert_short: "Concert",
    shop_short: "Shop",
    plaza_short: "Plaza",

    bugs_name: "Flower Meadow",
    bugs_title: "Bug Catching",
    bugs_desc: "Chase the bugs with your net before the sun goes down.",
    bugs_hint:
      "Move with your finger, mouse or arrow keys. Click / tap / space to swing the net.",
    bugs_caught: "Caught",

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

    memory_name: "Cozy Café",
    memory_title: "Memory Match",
    memory_desc: "Coco mixed up the café cards again. Find every pair.",
    memory_hint: "Flip two cards. If they match, they stay open.",
    memory_moves: "Moves",
    memory_pairs: "Pairs",

    rain_name: "Rainy Path",
    rain_title: "Rainy Day Dash",
    rain_desc:
      "A storm rolled in. Catch umbrellas and stars, dodge the thunderclouds.",
    rain_hint: "Move with your finger, mouse or arrow keys.",

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
    orchard_ok: "Good",

    dig_name: "Fossil Dig",
    dig_title: "Fossil Dig",
    dig_desc:
      "Something old is buried here. The dirt will tell you how close you are.",
    dig_hint:
      "Dig a tile. A number means that many fossils are touching that tile.",
    dig_found: "Fossils",
    dig_digs: "Digs left",

    concert_name: "K.K. Concert",
    concert_title: "Saturday Night Concert",
    concert_desc:
      "K.K. is warming up. Keep the beat and the whole island sings along.",
    concert_hint:
      "Tap a lane (or press D F J K) when its note reaches the line.",
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
    shop_locked: "Try every spot first",
    shop_locked_hint:
      "Coco only opens the counter once you have tried every spot on the island.",
    shop_progress: "Spots tried",

    // --- gift reveal ---
    gift_tap_to_open: "Tap the present to unwrap it",
    gift_opening: "Unwrapping...",

    // --- passport ---
    passport_title: "Island Passport",
    passport_sub: "Stamps collected on Sakura Island",
    passport_not_yet: "not played yet",
    passport_total: "Total Bells earned",
    passport_gifts: "Presents unwrapped",

    // --- finale ---
    finale_ready: "Something is happening at the plaza...",
    finale_title: "Happy Birthday!",
    finale_button: "Read the letter",
    finale_replay: "Stay on the island",
    finale_memories: "Our year, roughly",

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
    dlg_all_games: [
      "You played everything on the island. Show-off. I love it.",
    ],
    dlg_finale: [
      "The whole island gathered at the plaza for you, {name}.",
      "Before the fireworks, there's a letter with your name on it...",
    ],
  },

  fr: {
    game_title: "Île Sakura",
    game_subtitle: "Une aventure d'anniversaire",
    start: "Commencer l'aventure",
    continue: "Continuer",
    back_to_island: "Retour sur l'île",
    play_again: "Rejouer",
    play: "Jouer",
    quit: "Quitter",
    close: "Fermer",
    bells: "Clochettes",
    score: "Score",
    time: "Temps",
    goal: "Objectif",
    lives: "Cœurs",
    best: "Record",
    sound_on: "Son activé",
    sound_off: "Son coupé",
    passport: "Passeport",
    shop: "Boutique",
    map_title: "Île Sakura",
    reset: "Effacer la progression",
    reset_confirm: "Effacer toute la progression et recommencer ?",
    new_record: "Nouveau record !",
    you_earned: "Tu as gagné",
    tap_to_continue: "touche pour continuer",

    title_hello:
      "Une petite île a été construite rien que pour toi. Attrape des insectes, pêche, joue, et gagne tes cadeaux.",

    map_hint: "Choisis un endroit sur l'île",
    locked: "Fermé",

    bugs_short: "Prairie",
    fishing_short: "Rivière",
    memory_short: "Café",
    rain_short: "Pluie",
    orchard_short: "Verger",
    dig_short: "Fouilles",
    concert_short: "Concert",
    shop_short: "Boutique",
    plaza_short: "Place",

    bugs_name: "Prairie fleurie",
    bugs_title: "Chasse aux insectes",
    bugs_desc: "Attrape les insectes au filet avant le coucher du soleil.",
    bugs_hint:
      "Bouge avec le doigt, la souris ou les flèches. Clic / tap / espace pour donner un coup de filet.",
    bugs_caught: "Attrapés",

    fishing_name: "Rivière tranquille",
    fishing_title: "Pêche",
    fishing_desc: "Attends que ça morde, puis ferre. De la patience, toujours.",
    fishing_hint:
      "Clic / tap / espace pour lancer. Quand le bouchon fait ! , ferre vite !",
    fishing_casts: "Lancers restants",
    fishing_fish: "Poissons",
    fishing_wait: "On attend que ça morde...",
    fishing_bite: "Ça mord ! Ferre !",
    fishing_caught: "Tu as attrapé :",
    fishing_missed: "Il s'est échappé...",
    fishing_cast_prompt: "Lance ta ligne !",

    memory_name: "Café douillet",
    memory_title: "Jeu de mémoire",
    memory_desc:
      "Coco a encore mélangé les cartes du café. Retrouve toutes les paires.",
    memory_hint:
      "Retourne deux cartes. Si elles sont identiques, elles restent ouvertes.",
    memory_moves: "Coups",
    memory_pairs: "Paires",

    rain_name: "Sentier de pluie",
    rain_title: "Course sous la pluie",
    rain_desc:
      "L'orage arrive. Attrape les parapluies et les étoiles, évite les nuages.",
    rain_hint: "Bouge avec le doigt, la souris ou les flèches.",

    orchard_name: "Verger de pêches",
    orchard_title: "Cueillette parfaite",
    orchard_desc:
      "Un fruit est meilleur à la seconde où il mûrit. Ni avant, ni après.",
    orchard_hint:
      "Touche le fruit quand son cercle devient doré. Trop tôt c'est un goûter, trop tard c'est de la confiture.",
    orchard_perfect: "Parfaits",
    orchard_picked: "Cueillis",
    orchard_early: "Trop tôt !",
    orchard_late: "Trop mûr...",
    orchard_nice: "Parfait !",
    orchard_ok: "Bien",

    dig_name: "Site de fouilles",
    dig_title: "Chasse aux fossiles",
    dig_desc:
      "Quelque chose de très vieux est enterré ici. La terre te dira si tu chauffes.",
    dig_hint:
      "Creuse une case. Un chiffre indique combien de fossiles la touchent.",
    dig_found: "Fossiles",
    dig_digs: "Coups de pelle",

    concert_name: "Concert de K.K.",
    concert_title: "Concert du samedi soir",
    concert_desc:
      "K.K. s'échauffe. Garde le rythme et toute l'île chante avec toi.",
    concert_hint:
      "Touche une colonne (ou tape D F J K) quand la note atteint la ligne.",
    concert_combo: "Combo",
    concert_perfect: "Parfait",
    concert_good: "Bien",
    concert_miss: "Raté",
    concert_accuracy: "Précision",

    result_win: "Magnifique !",
    result_lose: "Presque !",
    result_win_sub: "Toute l'île t'applaudit.",
    result_lose_sub: "Pas grave, l'île est ouverte pour toujours. On retente ?",

    shop_title: "La boutique de Coco",
    shop_intro:
      "Deux cadeaux attendent derrière le comptoir. Des clochettes, s'il te plaît !",
    shop_need_more: "Pas encore assez de clochettes",
    shop_redeem: "Échanger",
    shop_claimed: "Déballé",
    shop_view: "Le revoir",
    shop_empty_hint: "Joue aux mini-jeux de l'île pour gagner des clochettes.",
    shop_locked: "Essaie d'abord chaque endroit",
    shop_locked_hint:
      "Coco n'ouvre le comptoir qu'une fois que tu as essayé tous les endroits de l'île.",
    shop_progress: "Endroits essayés",

    gift_tap_to_open: "Touche le cadeau pour le déballer",
    gift_opening: "Déballage...",

    passport_title: "Passeport de l'île",
    passport_sub: "Tampons collectés sur l'île Sakura",
    passport_not_yet: "pas encore joué",
    passport_total: "Clochettes gagnées en tout",
    passport_gifts: "Cadeaux déballés",

    finale_ready: "Il se passe quelque chose sur la place...",
    finale_title: "Joyeux anniversaire !",
    finale_button: "Lire la lettre",
    finale_replay: "Rester sur l'île",
    finale_memories: "Notre année, en gros",

    dlg_welcome: [
      "Oh ! Te voilà ! Bienvenue sur l'île Sakura, {name} !",
      "Je suis {host} : maire, commerçant et office du tourisme à moi tout seul.",
      "C'est ton anniversaire aujourd'hui, alors l'île te propose un marché : joue, gagne des clochettes, et je te donne les cadeaux cachés derrière mon comptoir.",
      "Deux cadeaux. De vrais cadeaux. Je te jure.",
    ],
    dlg_first_bells: [
      "Regarde toutes ces clochettes ! La boutique, c'est le bâtiment rose sur la carte.",
    ],
    dlg_shop_ready: [
      "Psst, {name}. Tu as assez de clochettes pour un cadeau !",
    ],
    dlg_all_games: ["Tu as joué à tout sur l'île. Frimeuse. J'adore ça."],
    dlg_finale: [
      "Toute l'île s'est réunie sur la place pour toi, {name}.",
      "Avant le feu d'artifice, il y a une lettre à ton nom...",
    ],
  },
};

/* ------------------------------------------------------------------
   The presents and the birthday letter, per language.
   ------------------------------------------------------------------ */

window.GIFT_TEXT = {
  en: {
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
  },
  fr: {
    shoes: {
      name: "Baskets Fleur de Cerisier",
      tagline: "Une vraie paire. Elle t'attend dans le vrai monde.",
      note: "Pour toutes les balades qu'il nous reste à faire. Essaie-les, elles sont à toi.",
    },
    jacket: {
      name: "Veste de Pluie",
      tagline: "Pour que la météo arrête d'avoir un avis sur nos projets.",
      note: "Maintenant la pluie n'est plus qu'un joli bruit. Sors quand même, je serai juste à côté.",
    },
  },
};

window.LETTER_TEXT = {
  en: [
    "Happy birthday, {name}.",
    "I built you an island because I wanted your present to last longer than the five seconds it takes to open a box.",
    "You caught bugs, you fished, you dug up fossils, you played a whole concert, you beat a storm, and you found both presents. They are real, and they are already waiting for you.",
    "Thank you for every ordinary day you turn into a good one. Here's to another year of walks, rain, and you.",
  ],
  fr: [
    "Joyeux anniversaire, {name}.",
    "Je t'ai construit une île parce que je voulais que ton cadeau dure plus longtemps que les cinq secondes qu'il faut pour ouvrir une boîte.",
    "Tu as attrapé des insectes, tu as pêché, tu as déterré des fossiles, tu as joué un concert entier, tu as battu un orage, et tu as trouvé les deux cadeaux. Ils sont réels, et ils t'attendent déjà.",
    "Merci pour chaque jour ordinaire que tu rends bien. À une nouvelle année de balades, de pluie, et de toi.",
  ],
};
