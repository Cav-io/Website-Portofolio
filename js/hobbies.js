/* The Hobbies hub: a grid of boxes. Hover over one for a moment (or tap it)
   and it opens up into its own page, with a button to go back to the grid. */
(function () {
  'use strict';

  const DWELL = 600; // how long to hover before a box opens, in milliseconds
  const isVideo = (file) => /\.(mp4|webm|mov)$/i.test(file || '');

  function pageHtml(h) {
    const src = window.Content.src;
    const media = (h.media || []).map((m) => `
      <figure>
        ${isVideo(m.file)
          ? `<video src="${src(m.file)}" autoplay muted loop playsinline controls></video>`
          : `<button type="button" class="shot" data-full="${src(m.file)}" data-caption="${m.caption || ''}" data-note="${m.note || ''}">
               <img src="${src(m.file)}" alt="${m.caption || ''}" loading="lazy">
             </button>`}
        <figcaption>${m.caption || ''}</figcaption>
      </figure>`).join('');
    return `
      <h3 class="hub-title">${h.title}</h3>
      ${(h.text || []).map((p) => `<p>${p}</p>`).join('')}
      ${h.type === 'travel' ? '<div class="wmap" data-wmap></div>' : ''}
      ${media ? `<div class="hub-media">${media}</div>` : ''}`;
  }

  function mount(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = '1';
    const list = window.SITE.hobbies;

    root.innerHTML = `
      <div class="hub-grid">
        ${list.map((h, i) => `
          <button type="button" class="hub-tile" data-i="${i}" style="--c:${h.colour}">
            <span class="hub-num">${String(i + 1).padStart(2, '0')}</span>
            <b>${h.title}</b>
            <span class="hub-teaser">${h.teaser || ''}</span>
            <span class="hub-cta">Hover or tap to open</span>
            <i class="hub-bar"></i>
          </button>`).join('')}
      </div>
      <div class="hub-page" hidden>
        <button type="button" class="hub-back">◀ All hobbies</button>
        <div class="hub-body"></div>
      </div>`;

    const grid = root.querySelector('.hub-grid'), page = root.querySelector('.hub-page'), body = root.querySelector('.hub-body');
    const tiles = [...root.querySelectorAll('.hub-tile')];
    let timer = null, charging = null, coolUntil = 0;

    function cancel() {
      clearTimeout(timer);
      timer = null;
      if (charging) charging.classList.remove('charging');
      charging = null;
    }

    function open(i, animate) {
      cancel();
      const h = list[i], tile = tiles[i];
      if (animate && tile) {
        // grow the page out of the box that was opened
        const r = root.getBoundingClientRect(), t = tile.getBoundingClientRect();
        page.style.setProperty('--ox', ((t.left + t.width / 2 - r.left) / r.width) * 100 + '%');
        page.style.setProperty('--oy', Math.min(160, t.top + t.height / 2 - r.top) + 'px');
      }
      page.style.setProperty('--c', h.colour);
      body.innerHTML = pageHtml(h);
      body.querySelectorAll('[data-wmap]').forEach(window.WorldMap.mount);
      grid.hidden = true;
      page.hidden = false;
      page.classList.toggle('grow', !!animate);
    }

    function close() {
      body.innerHTML = ''; // also stops any video
      page.hidden = true;
      grid.hidden = false;
      coolUntil = Date.now() + 900; // do not instantly reopen the box under the cursor
    }

    tiles.forEach((tile, i) => {
      // start counting on mouse movement, so a box does not open under a resting cursor
      tile.addEventListener('mousemove', () => {
        if (timer || Date.now() < coolUntil) return;
        charging = tile;
        tile.classList.add('charging');
        timer = setTimeout(() => open(i, true), DWELL);
      });
      tile.addEventListener('mouseleave', cancel);
      tile.addEventListener('click', () => open(i, true));
    });
    root.querySelector('.hub-back').addEventListener('click', close);

    if (root.dataset.open) {
      const i = list.findIndex((h) => h.id === root.dataset.open);
      if (i >= 0) open(i, false);
    }
  }

  window.Hobbies = { mount };
})();
