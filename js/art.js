/* Pixel art, drawn in code. No image files are used for the game world. */
(function () {
  'use strict';
  const TS = 16;
  const INK = '#2b2140';

  function rng(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function r(g, x, y, w, h, c) {
    g.fillStyle = c;
    g.fillRect(x, y, w, h);
  }

  function bitmap(g, rows, x, y, pal) {
    rows.forEach((line, j) => {
      for (let i = 0; i < line.length; i++) if (pal[line[i]]) r(g, x + i, y + j, 1, 1, pal[line[i]]);
    });
  }

  /* ---------- ground tiles ---------- */

  function grass(g, x, y, rnd, tx, ty) {
    r(g, x, y, TS, TS, (tx + ty) % 2 ? '#79cc55' : '#80d35b');
    for (let i = 0; i < 5; i++) {
      const a = (rnd() * 14) | 0, b = (rnd() * 13) | 0;
      r(g, x + a, y + b, 1, 1, '#a9ea80');
      r(g, x + a, y + b + 1, 1, 1, '#5cb146');
      r(g, x + a + 1, y + b + 1, 1, 1, '#5cb146');
    }
  }

  function flower(g, x, y, rnd, tx, ty) {
    grass(g, x, y, rnd, tx, ty);
    const cols = ['#ff5d73', '#ffffff', '#ffd23f', '#f15bb5', '#8fd0ff'];
    for (let i = 0; i < 3; i++) {
      const a = 2 + ((rnd() * 11) | 0), b = 3 + ((rnd() * 10) | 0);
      const c = cols[(rnd() * cols.length) | 0];
      r(g, x + a, y + b + 1, 1, 2, '#3f9c45');
      r(g, x + a - 1, y + b, 3, 1, c);
      r(g, x + a, y + b - 1, 1, 3, c);
      r(g, x + a, y + b, 1, 1, c === '#ffd23f' ? '#ff9f1c' : '#ffd23f');
    }
  }

  function blades(g, x, y0, band) {
    for (let i = 0; i < TS; i++) {
      const h = 3 + ((i * 7 + band * 3) % 4);
      r(g, x + i, y0 + 8 - h, 1, h, i % 2 ? '#63c458' : '#2f7f38');
      r(g, x + i, y0 + 8 - h, 1, 1, '#a5e886');
    }
  }
  function tall(g, x, y) {
    r(g, x, y, TS, TS, '#3f9c45');
    blades(g, x, y, 0);
    blades(g, x, y + 8, 1);
  }
  /* The front half of a tall-grass tile, drawn over a character's legs. */
  function tallFront(g, x, y) {
    blades(g, x, y + 8, 1);
  }

  /* n = which neighbours are NOT the same kind of tile: { u, d, l, r } */
  function path(g, x, y, rnd, n) {
    r(g, x, y, TS, TS, '#f2dfa6');
    for (let i = 0; i < 4; i++) {
      r(g, x + 1 + ((rnd() * 13) | 0), y + 1 + ((rnd() * 13) | 0), 2, 1, '#dfc888');
      r(g, x + 1 + ((rnd() * 14) | 0), y + 1 + ((rnd() * 14) | 0), 1, 1, '#fdf4d2');
    }
    const edge = '#c9ad68', lip = '#5cb146';
    if (n.u) { r(g, x, y, TS, 1, lip); r(g, x, y + 1, TS, 1, edge); }
    if (n.d) { r(g, x, y + 15, TS, 1, lip); r(g, x, y + 14, TS, 1, edge); }
    if (n.l) { r(g, x, y, 1, TS, lip); r(g, x + 1, y, 1, TS, edge); }
    if (n.r) { r(g, x + 15, y, 1, TS, lip); r(g, x + 14, y, 1, TS, edge); }
    const grassC = '#79cc55';
    if (n.u && n.l) { r(g, x, y, 3, 1, grassC); r(g, x, y, 1, 3, grassC); r(g, x + 1, y + 1, 1, 1, lip); }
    if (n.u && n.r) { r(g, x + 13, y, 3, 1, grassC); r(g, x + 15, y, 1, 3, grassC); r(g, x + 14, y + 1, 1, 1, lip); }
    if (n.d && n.l) { r(g, x, y + 15, 3, 1, grassC); r(g, x, y + 13, 1, 3, grassC); r(g, x + 1, y + 14, 1, 1, lip); }
    if (n.d && n.r) { r(g, x + 13, y + 15, 3, 1, grassC); r(g, x + 15, y + 13, 1, 3, grassC); r(g, x + 14, y + 14, 1, 1, lip); }
  }

  function water(g, x, y, frame, n, rnd) {
    r(g, x, y, TS, TS, '#4c9fe6');
    r(g, x, y + 8, TS, 8, '#4698e0');
    const s = frame * 3;
    r(g, x + ((2 + s) % 12), y + 5, 3, 1, '#b4e2ff');
    r(g, x + ((9 + s) % 12), y + 10, 3, 1, '#b4e2ff');
    r(g, x + ((5 + s) % 13), y + 13, 2, 1, '#86c8f8');
    if (!n.u && !n.d && !n.l && !n.r && rnd() < 0.3) {
      const a = 3 + ((rnd() * 7) | 0), b = 4 + ((rnd() * 6) | 0);
      r(g, x + a, y + b, 5, 3, '#3f9c45');
      r(g, x + a + 1, y + b - 1, 3, 5, '#3f9c45');
      r(g, x + a + 1, y + b, 2, 1, '#7ccf57');
      r(g, x + a + 3, y + b + 1, 1, 1, '#f15bb5');
    }
    if (n.u) { r(g, x, y, TS, 3, '#2f6fb8'); r(g, x, y + 3, TS, 1, '#d9f0ff'); r(g, x + ((frame * 5 + 3) % 12), y + 4, 4, 1, '#d9f0ff'); }
    if (n.d) { r(g, x, y + 15, TS, 1, '#d9f0ff'); r(g, x, y + 14, TS, 1, '#7fc2f5'); }
    if (n.l) { r(g, x, y, 1, TS, '#d9f0ff'); r(g, x + 1, y, 1, TS, '#7fc2f5'); }
    if (n.r) { r(g, x + 15, y, 1, TS, '#d9f0ff'); r(g, x + 14, y, 1, TS, '#7fc2f5'); }
  }

  function shadow(g, x, y) {
    r(g, x + 2, y + 12, 12, 3, 'rgba(20,60,30,.28)');
    r(g, x + 4, y + 11, 8, 5, 'rgba(20,60,30,.28)');
  }

  function fence(g, x, y, rnd, tx, ty) {
    grass(g, x, y, rnd, tx, ty);
    r(g, x, y + 14, TS, 1, 'rgba(20,60,30,.25)');
    r(g, x, y + 5, TS, 3, '#e0ad70');
    r(g, x, y + 5, TS, 1, '#f3d2a0');
    r(g, x, y + 8, TS, 1, '#a8733e');
    r(g, x, y + 10, TS, 3, '#e0ad70');
    r(g, x, y + 10, TS, 1, '#f3d2a0');
    r(g, x, y + 13, TS, 1, '#a8733e');
    [2, 11].forEach((o) => {
      r(g, x + o, y + 2, 3, 13, '#c48a4b');
      r(g, x + o, y + 2, 3, 1, '#f3d2a0');
      r(g, x + o + 2, y + 3, 1, 12, '#a8733e');
    });
  }

  function sign(g, x, y, rnd, tx, ty) {
    grass(g, x, y, rnd, tx, ty);
    r(g, x + 4, y + 14, 8, 1, 'rgba(20,60,30,.28)');
    r(g, x + 7, y + 9, 2, 6, '#7b4a2b');
    r(g, x + 1, y + 1, 14, 9, INK);
    r(g, x + 2, y + 2, 12, 7, '#e8b877');
    r(g, x + 2, y + 2, 12, 1, '#f8dcab');
    r(g, x + 4, y + 4, 8, 1, '#7b4a2b');
    r(g, x + 4, y + 6, 6, 1, '#7b4a2b');
  }

  function bench(g, x, y, rnd, tx, ty) {
    grass(g, x, y, rnd, tx, ty);
    r(g, x + 1, y + 14, 14, 1, 'rgba(20,60,30,.28)');
    r(g, x + 1, y + 3, 14, 5, INK);
    r(g, x + 2, y + 4, 12, 1, '#f3d2a0');
    r(g, x + 2, y + 5, 12, 2, '#d99a55');
    r(g, x, y + 8, 16, 4, INK);
    r(g, x + 1, y + 9, 14, 2, '#e0ad70');
    r(g, x + 2, y + 12, 2, 3, INK);
    r(g, x + 12, y + 12, 2, 3, INK);
  }

  function mailbox(g, x, y, rnd, tx, ty) {
    grass(g, x, y, rnd, tx, ty);
    r(g, x + 4, y + 14, 8, 1, 'rgba(20,60,30,.28)');
    r(g, x + 7, y + 10, 2, 5, '#5c5670');
    r(g, x + 3, y + 2, 10, 9, INK);
    r(g, x + 4, y + 3, 8, 7, '#ff5d73');
    r(g, x + 4, y + 3, 8, 2, '#ff8a9a');
    r(g, x + 5, y + 6, 6, 1, INK);
    r(g, x + 12, y + 4, 2, 3, '#ffd23f');
  }

  /* ---------- tall props, drawn above the ground and depth-sorted ---------- */

  function treeSprite() {
    const c = canvas(TS, 20), g = c.getContext('2d');
    const mid = '#2f9146', light = '#5ec66a', dark = '#1f7038', ink = '#14492a';
    r(g, 6, 13, 4, 7, '#7b4a2b');
    r(g, 6, 13, 1, 7, '#5c3520');
    r(g, 9, 14, 1, 6, '#9a6238');
    r(g, 5, 19, 6, 1, '#5c3520');
    const rows = [[5, 6], [3, 10], [2, 12], [1, 14], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [0, 16], [1, 14], [1, 14], [2, 12], [4, 8]];
    rows.forEach(([o, w], i) => {
      r(g, o, i, w, 1, mid);
      if (i > 0 && i < 7) r(g, o + 1, i, Math.max(2, (w * 0.42) | 0), 1, light);
      if (i > 7) r(g, o + ((w * 0.45) | 0), i, w - ((w * 0.45) | 0) - 1, 1, dark);
      r(g, o, i, 1, 1, ink);
      r(g, o + w - 1, i, 1, 1, ink);
    });
    r(g, 5, 0, 6, 1, ink);
    r(g, 4, 13, 8, 1, ink);
    // leaf clumps
    [[4, 4], [9, 3], [6, 7], [11, 6], [3, 9], [8, 10]].forEach(([a, b]) => { r(g, a, b, 2, 1, dark); r(g, a + 2, b - 1, 1, 1, dark); });
    [[3, 2], [6, 4], [2, 6]].forEach(([a, b]) => r(g, a, b, 2, 1, '#93e08f'));
    return c;
  }

  function lampSprite() {
    const c = canvas(TS, 26), g = c.getContext('2d');
    r(g, 7, 9, 2, 16, '#3d3558');
    r(g, 7, 9, 1, 16, '#5c5670');
    r(g, 5, 24, 6, 2, '#3d3558');
    r(g, 4, 1, 8, 9, INK);
    r(g, 5, 3, 6, 6, '#ffe58a');
    r(g, 6, 4, 3, 3, '#fffbe0');
    r(g, 3, 1, 10, 2, '#3d3558');
    r(g, 6, 0, 4, 1, '#3d3558');
    return c;
  }

  /* ---------- 3x5 pixel font for building signs ---------- */

  const GLYPHS = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
    E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
    I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100',
    Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', ' ': '000000000000000',
  };

  function text(g, str, x, y, color) {
    g.fillStyle = color;
    for (const ch of str) {
      const bits = GLYPHS[ch] || GLYPHS[' '];
      for (let i = 0; i < 15; i++) if (bits[i] === '1') g.fillRect(x + (i % 3), y + ((i / 3) | 0), 1, 1);
      x += 4;
    }
  }

  /* ---------- buildings (5 x 4 tiles) ---------- */

  const EMBLEMS = {
    about: ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'],
    projects: ['..XXX..', '...X...', '...X...', '..XXX..', '.XXXXX.', 'XXXXXXX'],
    academy: ['XXX.XXX', 'XXX.XXX', 'XXX.XXX', 'XXX.XXX', 'XXXXXXX', '.......'],
    experience: ['..XXX..', '.X...X.', 'XXXXXXX', 'XXX.XXX', 'XXXXXXX', 'XXXXXXX'],
    contact: ['XXXXXXX', 'XX...XX', 'X.X.X.X', 'X..X..X', 'X.....X', 'XXXXXXX'],
    travel: ['.XX....', 'XXXXXXX', 'X.XXX.X', 'X.X.X.X', 'X.XXX.X', 'XXXXXXX'],
    hobbies: ['.......', '.XXXXX.', 'XXXXXXX', 'X.XXX.X', 'XXXXXXX', 'XX...XX'],
  };

  function building(g, b) {
    const x = b.x * TS, y = b.y * TS, W = 5 * TS, H = 4 * TS;
    // ground shadow
    r(g, x + 2, y + H, W - 2, 3, 'rgba(20,60,30,.3)');
    // walls (inset under the roof)
    r(g, x + 2, y + 26, W - 4, H - 26, INK);
    r(g, x + 3, y + 26, W - 6, H - 27, '#fdf3d9');
    r(g, x + 3, y + 26, 3, H - 27, '#efe2bf');
    r(g, x + W - 6, y + 26, 3, H - 27, '#dccda8');
    r(g, x + 3, y + H - 5, W - 6, 4, '#b9a988');
    r(g, x + 3, y + H - 5, W - 6, 1, '#d6c7a2');
    // roof
    r(g, x, y + 1, W, 28, INK);
    r(g, x + 1, y + 2, W - 2, 25, b.roof);
    for (let j = 0; j < 5; j++) {
      const ry = y + 2 + j * 5;
      r(g, x + 1, ry + 4, W - 2, 1, b.roofD);
      for (let i = (j % 2) * 4 + 3; i < W - 2; i += 8) r(g, x + i, ry, 1, 4, b.roofD);
    }
    r(g, x + 1, y + 2, W - 2, 2, 'rgba(255,255,255,.4)');
    r(g, x + 1, y + 24, W - 2, 3, b.roofD);
    r(g, x + 3, y + 29, W - 6, 2, 'rgba(43,33,64,.22)');
    // chimney
    r(g, x + W - 18, y - 3, 9, 9, INK);
    r(g, x + W - 17, y - 2, 7, 8, '#c9bfa5');
    r(g, x + W - 17, y - 2, 7, 2, '#f6f1e4');
    // emblem plaque on the roof
    const ex = x + (W >> 1) - 6;
    r(g, ex, y + 7, 13, 12, INK);
    r(g, ex + 1, y + 8, 11, 10, '#ffffff');
    bitmap(g, EMBLEMS[b.id] || [], ex + 3, y + 10, { X: b.roofD });
    // door with step
    const dx = x + 2 * TS;
    r(g, dx, y + H - 19, 16, 19, INK);
    r(g, dx + 1, y + H - 18, 14, 17, '#9a6238');
    r(g, dx + 1, y + H - 18, 14, 2, '#c58a55');
    r(g, dx + 3, y + H - 14, 4, 5, '#7b4a2b');
    r(g, dx + 9, y + H - 14, 4, 5, '#7b4a2b');
    r(g, dx + 3, y + H - 7, 4, 4, '#7b4a2b');
    r(g, dx + 9, y + H - 7, 4, 4, '#7b4a2b');
    r(g, dx + 12, y + H - 9, 2, 2, '#ffd23f');
    r(g, dx - 1, y + H - 1, 18, 2, '#8d86a8');
    r(g, dx - 1, y + H - 1, 18, 1, '#c9c4dc');
    // windows with flower boxes
    [x + 8, x + W - 21].forEach((wx) => {
      r(g, wx, y + H - 24, 13, 12, INK);
      r(g, wx + 1, y + H - 23, 11, 10, '#8fd4ff');
      r(g, wx + 1, y + H - 23, 11, 3, '#d8f3ff');
      r(g, wx + 2, y + H - 19, 3, 1, '#ffffff');
      r(g, wx + 6, y + H - 23, 1, 10, INK);
      r(g, wx + 1, y + H - 18, 11, 1, INK);
      r(g, wx - 1, y + H - 12, 15, 4, INK);
      r(g, wx, y + H - 11, 13, 2, '#9a6238');
      r(g, wx + 1, y + H - 13, 11, 2, '#3f9c45');
      [1, 5, 9].forEach((o, i) => r(g, wx + o + 1, y + H - 14, 2, 2, ['#ff5d73', '#ffd23f', '#f15bb5'][i]));
    });
    // name plate
    const tw = b.label.length * 4 - 1, px = x + ((W - tw) >> 1) - 3;
    r(g, px, y + 31, tw + 6, 9, INK);
    r(g, px + 1, y + 32, tw + 4, 7, '#ffffff');
    text(g, b.label, px + 3, y + 33, INK);
  }

  /* ---------- battle bug ---------- */

  const BUG = [
    '................',
    '..O..........O..',
    '...O........O...',
    '....OOOOOOOO....',
    '...OGGGGGGGGO...',
    '..OGwEGGGGwEGO..',
    '..OGGGGGGGGGGO..',
    '.OOPPPPOOPPPPOO.',
    'O.OPpPPOOPPpPO.O',
    '..OPPPPOOPPPPO..',
    '.OOPPpPOOPpPPOO.',
    'O.OPPPPOOPPPPO.O',
    '..OPPPPOOPPPPO..',
    '...OPPPOOPPPO...',
    '....OOO..OOO....',
    '................',
  ];

  function bug(body, spot) {
    const c = canvas(TS, TS), g = c.getContext('2d');
    bitmap(g, BUG, 0, 0, { O: INK, G: '#58ad42', w: '#ffffff', E: '#17131f', P: body, p: spot });
    return c;
  }

  window.Art = {
    TS, rng, canvas, grass, flower, tall, tallFront, path, water, shadow, fence, sign, bench, mailbox,
    treeSprite, lampSprite, building, bug,
  };
})();
