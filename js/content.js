/* All the portfolio content lives here. Edit this file to update the site. */
(function () {
  'use strict';

  const DATA = {
    name: 'Cavio Hossain',
    tagline: 'Computer Science with AI student who likes building things you can play with.',
    email: 'hossaincavio@gmail.com',
    linkedin: 'https://www.linkedin.com/in/cavio/',
    github: 'https://github.com/Cav-io',

    about: [
      "Hi, I'm Cavio. I study Computer Science with Artificial Intelligence at the University of Nottingham, and I split my time between Nottingham and London.",
      'I got into programming by making games. My A-Level project was a 2D RPG written from scratch in JavaScript, and my university group project was testing a cross-platform game framework for Feral Interactive. This site is a small game too, because that felt more honest than a page of bullet points.',
      'Before code I was an animator. I still draw digitally and edit videos, and that eye for how things look and move follows me into everything I build.',
    ],

    facts: [
      ['Studying', 'BSc Computer Science with AI'],
      ['Based in', 'Nottingham and London, UK'],
      ['Speaks', 'English, Bengali, Italian (native), Spanish (basic)'],
      ['Currently into', 'C++, testing, machine learning'],
    ],

    education: [
      {
        place: 'University of Nottingham',
        what: 'BSc Computer Science with Artificial Intelligence',
        when: 'Sep 2024 – Jun 2027',
        where: 'Nottingham, UK',
        points: ['Average grade: 66% (2:1)'],
      },
      {
        place: 'London Metropolitan University',
        what: 'Robotics Summer School',
        when: 'Jun 2022 – Jul 2022',
        where: 'London, UK',
        points: [
          'Built an Arduino-powered robotic car in C with 5+ programmed movement and control functions',
          'Added Bluetooth so it could be driven wirelessly from a smartphone',
        ],
      },
    ],

    skills: [
      { group: 'Languages', items: ['Python', 'C++', 'JavaScript', 'HTML/CSS', 'SQL', 'Haskell', 'C'] },
      { group: 'Testing and tools', items: ['GoogleTest', 'Git', 'Jupyter', 'Excel'] },
      { group: 'Data and ML', items: ['Pandas', 'scikit-learn', 'Matplotlib'] },
      { group: 'Spoken', items: ['English', 'Bengali', 'Italian', 'Spanish (basic)'] },
    ],

    experience: [
      {
        place: 'Feral Interactive (industry client)',
        role: 'Software Engineer, University Group Project',
        when: 'Sep 2025 – Jun 2026',
        where: 'Nottingham, UK',
        points: [
          'Developed and ran 100+ C++ unit tests with GoogleTest covering the input and window systems and 3 games (Pong, Breakout, Frogger)',
          'Tested a cross-platform abstraction layer built on OS-specific APIs, including Cocoa (macOS) and GDI+ (Windows)',
          'Found and investigated software regressions so updates did not break existing game features',
          'Created and maintained 20+ manual test cases to support systematic feature validation',
        ],
      },
      {
        place: 'Dojo (Paymentsense Ltd)',
        role: 'Data Engineering Internship',
        when: 'Jul 2022',
        where: 'Paddington, London',
        points: [
          'Analysed 5,000+ transaction records in Excel to identify fraud indicators and assess transaction risk',
          'Identified 15+ potential risk patterns and presented the findings to Dojo stakeholders',
        ],
      },
      {
        place: 'Dojo Real Work Experience',
        role: 'Team Website Development Project',
        when: 'Mar 2022 – Apr 2022',
        where: 'London, UK',
        points: [
          'Led the winning team in a 26-team web development competition',
          'Designed and coded a restaurant search website in JavaScript, HTML and CSS',
        ],
      },
      {
        place: 'Safety Steward',
        role: 'Part-time, football stadiums',
        when: 'Jan 2023 – present',
        where: 'London and Nottingham',
        points: [
          'Matchdays at Tottenham Hotspur, Nottingham Forest, Leyton Orient and Notts County',
        ],
      },
    ],

    projects: [
      {
        name: '2D RPG Adventure Game',
        kind: 'A-Level Computer Science NEA',
        when: 'Sep 2022 – May 2023',
        stack: ['JavaScript', 'HTML', 'CSS'],
        text: 'A full browser RPG built from scratch: a tile-based world rendered from 2D arrays, sprite movement, collision detection and NPCs to talk to. 150+ Git commits and 300+ pages of technical documentation.',
        links: [
          ['Play it', 'http://game.cavio.uk/'],
          ['Source', 'https://github.com/Cav-io/2D-RPG-Adventure-Game-Code'],
        ],
      },
      {
        name: 'Game Framework Test Suite',
        kind: 'Feral Interactive client project',
        when: 'Sep 2025 – Jun 2026',
        stack: ['C++', 'GoogleTest', 'Cocoa', 'GDI+'],
        text: '100+ unit tests for a cross-platform game framework, covering its input and window systems and three games built on it (Pong, Breakout and Frogger), plus 20+ manual test cases and regression investigations.',
        links: [],
      },
      {
        name: 'Red Wine Quality',
        kind: 'Machine learning coursework',
        when: 'Feb 2025 – Mar 2025',
        stack: ['Python', 'Pandas', 'scikit-learn', 'Matplotlib', 'Jupyter'],
        text: 'Linear Regression and Decision Tree models trained on 1,599 samples with 11 features and tuned with cross-validation. Cleaned the data (outliers, imputation, feature selection), evaluated with MSE, MAE and R², and diagnosed overfitting.',
        links: [],
      },
      {
        name: 'GOCHU-K Website',
        kind: 'Website for a family-run Korean pop-up in Brixton',
        when: '2026',
        stack: ['TypeScript', 'React', 'TanStack Start', 'Tailwind CSS'],
        text: 'A single-page site with the menu, drinks, story, reviews and a map. The menu is read from a Google Sheet, so it can be updated without touching any code.',
        links: [],
      },
      {
        name: 'Bluetooth Robot Car',
        kind: 'Robotics Summer School',
        when: 'Jun 2022 – Jul 2022',
        stack: ['C', 'Arduino', 'Bluetooth'],
        text: 'An Arduino-powered car with 5+ movement and control functions, driven wirelessly from a phone over Bluetooth.',
        links: [],
      },
      {
        name: 'Restaurant Search Website',
        kind: 'Dojo competition, 1st of 26 teams',
        when: 'Mar 2022 – Apr 2022',
        stack: ['JavaScript', 'HTML', 'CSS'],
        text: 'Led the team that designed and coded a restaurant search site, and won the competition.',
        links: [],
      },
      {
        name: 'Portfolio Town',
        kind: 'The site you are on',
        when: '2026',
        stack: ['JavaScript', 'Canvas', 'No libraries'],
        text: 'A playable portfolio. The world, sprites and tiles are all drawn in code on a 256×192 canvas, with a dialogue system, turn-based bug battles and a classic one-page view for anyone in a hurry.',
        links: [],
      },
    ],

    hobbies: [
      ['Gaming', 'Pokémon above everything, Platinum especially, plus the weird and wonderful world of niche fan games and ROM hacks. Minecraft when I want to build instead of battle.'],
      ['Animation', 'I used to be an animator. Frame-by-frame work taught me patience and timing.'],
      ['Digital art', 'Drawing is how I switch off. It is also why I care how software looks.'],
      ['Video editing', 'I cut and edit videos for fun, usually from trips.'],
      ['Badminton', 'My sport of choice. Fast, tactical and humbling.'],
      ['Football', 'I watch it, play it, and steward it at four different clubs.'],
      ['Travelling', 'Japan, South Korea and Italy so far. The Photo Club has the evidence.'],
      ['Hiking', 'Lake District trips with friends, whatever the weather says.'],
    ],

    travel: [
      {
        place: 'Japan', lon: 138, lat: 36,
        blurb: 'Kyoto shrines, the deer of Nara, Mt Fuji, Shibuya at night and Expo 2025 in Osaka.',
        photos: [
          ['japan-statue.jpg', 'Meeting a legend in Japan'],
          ['japan-fuji.jpg', 'Mt Fuji behind the pagoda'],
          ['japan-bamboo.jpg', 'Bamboo forest'],
          ['japan-console.jpg', 'Mt Fuji, handheld edition'],
          ['japan-nara.jpg', 'The deer of Nara Park'],
          ['japan-shrine.jpg', 'Shrine gates in Kyoto'],
          ['japan-boat.jpg', 'River boat in Kyoto'],
          ['japan-shibuya-sky.jpg', 'Shibuya from above'],
          ['japan-shibuya.jpg', 'Shibuya at dusk'],
          ['japan-expo.jpg', 'Expo 2025, Osaka'],
        ],
      },
      {
        place: 'South Korea', lon: 127.5, lat: 37,
        blurb: 'Palace courtyards and pagodas.',
        photos: [
          ['korea-palace.jpg', 'Palace courtyard'],
          ['korea-pagoda.jpg', 'Pagoda in the gardens'],
        ],
      },
      {
        place: 'Italy', lon: 11.5, lat: 43.5,
        blurb: 'Coastlines at golden hour, harbours and one famous leaning tower.',
        photos: [
          ['italy-coast.jpg', 'Golden hour on the coast'],
          ['italy-harbour.jpg', 'Above the harbour'],
          ['pisa.jpg', 'Pisa'],
        ],
      },
      {
        place: 'United Kingdom', lon: -2, lat: 53, home: true,
        blurb: 'Home base. Lake District hikes and London sunsets.',
        photos: [
          ['lakes-crew.jpg', 'Lake District with the crew'],
          ['lakes-view.jpg', 'A rest above the lake'],
          ['uk-deer.jpg', 'A field, a deer and a sunset'],
          ['greenwich.jpg', 'London skyline from Greenwich'],
        ],
      },
    ],
  };

  const P = 'assets/photos/';
  const tags = (list) => '<ul class="tags">' + list.map((t) => `<li>${t}</li>`).join('') + '</ul>';
  const points = (list) => '<ul class="points">' + list.map((t) => `<li>${t}</li>`).join('') + '</ul>';
  const ext = (label, url) => `<a class="btn" href="${url}" target="_blank" rel="noopener">${label}</a>`;

  function timeline(items, roleKey) {
    return items
      .map(
        (e) => `
      <article class="entry">
        <header>
          <h3>${e.place}</h3>
          <span class="when">${e.when}</span>
        </header>
        <p class="role">${e[roleKey]} · ${e.where}</p>
        ${points(e.points)}
      </article>`
      )
      .join('');
  }

  const SECTIONS = {
    about: {
      title: 'About me',
      badge: 'HOME',
      html: () => `
        <div class="about">
          <figure class="portrait"><img src="${P}portrait.jpg" alt="Cavio Hossain" loading="lazy"></figure>
          <div>
            ${DATA.about.map((p) => `<p>${p}</p>`).join('')}
            <dl class="facts">
              ${DATA.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
            </dl>
          </div>
        </div>`,
    },
    projects: {
      title: 'Projects',
      badge: 'LAB',
      html: () => `
        <div class="cards">
          ${DATA.projects
            .map(
              (p) => `
            <article class="card">
              <p class="kind">${p.kind} · ${p.when}</p>
              <h3>${p.name}</h3>
              <p>${p.text}</p>
              ${tags(p.stack)}
              ${p.links.length ? '<p class="links">' + p.links.map(([l, u]) => ext(l, u)).join('') + '</p>' : ''}
            </article>`
            )
            .join('')}
        </div>`,
    },
    experience: {
      title: 'Experience',
      badge: 'CAREER',
      html: () => timeline(DATA.experience, 'role'),
    },
    academy: {
      title: 'Education and skills',
      badge: 'ACADEMY',
      html: () => `
        ${timeline(DATA.education, 'what')}
        <h3 class="sub">Skills</h3>
        <div class="skills">
          ${DATA.skills.map((s) => `<div><h4>${s.group}</h4>${tags(s.items)}</div>`).join('')}
        </div>`,
    },
    hobbies: {
      title: 'Outside of code',
      badge: 'ARCADE',
      html: () => `
        <div class="cards small">
          ${DATA.hobbies.map(([h, t]) => `<article class="card"><h3>${h}</h3><p>${t}</p></article>`).join('')}
        </div>`,
    },
    travel: {
      title: 'Travel album',
      badge: 'PHOTO',
      html: () => `
        <p class="wmap-intro">Hover over a place on the map (or tap it) to see the photos from there.</p>
        <div class="wmap" data-wmap></div>`,
    },
    contact: {
      title: 'Contact',
      badge: 'POST',
      html: () => `
        <div class="contact">
          <figure class="portrait round"><img src="${P}smile.jpg" alt="Cavio smiling" loading="lazy"></figure>
          <div>
            <p>I'm looking for software engineering internships and placements. If you think I'd be a good fit for your team, or you just want to talk about games, send me a message.</p>
            <p class="links">
              <a class="btn big" href="mailto:${DATA.email}">${DATA.email}</a>
              ${ext('LinkedIn', DATA.linkedin)}
              ${ext('GitHub', DATA.github)}
            </p>
          </div>
        </div>`,
    },
    finale: {
      title: 'All 8 badges collected!',
      badge: '',
      html: () => `
        <div class="finale">
          <p class="big-line">You explored the whole town. Thanks for playing.</p>
          <p>You now know what I've studied, what I've built and what I do when I'm not coding. The only thing left is to add me to your party.</p>
          <p class="links">
            <a class="btn big" href="mailto:${DATA.email}">Email Cavio</a>
            ${ext('LinkedIn', DATA.linkedin)}
            ${ext('GitHub', DATA.github)}
          </p>
        </div>`,
    },
  };

  window.Content = { DATA, SECTIONS, order: ['about', 'projects', 'experience', 'academy', 'hobbies', 'travel', 'contact'] };
})();
