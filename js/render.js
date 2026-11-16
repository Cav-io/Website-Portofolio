/* Turns the plain data in content/ into the HTML for each section.
   To change what the site says, edit the files in content/ instead of this one. */
(function () {
  'use strict';

  const SITE = window.SITE || {};
  const P = SITE.profile;
  const PHOTOS = 'assets/photos/';
  const PLACEHOLDER = PHOTOS + 'placeholder.svg';

  const attr = (t) => String(t || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const src = (file) => (file ? PHOTOS + file : PLACEHOLDER);
  // Small pictures in the galleries use a pre-shrunk copy from assets/photos/thumbs/ when there is one,
  // which looks sharper than letting the browser squash a big photo. No thumbnail? The full picture is used.
  const thumb = (file, alt) => `<img src="${file ? PHOTOS + 'thumbs/' + file : PLACEHOLDER}" data-big="${src(file)}" alt="${attr(alt)}" loading="lazy">`;
  const img = (file, alt) => `<img src="${src(file)}" alt="${alt || ''}" loading="lazy">`;
  const tags = (list) => '<ul class="tags">' + list.map((t) => `<li>${t}</li>`).join('') + '</ul>';
  const points = (list) => '<ul class="points">' + (list || []).map((t) => `<li>${t}</li>`).join('') + '</ul>';
  const ext = (label, url) => `<a class="btn" href="${url}" target="_blank" rel="noopener">${label}</a>`;
  const joined = (...parts) => parts.filter(Boolean).join(' · ');

  /* A picture that is missing (or not added yet) shows the placeholder instead of a broken image. */
  document.addEventListener('error', (e) => {
    const el = e.target;
    if (!el || !el.tagName || el.dataset.fallback) return;
    if (el.tagName === 'IMG') {
      if (el.dataset.big && !el.dataset.triedBig) { el.dataset.triedBig = '1'; el.src = el.dataset.big; return; }
      el.dataset.fallback = '1';
      el.src = PLACEHOLDER;
    } else if (el.tagName === 'VIDEO') {
      const ph = document.createElement('img');
      ph.dataset.fallback = '1';
      ph.src = PLACEHOLDER;
      ph.alt = 'Video coming soon';
      el.replaceWith(ph);
    }
  }, true);

  /* One job or course. If it has a photo, hovering (or tapping) slides the picture out from the side. */
  function entry(e, sub) {
    const pic = e.photo
      ? `<figure class="entry-pic">${img(e.photo, e.photoCaption || e.place)}${e.photoCaption ? `<figcaption>${e.photoCaption}</figcaption>` : ''}</figure>`
      : '';
    return `
      <article class="entry${pic ? ' has-pic' : ''}"${pic ? ' tabindex="0"' : ''}>
        <div class="entry-body">
          <header>
            <h3>${e.place}</h3>
            <span class="when">${e.when || ''}</span>
          </header>
          <p class="role">${joined(sub, e.where)}</p>
          ${points(e.points)}
          ${pic ? '<span class="entry-hint">PHOTO ▸</span>' : ''}
        </div>
        ${pic}
      </article>`;
  }

  // tapping an entry keeps its photo open on touch screens
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.entry.has-pic');
    if (card && !e.target.closest('a')) card.classList.toggle('open');
  });

  const SECTIONS = {
    about: {
      title: 'About me',
      html: () => `
        <div class="about">
          <figure class="portrait">${img(P.photo, P.name)}</figure>
          <div>
            ${P.about.map((p) => `<p>${p}</p>`).join('')}
            <dl class="facts">
              ${P.facts.map((f) => `<div><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join('')}
            </dl>
          </div>
        </div>`,
    },
    projects: {
      title: 'Projects',
      html: () => `
        <div class="cards">
          ${SITE.projects.map((p) => `
            <article class="card">
              <p class="kind">${joined(p.kind, p.when)}</p>
              <h3>${p.name}</h3>
              <p>${p.text}</p>
              ${tags(p.stack || [])}
              ${(p.links || []).length ? '<p class="links">' + p.links.map((l) => ext(l.label, l.url)).join('') + '</p>' : ''}
            </article>`).join('')}
        </div>`,
    },
    experience: {
      title: 'Experience',
      html: () => SITE.experience.map((e) => entry(e, e.role)).join(''),
    },
    academy: {
      title: 'Education and skills',
      html: () => `
        ${SITE.education.map((e) => entry(e, e.course)).join('')}
        <h3 class="sub">Skills</h3>
        <div class="skills">
          ${SITE.skills.map((s) => `<div><h4>${s.group}</h4>${tags(s.items)}</div>`).join('')}
        </div>`,
    },
    // The hobbies hub is built by js/hobbies.js. Travel lives inside it;
    // the Photo Club in the game opens the hub straight on the travel page.
    hobbies: {
      title: 'Outside of code',
      html: () => '<div class="hub" data-hub></div>',
    },
    travel: {
      title: 'Travel album',
      html: () => '<div class="hub" data-hub data-open="travel"></div>',
    },
    contact: {
      title: 'Contact',
      html: () => `
        <div class="contact">
          <figure class="portrait round">${img(P.contactPhoto, P.name)}</figure>
          <div>
            <p>${P.contactText}</p>
            <p class="links">
              <a class="btn big" href="mailto:${P.email}">${P.email}</a>
              ${ext('LinkedIn', P.linkedin)}
              ${ext('GitHub', P.github)}
            </p>
          </div>
        </div>`,
    },
    finale: {
      title: 'All 8 badges collected!',
      html: () => `
        <div class="finale">
          <p class="big-line">You explored the whole town. Thanks for playing.</p>
          <p>You now know what I've studied, what I've built and what I do when I'm not coding. The only thing left is to add me to your party.</p>
          <p class="links">
            <a class="btn big" href="mailto:${P.email}">Email ${P.name.split(' ')[0]}</a>
            ${ext('LinkedIn', P.linkedin)}
            ${ext('GitHub', P.github)}
          </p>
        </div>`,
    },
  };

  /* The photo viewer: the picture on the left and, if the photo has a note,
     its story typed out beside it like dialogue in a retro game. */
  const Viewer = (function () {
    let timer = null, full = '';
    const box = () => document.getElementById('lightbox');
    const note = () => box().querySelector('.viewer-note');
    const stop = () => { clearInterval(timer); timer = null; };
    return {
      open(shot) {
        const b = box(), d = shot.dataset;
        stop();
        b.querySelector('img').src = d.full;
        b.querySelector('img').alt = d.caption || '';
        b.querySelector('.viewer-place').textContent = d.place || '';
        b.querySelector('h3').textContent = d.caption || '';
        full = d.note || '';
        note().textContent = '';
        b.classList.toggle('has-note', !!full);
        b.hidden = false;
        if (!full) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { note().textContent = full; return; }
        let i = 0;
        timer = setInterval(() => {
          i++;
          note().textContent = full.slice(0, i);
          if (i >= full.length) stop();
        }, 26);
      },
      /* a click on the text finishes the typing; a click anywhere else closes the viewer */
      click(e) {
        if (timer && e.target.closest('aside')) { stop(); note().textContent = full; return; }
        this.close();
      },
      close() { stop(); box().hidden = true; },
    };
  })();
  window.Viewer = Viewer;

  window.Content = {
    DATA: Object.assign({}, P, { travel: SITE.travel }),
    SECTIONS,
    order: ['about', 'projects', 'experience', 'academy', 'hobbies', 'contact'],
    src,
    thumb,
    attr,
    PLACEHOLDER,
  };
})();
