# 🌸 Sakura Island — A Birthday Adventure

A cosy little browser game in the spirit of Animal Crossing, with an anime pastel look.
Play mini-games on a small island, earn Bells, and redeem them at Coco's shop — where the
real birthday presents (a pair of shoes and a rain jacket) are waiting to be unwrapped.

No build step, no dependencies, no assets to download. Open `index.html` and play.

## How to play

1. Open `index.html` in any modern browser (or host it, see below).
2. Coco welcomes you to the island and explains the deal: play, earn Bells, get presents.
3. Tap a spot on the island map to play a mini-game:

| Spot             | Mini-game        | Goal                                                        |
| ---------------- | ---------------- | ----------------------------------------------------------- |
| 🦋 Flower Meadow | Bug catching     | Catch 12 bugs in 45 seconds with the net                    |
| 🍑 Peach Orchard | Perfect picking  | Pick 10 fruits in the moment their ring turns golden        |
| 🎣 Quiet River   | Fishing          | Land 5 fish in 8 casts — reel in the moment it bites        |
| 🦴 Fossil Dig    | Deduction puzzle | Find 4 of 5 fossils in 13 digs, using the proximity numbers |
| 🌧️ Rainy Path    | Rainy day dash   | Score 350 points, dodge the lightning, keep your hearts     |
| ☕ Cozy Café     | Memory match     | Find all 8 pairs, fewer moves = more Bells                  |
| 🎸 K.K. Concert  | Rhythm game      | Keep 70% accuracy across 80 notes in four lanes             |

4. Every run pays Bells, win or lose, so the island is never a dead end. All of the numbers
   in that table are settings you can change — see below.
5. The 🎁 Gift Shop opens once **every** spot has been played to the end at least once. Presents are
   redeemed in the order they appear: the next one stays locked until the one before it is unwrapped.
   Tap a present three times to open it. Its name stays a secret in the shop until that animation
   finishes, and only then does the next present unlock.
6. Unwrap every present and a 🎆 plaza appears on the map with the birthday letter, a photo
   slideshow and fireworks. The sneakers and the jacket come first. After them: flowers, a sushi
   night, an apothecary box, the Mistborn books, and an encore night.

Progress is saved automatically in the browser (localStorage). The 📕 passport screen shows
stamps, best scores and total Bells earned.

Controls work with mouse, touch and keyboard (arrow keys / WASD to move, space to act, and
D F J K for the concert lanes).

## Making it personal

Everything you'd want to change lives in **`js/config.js`**, and nothing else needs editing:

- `playerName` / `fromName` — who's playing, who it's from.
- `hostName` / `hostIcon` — the villager who guides her around.
- `gifts` — the presents, in the order she unwraps them: emoji, Bell price, wrapping-paper colours, optional photo.
- `memories` — photos for the slideshow in the finale.
- `options` — sound and petals on by default, the reset button, starting Bells, whether the
  shop stays locked until every spot is finished, and `spots`, the list of mini-games that
  appear on the island (drop one from the list and its spot disappears).
- `music` — which background track plays on the main screens, on the reward screen, and in
  each mini-game (see below).
- `games` — the difficulty and payout of every mini-game (see below).
- `GAME_TEXT` — every string in the game.
- `GIFT_TEXT` — the name, tagline and note for each present.
- `LETTER_TEXT` — the birthday letter shown in the finale.

Adding another present later is just another entry in `gifts` plus its `GIFT_TEXT` block. It stays
locked until the one before it has been unwrapped.

A clean win at any mini-game pays about **600 Bells**. One lap of the island, played well, buys
the sneakers, the jacket and the bouquet. A second lap finishes the counter. The rare fish and a
perfect concert pay a little more, and a loss still pays something, just clearly less.

The mini-games and the presents mention the things she loves: Mistborn, The Apothecary
Diaries, Bad Bunny, Bad Gyal, hearing aids, Spain, sushi, the gym (and protein powder) and flowers.
The wording all lives in `GAME_TEXT`, `GIFT_TEXT` and the named catches inside `games`, so any of it
can be rewritten without touching the game code.

### Difficulty and how fast she earns

`config.games` holds one block per mini-game. Three knobs repeat everywhere:

- `duration` (or `casts` / `digs` / `bars`) — how long a round lasts.
- `goal` — what counts as a win.
- `bells*` and `winBonus` — what a round pays out.

So to make the whole island gentler and richer, raise the `bells*` values and lower the
`goal` values; to make her work for it, do the opposite. The rest of each block is
game-specific and commented in place: net size and how skittish the bugs are, the width of
the orchard's golden window, how long a fish waits before biting, the size of the dig grid,
the storm's spawn rate and how forgiving the lightning hitbox is, the café's par for moves
and time, and the concert's BPM, note speed and timing windows.

Every line in `games` and `options` is optional — delete one and the game falls back to its
built-in default, so you can trim the file down to only what you changed.

### Background music

`config.music` chooses one track for three places:

- `main` — the title screen, the island, the shop, the passport and the finale.
- `reward` — the results screen after a mini-game, and the moment a present is unwrapped.
- `games` — one entry per mini-game (`bugs`, `orchard`, `fishing`, `dig`, `rain`, `memory`, `concert`).

Set any of them to `""` and that place stays quiet. The same track can be reused in several
places. `volume` runs from 0 to 1, and the mute button silences the music along with the effects.

These names play a small original tune, with nothing to download:

`island`, `meadow`, `garden`, `river`, `dig`, `rain`, `cafe`, `concert`, `reward`.

To use a recording instead, drop it in `assets/music/` and set that track's `src`. It replaces
the built-in tune wherever the track is selected:

```js
tracks: {
  island: { name: "Island Morning", src: "assets/music/island.mp3" },
  // ours: { name: "Our Song", src: "assets/music/ours.mp3" },
},
main: "ours",
games: { concert: "ours" },
```

A file that can't be loaded is skipped, and the screen goes quiet rather than breaking.

### Real photos

The presents show an emoji until you give them a photo. Drop `shoes.jpg` and `jacket.jpg`
into `assets/gifts/`, then uncomment the `photo:` lines in `js/config.js`. Same idea for the
finale slideshow: put your pictures in `assets/memories/` and list them under `memories`.
See `assets/README.md`. Any photo that is missing falls back to the emoji, and if no
slideshow photos load the slideshow simply doesn't appear — so nothing ever looks broken.

## Running it

Simplest: double-click `index.html`.

Local server (recommended, and required if a browser blocks local file access):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

To send her a link, push this repo and enable **GitHub Pages** (Settings → Pages → deploy
from branch, root folder). Everything is static, so it just works.

## Project layout

```
index.html          screens and layout
css/style.css       the whole pastel look
js/config.js        ← personal settings, difficulty, payouts and all text
js/settings.js      reads config.js, falling back to each game's defaults
js/audio.js         WebAudio sound effects (no audio files)
js/ui.js            text helper, screens, dialogue, toasts, modals, confetti
js/engine.js        tiny canvas engine (loop + pointer/keyboard input)
js/games/*.js       the seven mini-games
js/gifts.js         shop counter and the unwrapping ceremony
js/main.js          game state, saving, navigation
assets/             optional photos of the presents and of the two of you
```
