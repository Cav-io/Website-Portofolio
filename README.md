# Portfolio Town

My portfolio, built as a small top-down RPG you can play in the browser.

You walk around a town where every building is a section of the portfolio: who I am, what I've built, where I've worked and studied, and what I do outside of code. Visit them all to collect 8 badges. If you're in a hurry there is a classic one-page view with the same content.

## Features

- A tile-based town drawn entirely in code on a 256×192 canvas (no image files for the world, sprites or tiles)
- Grid movement, NPCs to talk to, signs to read and a typewriter dialogue system
- Seven buildings that open the portfolio sections, each awarding a badge
- Turn-based "bug battles" in the tall grass, with my real tech skills as the moves
- Two-screen layout with touch controls on phones
- Progress saved in the browser
- A classic view for anyone who would rather just read

## Controls

| Key | Action |
| --- | --- |
| Arrow keys / WASD | Move |
| Shift (hold) | Run |
| Z / Enter / Space | Talk, read, confirm |
| X / Esc | Go back, close |

On a phone, use the on-screen D-pad and the A and B buttons.

## Running it

There is no build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then go to http://localhost:8000. Add `#classic` to the address to open the classic view directly.

## Project layout

```
index.html        page structure for the game and the classic view
css/style.css     all the styling
js/content.js     the portfolio content (edit this to update the site)
js/art.js         pixel art: tiles, buildings, characters, the tiny sign font
js/game.js        the game: map, movement, dialogue, battles, badges
assets/photos/    photos used in the About, Contact and Travel sections
```

## Tech

Plain HTML, CSS and JavaScript. No frameworks or libraries.
