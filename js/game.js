/* Portfolio Town: a tiny top-down RPG that doubles as a portfolio. */
(function () {
  'use strict';

  const TS = Art.TS, VW = 256, VH = 192, MW = 40, MH = 30;
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const KEY_A = touch ? 'A' : 'Z', KEY_B = touch ? 'B' : 'X';

  const cv = $('#game'), ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  /* ---------- save data ---------- */

  const SAVE_KEY = 'portfolio-town-v1';
  const save = { badges: [], bugs: 0, sound: true, intro: false };
  try { Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); } catch (e) { /* private mode */ }
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* ignore */ } };

  /* ---------- world ---------- */

  const T = { GRASS: 0, FLOWER: 1, TALL: 2, PATH: 3, WATER: 4, TREE: 5, FENCE: 6, SIGN: 7, LAMP: 8, BENCH: 9, MAIL: 10 };
  const map = new Uint8Array(MW * MH);
  const set = (x, y, t) => { map[y * MW + x] = t; };
  const get = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH ? T.TREE : map[y * MW + x]);
  const fill = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, t); };

  const BUILDINGS = [
    { id: 'about', label: 'HOME', x: 5, y: 8, roof: '#ff5d73', roofD: '#d93a55' },
    { id: 'projects', label: 'PROJECT LAB', x: 12, y: 8, roof: '#3a86ff', roofD: '#2563c9' },
    { id: 'academy', label: 'ACADEMY', x: 23, y: 8, roof: '#8f5bd6', roofD: '#6c3fb0' },
    { id: 'experience', label: 'CAREER HALL', x: 30, y: 8, roof: '#ff9f1c', roofD: '#d97d06' },
    { id: 'contact', label: 'POST OFFICE', x: 5, y: 18, roof: '#2ec4b6', roofD: '#1c9c90' },
    { id: 'travel', label: 'PHOTO CLUB', x: 12, y: 18, roof: '#f15bb5', roofD: '#c83a92' },
    { id: 'hobbies', label: 'ARCADE', x: 23, y: 18, roof: '#ffd23f', roofD: '#d9a916' },
  ];
  BUILDINGS.forEach((b) => { b.door = { x: b.x + 2, y: b.y + 3 }; });

  const BADGES = [
    { id: 'about', name: 'HOME', c: '#ff5d73', where: 'the red HOME' },
    { id: 'projects', name: 'LAB', c: '#3a86ff', where: 'the blue PROJECT LAB' },
    { id: 'academy', name: 'ACADEMY', c: '#8f5bd6', where: 'the purple ACADEMY' },
    { id: 'experience', name: 'CAREER', c: '#ff9f1c', where: 'the orange CAREER HALL' },
    { id: 'contact', name: 'POST', c: '#2ec4b6', where: 'the teal POST OFFICE' },
    { id: 'travel', name: 'PHOTO', c: '#f15bb5', where: 'the pink PHOTO CLUB' },
    { id: 'hobbies', name: 'ARCADE', c: '#ffd23f', where: 'the yellow ARCADE' },
    { id: 'bug', name: 'BUG', c: '#58ad42', where: 'the tall grass in BUG MEADOW, east of the ARCADE' },
  ];

  const SIGNS = {
    '18,2': () => [
      'HALL OF FAME',
      save.badges.length >= BADGES.length
        ? 'All 8 badges collected. CAVIO is ready to join your party.'
        : `${save.badges.length} of 8 badges collected. Come back with all of them.`,
    ],
    '21,26': () => ['PORTFOLIO TOWN. Population: one developer.', 'Seven buildings, one meadow, eight badges.'],
    '28,19': () => ['BUG MEADOW', 'Wild bugs live in the tall grass. Walk in if you feel like debugging.'],
    '10,21': () => ['A bright red mailbox.', 'Mail for CAVIO goes to ' + Content.DATA.email + '. The POST OFFICE has the rest.'],
  };

  function buildMap() {
    const R = Art.rng(11);
    for (let i = 0; i < map.length; i++) map[i] = R() < 0.07 ? T.FLOWER : T.GRASS;
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (x < 2 || y < 2 || x >= MW - 2 || y >= MH - 2) set(x, y, T.TREE);
    for (let y = 2; y <= 4; y++) {
      for (let x = 2; x <= 13; x++) if (R() < 0.4) set(x, y, T.TREE);
      for (let x = 35; x <= 37; x++) if (R() < 0.5) set(x, y, T.TREE);
    }
    for (let y = 26; y <= 27; y++) for (let x = 2; x <= 37; x++) if ((x < 16 || x > 23) && R() < 0.35) set(x, y, T.TREE);
    fill(3, 15, 34, 2, T.PATH);
    fill(3, 22, 34, 2, T.PATH);
    fill(19, 5, 2, 22, T.PATH);
    fill(17, 3, 6, 2, T.PATH);
    [7, 14, 25, 32].forEach((x) => fill(x, 12, 1, 3, T.PATH));
    fill(24, 3, 9, 3, T.WATER);
    fill(29, 18, 8, 4, T.TALL);
    fill(29, 17, 9, 1, T.FENCE);
    Object.keys(SIGNS).forEach((k) => { const [x, y] = k.split(',').map(Number); set(x, y, T.SIGN); });
    set(10, 21, T.MAIL);
    [[18, 14], [21, 14], [18, 21], [21, 21], [16, 5], [23, 2]].forEach(([x, y]) => set(x, y, T.LAMP));
    [[11, 17], [24, 17], [22, 6]].forEach(([x, y]) => set(x, y, T.BENCH));
  }

  const ground = [null, null];
  let treeImg = null, lampImg = null;
  function renderGround() {
    treeImg = Art.treeSprite();
    lampImg = Art.lampSprite();
    const edges = (x, y, t) => ({ u: get(x, y - 1) !== t, d: get(x, y + 1) !== t, l: get(x - 1, y) !== t, r: get(x + 1, y) !== t });
    for (let f = 0; f < 2; f++) {
      const c = Art.canvas(MW * TS, MH * TS), g = c.getContext('2d');
      for (let y = 0; y < MH; y++) {
        for (let x = 0; x < MW; x++) {
          const rnd = Art.rng(x * 73 + y * 151 + 5), px = x * TS, py = y * TS;
          switch (get(x, y)) {
            case T.FLOWER: Art.flower(g, px, py, rnd, x, y); break;
            case T.TALL: Art.tall(g, px, py); break;
            case T.PATH: Art.path(g, px, py, rnd, edges(x, y, T.PATH)); break;
            case T.WATER: Art.water(g, px, py, f, edges(x, y, T.WATER), rnd); break;
            case T.TREE: case T.LAMP: Art.grass(g, px, py, rnd, x, y); Art.shadow(g, px, py); break;
            case T.FENCE: Art.fence(g, px, py, rnd, x, y); break;
            case T.SIGN: Art.sign(g, px, py, rnd, x, y); break;
            case T.BENCH: Art.bench(g, px, py, rnd, x, y); break;
            case T.MAIL: Art.mailbox(g, px, py, rnd, x, y); break;
            default: Art.grass(g, px, py, rnd, x, y);
          }
        }
      }
      BUILDINGS.forEach((b) => Art.building(g, b));
      ground[f] = c;
    }
  }

  /* ---------- characters ---------- */

  /* Character sprites come from sheets: every character is 3 frames wide and 4 directions tall. */
  const CW = 18, CH = 26, FACE = 64;
  const SPR = {};
  function loadSprites() {
    const files = { people: 'assets/sprites/townspeople.png', player: 'assets/sprites/player.png', faces: 'assets/sprites/portraits.png' };
    return Promise.all(Object.keys(files).map((k) => new Promise((resolve) => {
      const im = new Image();
      im.onload = () => { SPR[k] = im; resolve(); };
      im.onerror = () => resolve();
      im.src = files[k];
    })));
  }

  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const ROW = { down: 0, left: 1, right: 2, up: 3 };
  const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };

  const player = { x: 19, y: 25, fx: 19, fy: 25, t: 1, dir: 'left', moving: false, step: 0, sheet: null };

  const NPCS = [
    {
      name: 'LUMA', x: 18, y: 25, dir: 'right', sprite: [3, 1],
      lines: () => [
        'Every building in town holds part of CAVIO\'s story. Walk up to a door to go in.',
        `You have ${save.badges.length} of 8 badges. Seven come from buildings, one from the tall grass.`,
        'In a hurry? The CLASSIC VIEW button shows everything on one page.',
      ],
    },
    {
      name: 'ACE', x: 10, y: 14, dir: 'down', sprite: [0, 0],
      lines: () => ['Badminton is CAVIO\'s sport. Fast hands, faster feet.', 'CAVIO says a good rally feels like a good debugging session. You keep returning things until the other side gives up.'],
    },
    {
      name: 'POLLY', x: 16, y: 13, dir: 'down', sprite: [2, 2],
      lines: () => ['Ciao! Hola! Hello!', 'CAVIO speaks English, Bengali and Italian natively, plus a bit of Spanish.', 'That is four human languages and about seven programming ones.'],
    },
    {
      name: 'PIXEL', x: 23, y: 6, dir: 'down', sprite: [0, 2],
      lines: () => ['I am sketching the pond. Hold still, water.', 'CAVIO used to be an animator, and still draws digitally and edits videos.', 'You can tell. CAVIO cares how software looks and moves.'],
    },
    {
      name: 'ROCKY', x: 35, y: 13, dir: 'left', sprite: [0, 1],
      lines: () => ['I just hiked in from the Lake District. It rained. It always rains.', 'CAVIO has travelled to Japan, South Korea and Italy. The PHOTO CLUB has the pictures.'],
    },
    {
      name: 'STRIKER', x: 27, y: 17, dir: 'down', sprite: [3, 2],
      lines: () => ['Football fan? CAVIO works matchdays as a safety steward.', 'Tottenham, Nottingham Forest, Leyton Orient and Notts County. Four clubs, zero pitch invasions.'],
    },
    {
      name: 'ROMMY', x: 22, y: 21, dir: 'down', sprite: [3, 0],
      lines: () => ['CAVIO\'s favourite game is Pokémon Platinum. Digging through obscure ROM hacks is a close second.', 'CAVIO built a 2D RPG from scratch for A-Levels. The PROJECT LAB has a link so you can play it.', 'Yes, this whole town is a second one. Some people cannot stop.'],
    },
    {
      name: 'MENTOR', x: 20, y: 2, dir: 'down', sprite: [2, 3],
      lines: () => save.badges.length >= BADGES.length
        ? ['Eight badges. You have seen everything this town has to offer.']
        : ['I guard the HALL OF FAME.', `Bring me all 8 badges. You have ${save.badges.length}.`],
      after: () => { if (save.badges.length >= BADGES.length) openPanel('finale'); },
    },
  ];

  const footprint = new Uint8Array(MW * MH);
  const npcAt = (x, y) => NPCS.find((n) => n.x === x && n.y === y);
  const doorAt = (x, y) => BUILDINGS.find((b) => b.door.x === x && b.door.y === y);
  function solid(x, y) {
    const t = get(x, y);
    return t === T.WATER || t >= T.TREE || footprint[y * MW + x] === 1 || !!npcAt(x, y);
  }

  function setup() {
    buildMap();
    NPCS.forEach((n) => set(n.x, n.y, T.GRASS));
    BUILDINGS.forEach((b) => { for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) footprint[(b.y + j) * MW + b.x + i] = 1; });
    renderGround();
  }

  /* ---------- sound ---------- */

  let ac = null;
  function tone(freq, at, len, type, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.04, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(g).connect(ac.destination);
    o.start(at);
    o.stop(at + len);
  }
  function sfx(name) {
    if (!save.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      const t = ac.currentTime;
      if (name === 'blip') tone(880, t, 0.05);
      else if (name === 'bump') tone(110, t, 0.08, 'triangle', 0.08);
      else if (name === 'door') { tone(330, t, 0.08); tone(494, t + 0.08, 0.12); }
      else if (name === 'hit') { tone(180, t, 0.1, 'sawtooth', 0.06); tone(90, t + 0.06, 0.14, 'sawtooth', 0.06); }
      else if (name === 'badge') [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, t + i * 0.09, 0.14));
      else if (name === 'encounter') [392, 523, 392, 523, 659, 784].forEach((f, i) => tone(f, t + i * 0.08, 0.09));
    } catch (e) { /* audio not available */ }
  }

  /* ---------- dialogue ---------- */

  const dlg = { active: false, pages: [], i: 0, chars: 0, resolve: null };
  const dlgEl = $('#dialog'), dlgText = $('#dialog-text'), dlgName = $('#dialog-name');

  function paginate(text) {
    const max = 76, pages = [];
    let cur = '';
    text.split(' ').forEach((w) => {
      if (cur && (cur + ' ' + w).length > max) { pages.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
    });
    if (cur) pages.push(cur);
    return pages;
  }

  function say(lines, name, face) {
    if (typeof lines === 'string') lines = [lines];
    const pages = [];
    lines.forEach((l) => paginate(l).forEach((p) => pages.push(p)));
    return new Promise((resolve) => {
      Object.assign(dlg, { active: true, pages, i: 0, chars: 0, resolve });
      dlgName.hidden = !name;
      dlgName.textContent = name || '';
      const pc = $('#portrait');
      pc.hidden = !(face && SPR.faces);
      if (!pc.hidden) {
        const g = pc.getContext('2d');
        g.clearRect(0, 0, FACE, FACE);
        g.drawImage(SPR.faces, face[0] * FACE, face[1] * FACE, FACE, FACE, 0, 0, FACE, FACE);
      }
      dlgText.textContent = '';
      dlgEl.hidden = false;
      sfx('blip');
    });
  }

  function advanceDialogue() {
    const page = dlg.pages[dlg.i];
    if (dlg.chars < page.length) { dlg.chars = page.length; return; }
    dlg.i++;
    dlg.chars = 0;
    if (dlg.i >= dlg.pages.length) {
      dlg.active = false;
      dlgEl.hidden = true;
      $('#portrait').hidden = true;
      const done = dlg.resolve;
      dlg.resolve = null;
      done();
    } else sfx('blip');
  }

  /* ---------- badges and the bottom screen ---------- */

  const has = (id) => save.badges.includes(id);

  function renderMenu() {
    $('#badge-count').textContent = `${save.badges.length}/${BADGES.length}`;
    $('#badges').innerHTML = BADGES.map(
      (b) => `<button type="button" class="badge ${has(b.id) ? 'got' : ''}" data-badge="${b.id}" style="--c:${b.c}"
        title="${has(b.id) ? 'Open ' + b.name : 'Not found yet'}"><i></i>${has(b.id) ? b.name : '???'}</button>`
    ).join('');
    const next = BADGES.find((b) => !has(b.id));
    $('#objective').textContent = next
      ? `Next: visit ${next.where}.`
      : 'Every badge collected! Talk to the MENTOR at the top of town.';
    $('#btn-sound').textContent = 'Sound: ' + (save.sound ? 'on' : 'off');
  }

  async function award(id) {
    if (has(id)) return;
    save.badges.push(id);
    persist();
    renderMenu();
    sfx('badge');
    const b = BADGES.find((x) => x.id === id);
    const all = save.badges.length >= BADGES.length;
    await say([`You got the ${b.name} BADGE!`, all ? 'That is all 8 badges!' : `${save.badges.length} of 8 badges collected.`]);
    if (all) {
      await say(['You have seen everything PORTFOLIO TOWN has to offer.']);
      openPanel('finale');
    }
  }

  /* ---------- panels (building interiors) ---------- */

  let mode = 'title'; // title | world | panel | battle
  let busy = false;
  let openId = null;
  const panel = $('#panel'), lightbox = $('#lightbox');

  function confetti() {
    const cols = ['#ff5d73', '#ffd23f', '#2ec4b6', '#3a86ff', '#f15bb5', '#8f5bd6'];
    for (let i = 0; i < 70; i++) {
      const d = document.createElement('div');
      d.className = 'confetti';
      d.style.left = Math.random() * 100 + 'vw';
      d.style.background = cols[i % cols.length];
      d.style.animationDuration = 2 + Math.random() * 2.5 + 's';
      d.style.animationDelay = Math.random() * 1.2 + 's';
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 6000);
    }
  }

  function openPanel(id) {
    const s = Content.SECTIONS[id];
    openId = id;
    $('#panel-title').textContent = s.title;
    $('#panel-body').innerHTML = s.html();
    $('#panel-body').querySelectorAll('[data-hub]').forEach(Hobbies.mount);
    panel.hidden = false;
    $('#panel-body').scrollTop = 0;
    $('#panel-body').focus();
    mode = 'panel';
    busy = true;
    if (id === 'finale') { sfx('badge'); confetti(); }
  }

  function closePanel() {
    if (panel.hidden) return;
    const id = openId;
    panel.hidden = true;
    openId = null;
    mode = 'world';
    busy = false;
    if (id !== 'finale') award(id);
  }

  async function enterBuilding(b) {
    if (busy) return;
    busy = true;
    sfx('door');
    $('#fade').classList.add('on');
    await wait(240);
    player.dir = 'down';
    openPanel(b.id);
    $('#fade').classList.remove('on');
  }

  /* ---------- bug battles ---------- */

  const BUGS = [
    { name: 'NULL POINTER', attack: 'SEGFAULT', c: '#8f5bd6', s: '#c9aef2' },
    { name: 'OFF-BY-ONE ERROR', attack: 'FENCEPOST', c: '#ff5d73', s: '#ffb3bd' },
    { name: 'RACE CONDITION', attack: 'DEADLOCK', c: '#3a86ff', s: '#a6c8ff' },
    { name: 'MEMORY LEAK', attack: 'HEAP DRAIN', c: '#ff9f1c', s: '#ffd699' },
    { name: 'REGRESSION', attack: 'BROKEN BUILD', c: '#f15bb5', s: '#f9b5de' },
  ];
  const MOVES = [
    { name: 'UNIT TEST', sub: 'C++ / GoogleTest', dmg: 55, c: '#3a86ff', text: 'It\'s super effective! The failing case is pinned down.' },
    { name: 'GIT BISECT', sub: 'Git', dmg: 40, c: '#ff9f1c', text: 'Found the exact commit that let it in.' },
    { name: 'PRINT DEBUG', sub: 'Python', dmg: 35, c: '#2ec4b6', text: 'print("here") ... print("here 2") ... aha.' },
    { name: 'PURE FUNCTION', sub: 'Haskell', dmg: 45, c: '#8f5bd6', text: 'No side effects left for the bug to hide in.' },
  ];

  let picker = null; // { idx, resolve } while the player is choosing a move
  let cooldown = 0;

  function renderMoves() {
    $('#move-list').innerHTML =
      MOVES.map((m, i) => `<button type="button" class="move ${picker.idx === i ? 'sel' : ''}" data-move="${i}" style="--c:${m.c}">${m.name}<small>${m.sub}</small></button>`).join('') +
      `<button type="button" class="move run ${picker.idx === 4 ? 'sel' : ''}" data-move="4">RUN</button>`;
  }
  function chooseMove() {
    return new Promise((resolve) => {
      picker = { idx: 0, resolve };
      renderMoves();
      $('#moves').hidden = false;
      $('#menu').hidden = true;
    });
  }
  function pick(i) {
    if (!picker || dlg.active) return;
    const done = picker.resolve;
    picker = null;
    $('#moves').hidden = true;
    $('#menu').hidden = false;
    sfx('blip');
    done(i);
  }
  function shake(sel) {
    const el = $(sel);
    el.classList.remove('hit');
    void el.offsetWidth;
    el.classList.add('hit');
  }

  async function battle() {
    busy = true;
    mode = 'battle';
    const bug = BUGS[(Math.random() * BUGS.length) | 0];
    let hp = 100, focus = 100, won = false;
    sfx('encounter');
    $('#flash').classList.add('on');
    await wait(700);
    $('#flash').classList.remove('on');

    const foe = $('#foe'), fg = foe.getContext('2d');
    fg.clearRect(0, 0, 16, 16);
    fg.drawImage(Art.bug(bug.c, bug.s), 0, 0);
    foe.className = '';
    const hg = $('#hero').getContext('2d');
    hg.clearRect(0, 0, CW, CH);
    if (SPR.player) hg.drawImage(SPR.player, CW, ROW.up * CH, CW, CH, 0, 0, CW, CH);
    $('#foe-name').textContent = bug.name;
    $('#foe-hp').style.width = '100%';
    $('#hero-hp').style.width = '100%';
    $('#hint').hidden = true;
    $('#battle').hidden = false;

    await say(`A wild ${bug.name} appeared!`);
    for (;;) {
      const i = await chooseMove();
      if (i === 4) { await say('Got away safely. The bug is still in production, though.'); break; }
      const m = MOVES[i];
      await say(`CAVIO used ${m.name}!`);
      hp = Math.max(0, hp - m.dmg);
      sfx('hit');
      shake('#foe');
      $('#foe-hp').style.width = hp + '%';
      await say(m.text);
      if (hp <= 0) {
        foe.classList.add('gone');
        save.bugs++;
        persist();
        won = true;
        await say([
          `${bug.name} was squashed!`,
          'In real life, CAVIO wrote 100+ GoogleTest unit tests for a Feral Interactive client project.',
        ]);
        break;
      }
      await say(`${bug.name} used ${bug.attack}!`);
      focus -= 30 + ((Math.random() * 15) | 0);
      sfx('hit');
      shake('#hero');
      $('#hero-hp').style.width = Math.max(focus, 5) + '%';
      if (focus <= 30) {
        await say('CAVIO took a sip of coffee. FOCUS restored!');
        focus = 100;
        $('#hero-hp').style.width = '100%';
      }
    }
    $('#battle').hidden = true;
    mode = 'world';
    busy = false;
    cooldown = 6;
    if (won) await award('bug');
  }

  /* ---------- input ---------- */

  const held = [];
  let queued = null; // a quick tap still counts as one step
  let run = false;
  const KEYS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
    z: 'a', Z: 'a', Enter: 'a', ' ': 'a', x: 'b', X: 'b', Escape: 'b', Backspace: 'b',
  };

  function press(k) {
    if (k === 'a') return pressA();
    if (k === 'b') return pressB();
    if (k === 'start') return pressA();
    if (k === 'select') return $('#btn-sound').click();
    if (k === 'x') { run = true; return; }
    if (k === 'y') return $('#btn-help').click();
    if (picker && !dlg.active) {
      const i = picker.idx;
      if (k === 'left' && i % 2 === 1 && i < 4) picker.idx--;
      else if (k === 'right' && i % 2 === 0 && i < 4) picker.idx++;
      else if (k === 'up') picker.idx = i === 4 ? 2 : i >= 2 ? i - 2 : i;
      else if (k === 'down') picker.idx = i < 2 ? i + 2 : 4;
      renderMoves();
      return;
    }
    if (!held.includes(k)) held.push(k);
    queued = k;
  }
  function release(k) {
    if (k === 'x') run = false;
    const i = held.indexOf(k);
    if (i >= 0) held.splice(i, 1);
  }

  function pressA() {
    if (document.body.dataset.view !== 'game') return;
    if (!lightbox.hidden || mode === 'panel') return;
    if (mode === 'title') return start();
    if (dlg.active) return advanceDialogue();
    if (picker) return pick(picker.idx);
    if (mode === 'world' && !busy && !player.moving) interact();
  }
  function pressB() {
    if (!lightbox.hidden) return Viewer.close();
    if (mode === 'panel') return closePanel();
    if (dlg.active) return advanceDialogue();
    if (picker) { picker.idx = 4; renderMoves(); }
  }

  function glow(k, on) {
    document.querySelectorAll('.console [data-key="' + k + '"]').forEach((el) => el.classList.toggle('down', on));
  }

  /* the circle pad: drag it in a direction to walk */
  (function () {
    const stick = $('#stick'), knob = stick.querySelector('i');
    let dir = null;
    const set = (d, dx, dy) => {
      if (d !== dir) { if (dir) release(dir); dir = d; if (d) press(d); }
      knob.style.transform = d ? 'translate(' + dx * 22 + '%,' + dy * 22 + '%)' : '';
    };
    const move = (e) => {
      const r = stick.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      if (Math.hypot(dx, dy) < 0.12) return set(null, 0, 0);
      if (Math.abs(dx) > Math.abs(dy)) set(dx > 0 ? 'right' : 'left', Math.sign(dx), 0);
      else set(dy > 0 ? 'down' : 'up', 0, Math.sign(dy));
    };
    stick.addEventListener('pointerdown', (e) => { e.preventDefault(); stick.setPointerCapture(e.pointerId); move(e); });
    stick.addEventListener('pointermove', (e) => { if (stick.hasPointerCapture(e.pointerId)) move(e); });
    ['pointerup', 'pointercancel'].forEach((t) => stick.addEventListener(t, () => set(null, 0, 0)));
  })();

  window.addEventListener('keydown', (e) => {
    if (document.body.dataset.view !== 'game') return;
    if (e.key === 'Shift') run = true;
    const k = KEYS[e.key];
    if (!k || e.ctrlKey || e.metaKey || e.altKey) return;
    const typing = e.target.closest && e.target.closest('a, button');
    if (mode === 'panel' || !lightbox.hidden) {
      if (k === 'b') { e.preventDefault(); pressB(); }
      return; // let arrows, space and enter scroll and activate links
    }
    if (typing && (e.key === 'Enter' || e.key === ' ')) return; // a focused button handles its own click
    e.preventDefault();
    if (e.repeat) return;
    glow(k, true);
    press(k);
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') run = false;
    const k = KEYS[e.key];
    if (k) { glow(k, false); release(k); }
  });
  window.addEventListener('blur', () => { held.length = 0; run = false; });

  document.querySelectorAll('.console [data-key]').forEach((btn) => {
    const k = btn.dataset.key;
    const up = () => { btn.classList.remove('down'); release(k); };
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); btn.classList.add('down'); press(k); });
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('pointerleave', up);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  });
  $('#top').addEventListener('pointerdown', () => pressA());

  document.addEventListener('click', (e) => {
    const go = e.target.closest('[data-go]');
    if (go) return setView(go.dataset.go);
    const mv = e.target.closest('[data-move]');
    if (mv) return pick(Number(mv.dataset.move));
    const shot = e.target.closest('.shot');
    if (shot) return Viewer.open(shot);
    if (e.target.closest('#lightbox')) return Viewer.click(e);
    const pressed = e.target.closest('.console button');
    if (pressed) pressed.blur();
    if (e.target.closest('#panel-close') || e.target === panel) return closePanel();
    const badge = e.target.closest('[data-badge]');
    if (badge && mode === 'world' && !busy && !dlg.active) {
      const id = badge.dataset.badge, b = BADGES.find((x) => x.id === id);
      if (!has(id)) say(`Not found yet. Try ${b.where}.`);
      else if (id === 'bug') say(`Bugs squashed so far: ${save.bugs}.`);
      else openPanel(id);
    }
  });
  $('#btn-start').addEventListener('click', () => start());
  $('#btn-sound').addEventListener('click', () => { save.sound = !save.sound; persist(); renderMenu(); sfx('blip'); });
  $('#btn-help').addEventListener('click', () => {
    if (mode === 'world' && !busy && !dlg.active) say(['Move: ARROW KEYS or WASD. Hold SHIFT to run.', 'Z or ENTER: talk, read and confirm. X or ESC: go back.', 'Walk up into a door to enter a building.']);
  });

  /* ---------- world logic ---------- */

  function facing() {
    const [dx, dy] = DIRS[player.dir];
    return { x: player.x + dx, y: player.y + dy };
  }

  async function interact() {
    const f = facing();
    const n = npcAt(f.x, f.y);
    if (n) {
      n.dir = OPP[player.dir];
      busy = true;
      await say(n.lines(), n.name, n.sprite);
      busy = false;
      if (n.after) n.after();
      return;
    }
    const s = SIGNS[f.x + ',' + f.y];
    if (s) { busy = true; await say(s()); busy = false; return; }
    const b = doorAt(f.x, f.y);
    if (b && player.dir === 'up') enterBuilding(b);
  }

  function updateHint() {
    const el = $('#hint');
    let html = '';
    if (mode === 'world' && !busy && !dlg.active && !player.moving) {
      const f = facing(), n = npcAt(f.x, f.y), b = doorAt(f.x, f.y);
      if (n) html = `<b>${KEY_A}</b> Talk to ${n.name}`;
      else if (SIGNS[f.x + ',' + f.y]) html = `<b>${KEY_A}</b> Read sign`;
      else if (b && player.dir === 'up') html = `<b>▲</b> Enter ${b.label}`;
    }
    if (el.dataset.html !== html) { el.dataset.html = html; el.innerHTML = html; el.hidden = !html; }
  }

  function onStep() {
    if (cooldown > 0) cooldown--;
    if (get(player.x, player.y) === T.TALL && cooldown === 0 && Math.random() < (has('bug') ? 0.1 : 0.22)) battle();
  }

  function update(dt) {
    if (dlg.active) {
      const page = dlg.pages[dlg.i];
      if (dlg.chars < page.length) dlg.chars = Math.min(page.length, dlg.chars + dt * 45);
      const shown = page.slice(0, dlg.chars | 0);
      if (dlgText.textContent !== shown) dlgText.textContent = shown;
      dlgEl.classList.toggle('typing', dlg.chars < page.length);
    }
    if (mode !== 'world') return;

    if (!busy && !dlg.active) {
      NPCS.forEach((n) => {
        n.idle = (n.idle === undefined ? 2 + Math.random() * 5 : n.idle) - dt;
        if (n.idle <= 0) {
          n.idle = 2.5 + Math.random() * 5;
          const options = ['down', 'down', 'left', 'right'];
          n.dir = options[(Math.random() * options.length) | 0];
        }
      });
    }

    if (player.moving) {
      player.t += dt * (run ? 9 : 5.5);
      if (player.t >= 1) {
        player.t = 1;
        player.moving = false;
        player.step++;
        onStep();
      }
    }
    if (busy || dlg.active) queued = null;
    if (!player.moving && !busy && !dlg.active && (held.length || queued)) {
      const d = held.length ? held[held.length - 1] : queued, [dx, dy] = DIRS[d];
      queued = null;
      const nx = player.x + dx, ny = player.y + dy;
      player.dir = d;
      const b = doorAt(nx, ny);
      if (b && d === 'up') enterBuilding(b);
      else if (!solid(nx, ny)) {
        player.fx = player.x; player.fy = player.y;
        player.x = nx; player.y = ny;
        player.t = 0; player.moving = true;
      }
    }
    updateHint();
  }

  /* ---------- drawing ---------- */

  let clock = 0;
  const clouds = [0, 1, 2, 3].map((i) => ({ x: i * 190 + 40, y: 60 + ((i * 137) % 360), w: 70 + ((i * 53) % 50), v: 5 + i * 1.5 }));
  const flies = [0, 1, 2, 3, 4].map((i) => ({ x: 80 + i * 110, y: 100 + ((i * 97) % 300), p: i * 1.7, c: ['#ffd23f', '#ffffff', '#f15bb5', '#8fd0ff', '#ff9f1c'][i] }));

  function drawChar(e, sx, sy) {
    ctx.fillStyle = 'rgba(20,40,30,.3)';
    ctx.fillRect(sx + 3, sy + 13, 10, 3);
    ctx.fillRect(sx + 4, sy + 12, 8, 1);
    ctx.fillRect(sx + 4, sy + 16, 8, 1);
    if (!e.sheet) return;
    // sheet columns are: step, stand, step
    ctx.drawImage(e.sheet, e.ox + [1, 0, 2][e.frame] * CW, e.oy + ROW[e.dir] * CH, CW, CH, sx - 1, sy - 10, CW, CH);
  }

  function draw(dt) {
    let px = (player.fx + (player.x - player.fx) * player.t) * TS;
    let py = (player.fy + (player.y - player.fy) * player.t) * TS;
    let camX, camY;
    if (mode === 'title') {
      camX = 190 + Math.sin(clock / 7) * 180;
      camY = 140 + Math.cos(clock / 9) * 130;
    } else {
      camX = px + 8 - VW / 2;
      camY = py + 8 - VH / 2;
    }
    camX = Math.round(Math.max(0, Math.min(MW * TS - VW, camX)));
    camY = Math.round(Math.max(0, Math.min(MH * TS - VH, camY)));

    ctx.drawImage(ground[(clock * 2) & 1], -camX, -camY);

    // everything that stands up is sorted by its feet so things overlap correctly
    const list = NPCS.map((n) => ({ sheet: SPR.people, ox: n.sprite[0] * CW * 3, oy: n.sprite[1] * CH * 4, dir: n.dir, frame: 0, x: n.x * TS, y: n.y * TS, tx: n.x, ty: n.y }));
    if (mode !== 'title') {
      const frame = player.moving ? [1, 0, 2, 0][(player.step * 2 + (player.t > 0.5 ? 1 : 0)) % 4] : 0;
      list.push({ sheet: SPR.player, ox: 0, oy: 0, dir: player.dir, frame, x: px, y: py, tx: Math.round(px / TS), ty: Math.round(py / TS) });
    }
    const x0 = Math.floor(camX / TS), y0 = Math.floor(camY / TS);
    for (let ty = y0; ty <= y0 + 13; ty++) {
      for (let tx = x0; tx <= x0 + 16; tx++) {
        if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) continue;
        const t = get(tx, ty);
        if (t === T.TREE) list.push({ img: treeImg, x: tx * TS, y: ty * TS, up: 4 });
        else if (t === T.LAMP) list.push({ img: lampImg, x: tx * TS, y: ty * TS, up: 10 });
      }
    }
    list.sort((a, b) => a.y - b.y || (a.img ? 1 : -1));
    list.forEach((e) => {
      const sx = Math.round(e.x) - camX, sy = Math.round(e.y) - camY;
      if (e.img) { ctx.drawImage(e.img, sx, sy - e.up); return; }
      drawChar(e, sx, sy);
      if (get(e.tx, e.ty) === T.TALL) Art.tallFront(ctx, e.tx * TS - camX, e.ty * TS - camY);
    });

    // butterflies
    flies.forEach((f) => {
      f.p += dt * 2;
      f.x += Math.cos(f.p * 0.6) * dt * 14;
      f.y += Math.sin(f.p * 0.9) * dt * 10;
      const sx = Math.round(f.x) - camX, sy = Math.round(f.y + Math.sin(f.p * 3) * 2) - camY;
      const open = Math.sin(f.p * 9) > 0;
      ctx.fillStyle = f.c;
      ctx.fillRect(sx - (open ? 2 : 1), sy, open ? 2 : 1, 2);
      ctx.fillRect(sx + 1, sy, open ? 2 : 1, 2);
      ctx.fillStyle = '#2b2140';
      ctx.fillRect(sx, sy, 1, 2);
    });

    // drifting cloud shadows
    ctx.fillStyle = 'rgba(30,40,90,.09)';
    clouds.forEach((c) => {
      c.x += c.v * dt;
      if (c.x > MW * TS + 40) c.x = -c.w - 40;
      const sx = Math.round(c.x) - camX, sy = c.y - camY;
      ctx.fillRect(sx + 10, sy, c.w - 20, 6);
      ctx.fillRect(sx, sy + 6, c.w, 14);
      ctx.fillRect(sx + 14, sy + 20, c.w - 34, 6);
    });
  }

  let last = 0;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (document.body.dataset.view === 'game') {
      clock += dt;
      update(dt);
      draw(dt);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- start, views ---------- */

  async function start() {
    if (mode !== 'title') return;
    mode = 'world';
    $('#title').hidden = true;
    $('#title-menu').hidden = true;
    $('#menu').hidden = false;
    sfx('door');
    if (!save.intro) {
      busy = true;
      await say([
        'Hey! Welcome to PORTFOLIO TOWN.',
        'This whole town is about one person: CAVIO HOSSAIN, a Computer Science with AI student at the University of Nottingham.',
        'Every building holds part of the story. Visit them all to collect 8 badges.',
        touch
          ? 'Use the D-PAD or the CIRCLE PAD to move. Press A to talk and B to go back. Hold X to run.'
          : 'Move with the ARROW KEYS or WASD. Press Z to talk and X to go back. Hold SHIFT to run. The buttons on the console work too.',
        'In a hurry? The CLASSIC VIEW button shows everything on one page.',
      ], 'LUMA', NPCS[0].sprite);
      busy = false;
      save.intro = true;
      persist();
    }
  }

  function setView(v) {
    document.body.dataset.view = v;
    held.length = 0;
    try { history.replaceState(null, '', v === 'classic' ? '#classic' : location.pathname + location.search); } catch (e) { /* file:// */ }
    window.scrollTo(0, 0);
  }

  function buildClassic() {
    const D = Content.DATA;
    $('#c-tag').textContent = D.tagline;
    $('#c-name').textContent = D.name;
    $('.c-avatar').src = Content.src(D.photo);
    $('.c-avatar').alt = D.name;
    $('#c-mail').href = 'mailto:' + D.email;
    $('#c-nav').innerHTML = Content.order.map((id) => `<a href="#c-${id}" data-jump="c-${id}">${Content.SECTIONS[id].title}</a>`).join('');
    $('#c-sections').innerHTML = Content.order
      .map((id) => `<section class="c-section" id="c-${id}"><h2>${Content.SECTIONS[id].title}</h2>${Content.SECTIONS[id].html()}</section>`)
      .join('');
    $('#c-sections').querySelectorAll('[data-hub]').forEach(Hobbies.mount);
    $('#c-nav').addEventListener('click', (e) => {
      const a = e.target.closest('[data-jump]');
      if (!a) return;
      e.preventDefault();
      document.getElementById(a.dataset.jump).scrollIntoView({ behavior: 'smooth' });
    });
  }

  setup();
  renderMenu();
  buildClassic();
  if (location.hash === '#classic') setView('classic');
  window.addEventListener('hashchange', () => setView(location.hash === '#classic' ? 'classic' : 'game'));
  loadSprites().then(() => requestAnimationFrame(loop));
})();
