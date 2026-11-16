/* Turns the plain data in content/ into the HTML for each section.
   To change what the site says, edit the files in content/ instead of this one. */
(function () {
  'use strict';

  const SITE = window.SITE || {};
  const P = SITE.profile;
  const PHOTOS = 'assets/photos/';
  const PLACEHOLDER = PHOTOS + 'placeholder.svg';

  const src = (file) => (file ? PHOTOS + file : PLACEHOLDER);
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

  function entry(e, sub) {
    return `
      <article class="entry">
        <div class="entry-body">
          <header>
            <h3>${e.place}</h3>
            <span class="when">${e.when || ''}</span>
          </header>
          <p class="role">${joined(sub, e.where)}</p>
          ${points(e.points)}
        </div>
      </article>`;
  }

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
    hobbies: {
      title: 'Outside of code',
      html: () => `
        <div class="cards small">
          ${SITE.hobbies.map((h) => `<article class="card"><h3>${h.title}</h3>${(h.text || []).map((t) => `<p>${t}</p>`).join('')}</article>`).join('')}
        </div>`,
    },
    travel: {
      title: 'Travel album',
      html: () => `
        <p class="wmap-intro">Hover over a place on the map (or tap it) to see the photos from there.</p>
        <div class="wmap" data-wmap></div>`,
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

  window.Content = {
    DATA: Object.assign({}, P, { travel: SITE.travel }),
    SECTIONS,
    order: ['about', 'projects', 'experience', 'academy', 'hobbies', 'travel', 'contact'],
    src,
    PLACEHOLDER,
  };
})();
