/* PROJECTS: one block per project, shown in this order.
   To add a project, copy a whole block from { to }, paste it and change the text.
   links can be empty: links: []                                                */
window.SITE = window.SITE || {};

SITE.projects = [
  {
    name: '2D RPG Adventure Game',
    kind: 'A-Level Computer Science NEA',
    when: 'Sep 2022 – May 2023',
    stack: ['JavaScript', 'HTML', 'CSS'],
    text: 'A full browser RPG built from scratch: a tile-based world rendered from 2D arrays, sprite movement, collision detection and NPCs to talk to. 150+ Git commits and 300+ pages of technical documentation.',
    links: [
      { label: 'Play it', url: 'http://game.cavio.uk/' },
      { label: 'Source', url: 'https://github.com/Cav-io/2D-RPG-Adventure-Game-Code' },
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
    text: 'A playable portfolio. The town is drawn in code on a 256×192 canvas, with a dialogue system, turn-based bug battles and a classic one-page view for anyone in a hurry.',
    links: [{ label: 'Source', url: 'https://github.com/Cav-io/Website-Portofolio' }],
  },
];
