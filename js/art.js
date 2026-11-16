/* Pixel art, drawn in code. No image files are used for the game world. */
(function () {
  'use strict';
  const TS = 16;

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

  /* ---------- ground tiles ---------- */

  function grass(g, x, y, rnd) {
    r(g, x, y, TS, TS, '#7ccf57');
    for (let i = 0; i < 6; i++) {
      const a = (rnd() * 15) | 0, b = (rnd() * 14) | 0;
      r(g, x + a, y + b, 1, 1, '#a4e67a');
      r(g, x + a, y + b + 1, 1, 1, '#58ad42');
    }
  }

  function flower(g, x, y, rnd) {
    grass(g, x, y, rnd);
    const cols = ['#ff5d73', '#ffffff', '#ffd23f', '#f15bb5', '#8fd0ff'];
    for (let i = 0; i < 3; i++) {
      const a = 2 + ((rnd() * 11) | 0), b = 2 + ((rnd() * 11) | 0);
      const c = cols[(rnd() * cols.length) | 0];
      r(g, x + a - 1, y + b, 3, 1, c);
      r(g, x + a, y + b - 1, 1, 3, c);
      r(g, x + a, y + b, 1, 1, c === '#ffd23f' ? '#ff9f1c' : '#ffd23f');
    }
  }

  function tall(g, x, y) {
    r(g, x, y, TS, TS, '#3f9c45');
    for (let band = 0; band < 2; band++) {
      const by = y + band * 8;
      for (let i = 0; i < TS; i++) {
        const h = 3 + ((i * 7 + band * 3) % 4);
        r(g, x + i, by + 8 - h, 1, h, i % 2 ? '#63c458' : '#2f7f38');
        r(g, x + i, by + 8 - h, 1, 1, '#9be07c');
      }
    }
  }

  /* The front half of a tall-grass tile, drawn over a character's legs. */
  function tallFront(g, x, y) {
    for (let i = 0; i < TS; i++) {
      const h = 3 + ((i * 7 + 3) % 4);
      r(g, x + i, y + 16 - h, 1, h, i % 2 ? '#63c458' : '#2f7f38');
      r(g, x + i, y + 16 - h, 1, 1, '#9be07c');
    }
  }

  function path(g, x, y, rnd) {
    r(g, x, y, TS, TS, '#f0dca0');
    for (let i = 0; i < 5; i++) {
      r(g, x + ((rnd() * 15) | 0), y + ((rnd() * 15) | 0), 2, 1, '#dcc380');
      r(g, x + ((rnd() * 16) | 0), y + ((rnd() * 16) | 0), 1, 1, '#fbf1cc');
    }
  }

  function water(g, x, y, frame, shoreTop) {
    r(g, x, y, TS, TS, '#4c9fe6');
    const s = frame * 3;
    r(g, x + ((2 + s) % 13), y + 4, 3, 1, '#a9dcff');
    r(g, x + ((9 + s) % 13), y + 9, 3, 1, '#a9dcff');
    r(g, x + ((5 + s) % 13), y + 13, 2, 1, '#7fc2f5');
    if (shoreTop) {
      r(g, x, y, TS, 2, '#3577c2');
      r(g, x, y + 2, TS, 1, '#cfeaff');
    }
  }

  function tree(g, x, y, rnd) {
    grass(g, x, y, rnd);
    r(g, x + 4, y + 13, 9, 2, '#58ad42');
    r(g, x + 6, y + 10, 4, 5, '#7b4a2b');
    r(g, x + 6, y + 10, 1, 5, '#5c3520');
    const rows = [
      [5, 6], [3, 10], [2, 12], [1, 14], [1, 14], [0, 16], [0, 16], [0, 16], [1, 14], [1, 14], [2, 12], [4, 8],
    ];
    rows.forEach(([o, w], i) => r(g, x + o, y + i, w, 1, '#2f9146'));
    r(g, x + 4, y + 2, 5, 1, '#57c064');
    r(g, x + 3, y + 3, 6, 2, '#57c064');
    r(g, x + 3, y + 5, 3, 1, '#57c064');
    r(g, x + 9, y + 8, 5, 2, '#1f7038');
    r(g, x + 6, y + 10, 7, 1, '#1f7038');
    r(g, x + 11, y + 6, 3, 2, '#1f7038');
  }

  function fence(g, x, y, rnd) {
    grass(g, x, y, rnd);
    r(g, x, y + 6, TS, 2, '#d9a465');
    r(g, x, y + 8, TS, 1, '#a8733e');
    r(g, x, y + 11, TS, 2, '#d9a465');
    r(g, x, y + 13, TS, 1, '#a8733e');
    r(g, x + 2, y + 3, 3, 12, '#c48a4b');
    r(g, x + 2, y + 3, 3, 1, '#ecc48c');
    r(g, x + 11, y + 3, 3, 12, '#c48a4b');
    r(g, x + 11, y + 3, 3, 1, '#ecc48c');
  }

  function sign(g, x, y, rnd) {
    grass(g, x, y, rnd);
    r(g, x + 7, y + 9, 2, 6, '#7b4a2b');
    r(g, x + 2, y + 2, 12, 8, '#7b4a2b');
    r(g, x + 3, y + 3, 10, 6, '#e3b06d');
    r(g, x + 4, y + 4, 8, 1, '#7b4a2b');
    r(g, x + 4, y + 6, 6, 1, '#7b4a2b');
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

  function building(g, b) {
    const x = b.x * TS, y = b.y * TS, W = 5 * TS, H = 4 * TS, ink = '#2b2140';
    // shadow on the grass
    r(g, x + 3, y + H, W - 2, 2, 'rgba(0,0,0,.18)');
    // walls
    r(g, x, y + 26, W, H - 26, '#fbf0d4');
    r(g, x, y + H - 4, W, 4, '#d6c7a2');
    r(g, x, y + 26, 2, H - 26, '#e6d8b4');
    r(g, x + W - 2, y + 26, 2, H - 26, '#d6c7a2');
    // roof
    r(g, x, y, W, 28, b.roof);
    for (let i = 5; i < 26; i += 5) r(g, x, y + i, W, 1, b.roofD);
    for (let i = 0; i < W; i += 10) for (let j = 0; j < 25; j += 10) r(g, x + i + (j % 20 ? 5 : 0), y + j + 1, 1, 4, b.roofD);
    r(g, x, y, W, 2, '#ffffff66');
    r(g, x, y + 26, W, 3, b.roofD);
    r(g, x, y + 29, W, 1, 'rgba(0,0,0,.2)');
    // door
    const dx = x + 2 * TS;
    r(g, dx + 1, y + H - 17, 14, 17, ink);
    r(g, dx + 2, y + H - 16, 12, 16, '#9a6238');
    r(g, dx + 2, y + H - 16, 12, 2, '#b97c4b');
    r(g, dx + 4, y + H - 13, 8, 5, '#7b4a2b');
    r(g, dx + 11, y + H - 7, 2, 2, '#ffd23f');
    // windows
    [x + 8, x + W - 20].forEach((wx) => {
      r(g, wx, y + H - 22, 12, 11, ink);
      r(g, wx + 1, y + H - 21, 10, 9, '#9bdcff');
      r(g, wx + 1, y + H - 21, 10, 2, '#d8f3ff');
      r(g, wx + 5, y + H - 21, 1, 9, ink);
      r(g, wx + 1, y + H - 17, 10, 1, ink);
    });
    // name plate
    const tw = b.label.length * 4 - 1, px = x + ((W - tw) >> 1) - 3;
    r(g, px, y + 31, tw + 6, 9, ink);
    r(g, px + 1, y + 32, tw + 4, 7, '#ffffff');
    text(g, b.label, px + 3, y + 33, ink);
    // outline
    g.strokeStyle = ink;
    g.lineWidth = 1;
    g.strokeRect(x + 0.5, y + 0.5, W - 1, H - 1);
  }

  /* ---------- characters ---------- */

  const BODY = {
    down: [
      '................',
      '....HHHHHHHH....',
      '...HHhHHHHhHH...',
      '..HHHHHhHHHHHH..',
      '..HHHHHHHHHHHH..',
      '..HHSSSSSSSSHH..',
      '..HGGGGSSGGGGH..',
      '...GwEGSSGwEG...',
      '...SGGSSSSGGS...',
      '....SSSssSSS....',
      '...RRWWWWWWRR...',
      '..RRRWWWWWWRRR..',
      '..SRRWWWWWWRRS..',
      '...RRPPPPPPRR...',
    ],
    up: [
      '................',
      '....HHHHHHHH....',
      '...HHhHHHHhHH...',
      '..HHHHHhHHHHHH..',
      '..HHHHHHHHHHHH..',
      '..HHHhHHHHHHHH..',
      '..HHHHHHHhHHHH..',
      '...HHHHHHHHHH...',
      '...SHHHHHHHHS...',
      '....SSSSSSSS....',
      '...RRRRRRRRRR...',
      '..RRRRrRRrRRRR..',
      '..SRRRRRRRRRRS..',
      '...RRPPPPPPRR...',
    ],
    left: [
      '................',
      '....HHHHHHHH....',
      '...HHHhHHHHHH...',
      '..HHHHHHHhHHHH..',
      '..HHHHHHHHHHHH..',
      '..SSSSSHHHHHHH..',
      '..GGGGSSHHHHHH..',
      '..GEwGSSSHHHH...',
      '..SGGSSSSSHH....',
      '...SSSSsSS......',
      '....RRRRRRR.....',
      '....RRRSRRR.....',
      '....RRRSRRR.....',
      '....RRPPPPR.....',
    ],
  };
  const LEGS = {
    front: [
      ['....PPP..PPP....', '....BBB..BBB....'],
      ['....PPP..PPP....', '....BBB.........'],
      ['....PPP..PPP....', '.........BBB....'],
    ],
    side: [
      ['.....PPPPP......', '.....BBBBB......'],
      ['....PPPPPPP.....', '...BBB...BBB....'],
      ['.....PPPP.......', '.....BBBB.......'],
    ],
  };

  const PLAYER = {
    H: '#2a1b1a', h: '#4b302b', S: '#b97a52', s: '#96593c', G: '#17131f', w: '#ffffff', E: '#17131f',
    R: '#b9433f', r: '#8d302e', W: '#f4efe4', P: '#30364d', B: '#17131f',
  };

  function npcPalette(hair, shirt, skin) {
    const sk = skin || '#e2a97c';
    return {
      H: hair, h: hair, S: sk, s: sk, G: sk, w: sk, E: '#17131f',
      R: shirt, r: shirt, W: shirt, P: '#3d3558', B: '#17131f',
    };
  }

  /* Sheet layout: rows = down, left, right, up. Columns = stand, step A, step B. */
  function character(pal) {
    const sheet = canvas(TS * 3, TS * 4);
    const g = sheet.getContext('2d');
    const dirs = ['down', 'left', 'right', 'up'];
    dirs.forEach((dir, row) => {
      const side = dir === 'left' || dir === 'right';
      const body = BODY[side ? 'left' : dir];
      for (let f = 0; f < 3; f++) {
        const rows = body.concat(LEGS[side ? 'side' : 'front'][f]);
        rows.forEach((line, y) => {
          if (line.length !== TS) console.warn('sprite row width', dir, y, line.length);
          for (let x = 0; x < TS; x++) {
            const c = pal[line[x]];
            if (!c) continue;
            const dx = dir === 'right' ? TS - 1 - x : x;
            r(g, f * TS + dx, row * TS + y, 1, 1, c);
          }
        });
      }
    });
    return sheet;
  }

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
    const pal = { O: '#2b2140', G: '#58ad42', w: '#ffffff', E: '#17131f', P: body, p: spot };
    BUG.forEach((line, y) => {
      for (let x = 0; x < TS; x++) if (pal[line[x]]) r(g, x, y, 1, 1, pal[line[x]]);
    });
    return c;
  }

  window.Art = {
    TS, rng, canvas, grass, flower, tall, tallFront, path, water, tree, fence, sign, building, character, bug,
    PLAYER, npcPalette,
  };
})();
