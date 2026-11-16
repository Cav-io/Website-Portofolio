/* The travel album: a pixel world map with a pin for every place visited. */
(function () {
  'use strict';

  const W = 240, H = 92;              // internal resolution, scaled up with crisp pixels
  const LON0 = -180, LAT0 = 80, DEG = 1.5; // degrees per pixel
  const px = (lon) => (lon - LON0) / DEG;
  const py = (lat) => (LAT0 - lat) / DEG;

  /* Rough coastlines as [lon, lat] points. Accuracy is "recognisable at 240 pixels wide". */
  const LAND = [
    // North America
    [[-168, 66], [-156, 71], [-128, 70], [-110, 68], [-95, 72], [-82, 73], [-78, 62], [-64, 60], [-56, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-84, 30], [-90, 29], [-97, 26], [-97, 19], [-91, 19], [-87, 21], [-87, 16], [-83, 10], [-78, 8], [-83, 8], [-92, 15], [-105, 20], [-110, 23], [-115, 31], [-124, 40], [-124, 48], [-135, 58], [-150, 60], [-165, 55], [-160, 60], [-166, 62]],
    // Greenland, Iceland
    [[-70, 80], [-20, 80], [-22, 70], [-42, 60], [-52, 65], [-58, 75]],
    [[-24, 64], [-14, 64], [-15, 66], [-22, 66]],
    // South America
    [[-78, 8], [-72, 12], [-62, 10], [-52, 5], [-50, 0], [-35, -6], [-39, -15], [-48, -26], [-58, -38], [-66, -46], [-70, -54], [-75, -50], [-72, -36], [-70, -18], [-81, -6], [-80, 1]],
    // Africa, Madagascar
    [[-17, 21], [-10, 30], [-6, 35], [10, 37], [20, 32], [32, 31], [35, 24], [43, 12], [51, 12], [42, -2], [40, -15], [35, -24], [28, -33], [19, -35], [14, -22], [12, -6], [9, 4], [-8, 5], [-16, 12]],
    [[44, -16], [50, -13], [50, -17], [47, -25], [44, -23]],
    // Europe and Asia
    [[-9, 37], [-9, 43], [-1, 44], [-4, 48], [2, 51], [8, 54], [14, 54], [21, 55], [24, 59], [30, 60], [40, 66], [44, 68], [60, 69], [70, 73], [90, 76], [105, 78], [115, 74], [140, 73], [160, 70], [180, 69], [180, 65], [172, 61], [163, 58], [162, 56], [156, 51], [155, 58], [142, 59], [135, 54], [141, 48], [132, 43], [128, 40], [129, 36], [126, 34], [126, 38], [124, 40], [121, 39], [118, 38], [122, 37], [119, 35], [122, 30], [118, 24], [110, 21], [107, 18], [109, 12], [105, 9], [100, 13], [99, 8], [103, 2], [98, 8], [97, 16], [92, 22], [88, 22], [80, 15], [77, 8], [73, 17], [72, 21], [67, 25], [57, 25], [56, 27], [50, 30], [48, 30], [51, 24], [56, 24], [59, 22], [52, 16], [43, 13], [34, 28], [36, 36], [28, 36], [26, 40], [23, 40], [22, 37], [20, 40], [19, 42], [14, 45], [12, 44], [16, 41], [18, 40], [16, 38], [15, 40], [12, 42], [9, 44], [3, 43], [0, 39], [-5, 36]],
    // Scandinavia
    [[5, 58], [8, 58], [11, 59], [13, 56], [16, 57], [19, 60], [17, 62], [22, 66], [25, 65], [30, 70], [25, 71], [15, 69], [5, 62]],
    // Great Britain, Ireland
    [[-5, 50], [1, 51], [2, 53], [-2, 56], [-2, 58], [-6, 58], [-5, 55], [-3, 54], [-5, 52]],
    [[-10, 52], [-6, 52], [-6, 55], [-10, 54]],
    // Japan
    [[130, 31], [132, 34], [136, 34], [140, 35], [142, 39], [141, 41], [140, 41], [139, 37], [135, 35], [131, 34]],
    [[140, 42], [145, 43], [144, 45], [141, 45]],
    // Sri Lanka, Taiwan, Philippines
    [[80, 9], [82, 7], [80, 6]],
    [[120, 23], [122, 25], [121, 22]],
    [[120, 18], [122, 18], [124, 13], [126, 7], [122, 7], [121, 13]],
    // Indonesia and New Guinea
    [[95, 5], [104, -3], [106, -6], [101, -3]],
    [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]],
    [[106, -6], [114, -7], [114, -8], [106, -7]],
    [[120, 1], [124, 1], [122, -5], [120, -4]],
    [[131, -1], [141, -3], [147, -6], [150, -10], [141, -9], [138, -8], [132, -4]],
    // Australia, New Zealand
    [[114, -22], [122, -17], [130, -12], [137, -12], [136, -15], [141, -17], [143, -11], [146, -19], [153, -26], [150, -37], [144, -38], [138, -35], [131, -31], [124, -33], [115, -34]],
    [[173, -35], [178, -38], [175, -41], [173, -41]],
    [[172, -41], [174, -42], [170, -46], [167, -46]],
  ];

  let base = null; // the land and sea, rendered once

  function renderBase() {
    const mask = document.createElement('canvas');
    mask.width = W; mask.height = H;
    const m = mask.getContext('2d');
    m.fillStyle = '#000';
    LAND.forEach((poly) => {
      m.beginPath();
      poly.forEach(([lon, lat], i) => (i ? m.lineTo(px(lon), py(lat)) : m.moveTo(px(lon), py(lat))));
      m.closePath();
      m.fill();
    });
    const a = m.getImageData(0, 0, W, H).data;
    const land = (x, y) => x >= 0 && y >= 0 && x < W && y < H && a[(y * W + x) * 4 + 3] > 110;

    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let col;
        if (land(x, y)) {
          const lat = LAT0 - y * DEG;
          col = lat > 62 ? '#e9f4ee' : (x + y) % 2 ? '#6fc552' : '#78cc58';       // snowy north, grass elsewhere
          if (lat <= 62 && lat > 15 && lat < 32 && (((x * 13) ^ (y * 29)) % 4 === 0)) col = '#d9cf7a'; // a hint of desert
          if (!land(x, y + 1)) col = '#2f7f38';                                    // southern shore in shadow
          else if (!land(x, y - 1)) col = '#a9ea80';                               // northern shore in light
        } else {
          col = (x + y * 3) % 8 === 0 ? '#5ba6ee' : '#3f86dd';
          if (land(x, y - 1) || land(x - 1, y) || land(x + 1, y) || land(x, y + 1)) col = '#8cc6f7'; // shallows
        }
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  function route(g, a, b, colour) {
    // a dotted arc between two pins
    const x1 = px(a.lon), y1 = py(a.lat), x2 = px(b.lon), y2 = py(b.lat);
    const lift = Math.min(18, Math.abs(x2 - x1) * 0.22);
    const steps = Math.max(6, Math.round(Math.hypot(x2 - x1, y2 - y1) / 3));
    g.fillStyle = colour;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t - Math.sin(t * Math.PI) * lift;
      g.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = '1';
    const places = window.Content.DATA.travel;
    const home = places.find((p) => p.home) || places[0];
    base = base || renderBase();

    root.innerHTML = `
      <div class="wmap-screen">
        <div class="wmap-scroll">
          <div class="wmap-stage">
            <canvas width="${W}" height="${H}"></canvas>
            ${places.map((p, i) => `<button type="button" class="wmap-pin${p.home ? ' home' : ''}" data-i="${i}"
                style="left:${(px(p.lon) / W) * 100}%;top:${(py(p.lat) / H) * 100}%" aria-label="${p.place}"><span>${p.place}</span></button>`).join('')}
          </div>
        </div>
        <div class="wmap-bar"><b class="wmap-name"></b><span class="wmap-count"></span></div>
      </div>
      <div class="wmap-card">
        <p class="wmap-blurb"></p>
        <div class="gallery"></div>
      </div>`;

    const g = root.querySelector('canvas').getContext('2d');
    const pins = [...root.querySelectorAll('.wmap-pin')];

    function select(i) {
      const p = places[i];
      g.drawImage(base, 0, 0);
      places.forEach((q, j) => { if (q !== home) route(g, home, q, j === i ? '#ffffff' : 'rgba(255,255,255,.35)'); });
      pins.forEach((el, j) => el.classList.toggle('on', j === i));
      root.querySelector('.wmap-name').textContent = p.place.toUpperCase();
      root.querySelector('.wmap-count').textContent = p.photos.length + (p.photos.length === 1 ? ' photo' : ' photos');
      root.querySelector('.wmap-blurb').textContent = p.blurb || '';
      root.querySelector('.gallery').innerHTML = p.photos.map(([f, c]) => `
        <figure>
          <button type="button" class="shot" data-full="assets/photos/${f}" data-caption="${c}">
            <img src="assets/photos/${f}" alt="${c}" loading="lazy">
          </button>
          <figcaption>${c}</figcaption>
        </figure>`).join('');
    }

    pins.forEach((el, i) => {
      el.addEventListener('mouseenter', () => select(i));
      el.addEventListener('focus', () => select(i));
      el.addEventListener('click', () => select(i));
    });
    select(0);

    // on narrow screens the map scrolls sideways; start where the pins are
    const sc = root.querySelector('.wmap-scroll');
    sc.scrollLeft = sc.scrollWidth;
  }

  window.WorldMap = { mount };
})();
