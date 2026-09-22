# 🌸 Sakura Island — A Birthday Adventure

A cosy little browser game in the spirit of Animal Crossing, with an anime pastel look.
Play mini-games on a small island, earn Bells, and redeem them at Coco's shop — where the
real birthday presents (a pair of shoes and a rain jacket) are waiting to be unwrapped.

No build step, no dependencies, no assets to download. Open `index.html` and play.

## How to play

1. Open `index.html` in any modern browser (or host it, see below).
2. Coco welcomes you to the island and explains the deal: play, earn Bells, get presents.
3. Tap a spot on the island map to play a mini-game:

| Spot | Mini-game | Goal |
| --- | --- | --- |
| 🦋 Flower Meadow | Bug catching | Catch 12 bugs in 45 seconds with the net |
| 🎣 Quiet River | Fishing | Land 5 fish in 8 casts — reel in the moment it bites |
| ☕ Cozy Café | Memory match | Find all 8 pairs, fewer moves = more Bells |
| 🌧️ Rainy Path | Rainy day dash | Score 400 points, dodge the lightning, keep your hearts |

4. Every run pays Bells, win or lose, so the island is never a dead end.
5. Spend Bells at the 🎁 Gift Shop. Each present is unwrapped with a little ceremony
   (tap it three times), then revealed with a personal note.
6. Unwrap both presents and a 🎆 plaza appears on the map with the birthday letter and fireworks.

Progress is saved automatically in the browser (localStorage). The 📕 passport screen shows
stamps, best scores and total Bells earned.

Controls work with mouse, touch and keyboard (arrow keys / WASD to move, space to act).

## Making it personal

Everything you'd want to change lives in **`js/config.js`**:

- `playerName` / `fromName` — who's playing, who it's from.
- `hostName` / `hostIcon` — the villager who guides her around.
- `lang` — `"en"` or `"fr"` (there's also an EN/FR toggle on the title screen).
- `gifts` — the presents: emoji, Bell price, wrapping-paper colours.
- `GAME_TEXT` — every UI string, per language.
- `GIFT_TEXT` — the name, tagline and note for each present.
- `LETTER_TEXT` — the birthday letter shown in the finale.

Adding a third present later is just another entry in `gifts` plus its `GIFT_TEXT` block.

If you want a real photo instead of the emoji for a gift, drop the image in `assets/` and
swap the `gift-reveal-emoji` element in `js/gifts.js` for an `<img>`.

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
js/config.js        ← personal settings and all text
js/audio.js         WebAudio sound effects (no audio files)
js/ui.js            text helper, screens, dialogue, toasts, modals, confetti
js/engine.js        tiny canvas engine (loop + pointer/keyboard input)
js/games/*.js       the four mini-games
js/gifts.js         shop counter and the unwrapping ceremony
js/main.js          game state, saving, navigation
```
