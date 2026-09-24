# Assets

Drop real photos here to replace the emoji stand-ins. Nothing breaks if you skip
this: every image falls back to its emoji when the file is missing.

## `gifts/`

Photos of the real presents, shown the moment she unwraps them.

- `shoes.jpg` — the sneakers
- `jacket.jpg` — the rain jacket

The paths are set in `js/config.js` under `gifts[].photo`. Landscape crops (4:3)
look best; anything else is centre-cropped.

## `memories/`

Photos of the two of you, shown as a slideshow in the finale letter.

- `01.jpg`, `02.jpg`, `03.jpg` … listed in `js/config.js` under `memories`.

Each entry can carry a caption:

```js
{ src: "assets/memories/01.jpg", caption: "The rainy walk" }
```

Add as many as you like; the slideshow advances on its own and has dots to jump
between photos. If none of the files load, the slideshow disappears and the
letter looks exactly as it did before.

## `music/`

Optional background recordings. The game already plays a small original tune per screen;
a file here replaces that tune. Point `src` at it from `music.tracks` in `js/config.js`
(`mp3`, `ogg` or `wav`). See the Background music section of the main README.
