/* Paints the console shell and the night sky behind it as pixel art.
   Each piece is drawn on a tiny canvas and stretched with crisp pixels. */
(function () {
  'use strict';

  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* A rounded box with a one-pixel outline, a highlight on the top-left and shade on the bottom-right.
     o.r = corner radii [tl, tr, br, bl]; o.open = a side that joins another piece (no outline there). */
  function box(g, w, h, o) {
    const [tl, tr, br, bl] = o.r;
    const inside = (x, y) => {
      if (o.open === 'bottom' && y >= h) return x >= 0 && x < w;
      if (o.open === 'top' && y < 0) return x >= 0 && x < w;
      if (o.open === 'right' && x >= w) return y >= 0 && y < h;
      if (o.open === 'left' && x < 0) return y >= 0 && y < h;
      if (x < 0 || y < 0 || x >= w || y >= h) return false;
      let r, cx, cy;
      if (x < tl && y < tl) { r = tl; cx = tl; cy = tl; }
      else if (x >= w - tr && y < tr) { r = tr; cx = w - tr; cy = tr; }
      else if (x >= w - br && y >= h - br) { r = br; cx = w - br; cy = h - br; }
      else if (x < bl && y >= h - bl) { r = bl; cx = bl; cy = h - bl; }
      else return true;
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      return dx * dx + dy * dy <= r * r;
    };
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!inside(x, y)) continue;
        let c = o.fill;
        if (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)) c = o.ink;
        else if (!inside(x, y - 2) || !inside(x - 2, y)) c = o.light;
        else if (!inside(x, y + 2) || !inside(x + 2, y)) c = o.dark;
        else if (o.shade) {
          const t = (y - h * 0.45) / (h * 0.55);
          if (t > 0 && BAYER[(y % 4) * 4 + (x % 4)] / 16 < t * 0.75) c = o.shade;
        }
        g.fillStyle = c;
        g.fillRect(x, y, 1, 1);
      }
    }
  }

  const SHELL = { fill: '#2c2c36', light: '#5c5c70', dark: '#121218', ink: '#000000', shade: '#22222b' };
  const KEY = { fill: '#3d3d49', light: '#7c7c90', dark: '#1c1c24', ink: '#000000', shade: '#30303a' };
  const WELL = { fill: '#0b0b10', light: '#000000', dark: '#22222c', ink: '#000000' };

  function arrow(g, w, h, dir) {
    g.fillStyle = '#b4b8c6';
    const cx = w >> 1, cy = h >> 1;
    for (let i = 0; i < 3; i++) {
      if (dir === 'up') g.fillRect(cx - i, cy - 1 + i, i * 2 + 1, 1);
      if (dir === 'down') g.fillRect(cx - i, cy + 1 - i, i * 2 + 1, 1);
      if (dir === 'left') g.fillRect(cx - 1 + i, cy - i, 1, i * 2 + 1);
      if (dir === 'right') g.fillRect(cx + 1 - i, cy - i, 1, i * 2 + 1);
    }
  }

  function paintShell() {
    const con = document.querySelector('.console');
    if (!con) return;
    const cw = con.getBoundingClientRect().width;
    if (!cw) return;
    const P = Math.max(2, Math.round(cw / 230)); // size of one shell "pixel" on screen
    const paint = (sel, fn) => document.querySelectorAll(sel).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const w = Math.max(3, Math.round(r.width / P)), h = Math.max(3, Math.round(r.height / P));
      const c = mk(w, h);
      fn(c.getContext('2d'), w, h, el);
      el.style.backgroundImage = 'url(' + c.toDataURL() + ')';
    });
    const round = (w, h) => { const r = Math.min(w, h) / 2; return [r, r, r, r]; };

    paint('.lid', (g, w, h) => box(g, w, h, Object.assign({ r: [9, 9, 2, 2] }, SHELL)));
    paint('.base', (g, w, h) => box(g, w, h, Object.assign({ r: [2, 2, 10, 10] }, SHELL)));
    paint('.hinge', (g, w, h) => box(g, w, h, { r: [0, 0, 1, 1], fill: '#1d1d25', light: '#3c3c4a', dark: '#0c0c10', ink: '#000000' }));
    paint('.lid-inner', (g, w, h) => box(g, w, h, { r: [4, 4, 4, 4], fill: '#07070b', light: '#07070b', dark: '#15151d', ink: '#000000' }));
    paint('.grill', (g, w, h) => {
      g.fillStyle = '#4a4a5e';
      for (let y = 1; y < h - 1; y += 3) for (let x = 1; x < w - 1; x += 3) g.fillRect(x, y, 1, 1);
    });
    paint('.stick', (g, w, h) => box(g, w, h, Object.assign({ r: round(w, h) }, WELL)));
    paint('.stick i', (g, w, h) => box(g, w, h, Object.assign({ r: round(w, h) }, KEY)));
    paint('.abxy button', (g, w, h) => box(g, w, h, Object.assign({ r: round(w, h) }, KEY)));
    paint('.sys button', (g, w, h) => box(g, w, h, Object.assign({ r: [2, 2, 2, 2] }, KEY, { shade: null })));
    const open = { up: 'bottom', down: 'top', left: 'right', right: 'left' };
    paint('.dpad button', (g, w, h, el) => {
      const d = el.dataset.key;
      box(g, w, h, Object.assign({ r: [1, 1, 1, 1], open: open[d] }, KEY, { shade: null }));
      arrow(g, w, h, d);
    });
    paint('.dpad span', (g, w, h) => {
      g.fillStyle = KEY.fill; g.fillRect(0, 0, w, h);
      g.fillStyle = KEY.dark; g.fillRect((w >> 1) - 1, (h >> 1) - 1, 3, 3);
      g.fillStyle = KEY.light; g.fillRect((w >> 1) - 1, (h >> 1) - 1, 2, 2);
    });
  }

  /* The backdrop: a night sky over a sleeping town. */
  function paintScene() {
    const view = document.getElementById('game-view');
    if (!view) return;
    const W = 320, H = 200, c = mk(W, H), g = c.getContext('2d'), R = rng(5);
    const sky = ['#12123a', '#191a4a', '#22235c', '#2e2a6e', '#412f7c', '#573585', '#733c88', '#93458a'];
    const bh = (H * 0.86) / sky.length;
    for (let y = 0; y < H; y++) {
      const i = Math.min(sky.length - 1, (y / bh) | 0), t = (y % bh) / bh;
      for (let x = 0; x < W; x++) {
        const next = sky[Math.min(sky.length - 1, i + 1)];
        g.fillStyle = BAYER[(y % 4) * 4 + (x % 4)] / 16 < (t - 0.35) * 1.5 ? next : sky[i];
        g.fillRect(x, y, 1, 1);
      }
    }
    // stars
    const tints = ['#ffffff', '#ffe9a8', '#c4c6ff', '#8f93d8'];
    for (let i = 0; i < 150; i++) {
      g.fillStyle = tints[(R() * tints.length) | 0];
      g.fillRect((R() * W) | 0, (R() * H * 0.62) | 0, 1, 1);
    }
    for (let i = 0; i < 9; i++) {
      const x = 6 + ((R() * (W - 12)) | 0), y = 5 + ((R() * H * 0.5) | 0);
      g.fillStyle = '#ffffff';
      g.fillRect(x - 1, y, 3, 1);
      g.fillRect(x, y - 1, 1, 3);
    }
    // moon
    const mx = 252, my = 40, mr = 13;
    for (let y = -mr; y <= mr; y++) for (let x = -mr; x <= mr; x++) {
      if (x * x + y * y > mr * mr) continue;
      g.fillStyle = (x - 5) * (x - 5) + (y + 4) * (y + 4) > 190 ? '#d9c98f' : '#fff4c8';
      g.fillRect(mx + x, my + y, 1, 1);
    }
    g.fillStyle = '#e6d69e';
    [[-5, -3, 3], [2, 4, 2], [-2, 6, 2], [4, -6, 2]].forEach(([x, y, s]) => g.fillRect(mx + x, my + y, s, s));
    // clouds
    [[30, 52, 46], [118, 30, 34], [182, 70, 54], [278, 88, 40]].forEach(([x, y, w]) => {
      g.fillStyle = '#3d3480';
      g.fillRect(x + 6, y, w - 16, 3);
      g.fillRect(x, y + 3, w, 4);
      g.fillRect(x + 10, y + 7, w - 22, 2);
      g.fillStyle = '#51459a';
      g.fillRect(x + 8, y, w - 22, 1);
      g.fillRect(x + 2, y + 3, w - 10, 1);
    });
    // far and near hills
    const hills = (base, a1, f1, a2, f2, ph, col) => {
      g.fillStyle = col;
      for (let x = 0; x < W; x++) {
        const top = Math.round(base + Math.sin(x / f1 + ph) * a1 + Math.sin(x / f2 + ph * 2) * a2);
        g.fillRect(x, top, 1, H - top);
      }
    };
    hills(150, 12, 37, 4, 11, 0, '#2a2462');
    hills(166, 8, 23, 2, 7, 2, '#1f1b50');
    // pines along the near ridge
    g.fillStyle = '#1f1b50';
    for (let x = 4; x < W; x += 5 + ((R() * 9) | 0)) {
      const top = Math.round(166 + Math.sin(x / 23 + 2) * 8 + Math.sin(x / 7 + 4) * 2);
      for (let i = 0; i < 4; i++) g.fillRect(x - i, top - 8 + i * 2, i * 2 + 1, 2);
    }
    // the town
    g.fillStyle = '#131138';
    g.fillRect(0, 184, W, H - 184);
    for (let x = 3; x < W - 12; x += 13 + ((R() * 12) | 0)) {
      const w = 9 + ((R() * 9) | 0), h = 7 + ((R() * 10) | 0), y = 185 - h;
      g.fillStyle = '#131138';
      g.fillRect(x, y, w, h);
      for (let i = 0; i <= (w >> 1); i++) g.fillRect(x + i, y - (w >> 1) + i - 1, w - i * 2, 1);
      for (let wy = y + 2; wy < 183; wy += 4) for (let wx = x + 2; wx < x + w - 2; wx += 4) {
        if (R() < 0.55) { g.fillStyle = R() < 0.8 ? '#ffd23f' : '#ff9f1c'; g.fillRect(wx, wy, 2, 2); }
      }
    }
    g.fillStyle = '#0d0c2a';
    g.fillRect(0, 192, W, H - 192);
    view.style.backgroundImage = 'url(' + c.toDataURL() + ')';
  }

  let timer = null;
  function refresh() { clearTimeout(timer); timer = setTimeout(paintShell, 80); }
  paintScene();
  paintShell();
  window.addEventListener('resize', refresh);
  window.addEventListener('load', paintShell);
  // the console is hidden while the classic view is open, so repaint when coming back
  new MutationObserver(refresh).observe(document.body, { attributes: true, attributeFilter: ['data-view'] });
})();
