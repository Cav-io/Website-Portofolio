/* HOBBIES: each block is one box in the Hobbies section. Hovering a box opens it up.

   title    the name on the box
   colour   the box's accent colour
   teaser   the short line shown on the closed box
   text     paragraphs shown when the box is open (one per line in quotes)
   media    pictures, GIFs or videos shown when the box is open.
            file is a name from assets/photos/ (.jpg .png .gif for pictures, .mp4 .webm for videos)
   type: 'travel' is special: it shows the travel map from travel.js                              */
window.SITE = window.SITE || {};

SITE.hobbies = [
  {
    id: 'travel',
    title: 'Travelling',
    colour: '#f15bb5',
    teaser: 'Six countries so far. Open the map.',
    type: 'travel',
    text: ['Hover over a place on the map (or tap it) to see the photos from there. Click a photo to read the story behind it.'],
  },
  {
    id: 'animation',
    title: 'Animation and video editing',
    colour: '#8f5bd6',
    teaser: 'I used to be an animator, and I still cut videos.',
    text: [
      'Before code I was an animator. Frame-by-frame work taught me patience and timing.',
      'These days I mostly edit videos for fun, usually from trips.',
    ],
    media: [
      { file: 'animation-1.mp4', caption: 'An animation I made' },
    ],
  },
  {
    id: 'art',
    title: 'Digital art',
    colour: '#ff9f1c',
    teaser: 'Drawing, and sprites for games.',
    text: [
      'Drawing is how I switch off. It is also why I care how software looks.',
      'I have made sprites for games, which is where my art and my code meet.',
    ],
    media: [
      { file: 'art-1.png', caption: 'Game sprites I made' },
      { file: 'art-2.png', caption: 'Digital artwork' },
    ],
  },
  {
    id: 'badminton',
    title: 'Badminton',
    colour: '#2ec4b6',
    teaser: 'My sport of choice.',
    text: [
      'Fast, tactical and humbling.',
      "I joined my university's Intra-Mural Sport (IMS) to keep playing alongside my degree.",
    ],
    media: [],
  },
  {
    id: 'gaming',
    title: 'Gaming',
    colour: '#3a86ff',
    teaser: 'Pokémon, ROM hacks and Minecraft.',
    text: ['Pokémon above everything, Platinum especially, plus the weird and wonderful world of niche fan games and ROM hacks. Minecraft when I want to build instead of battle.'],
    media: [],
  },
  {
    id: 'football',
    title: 'Football',
    colour: '#ff5d73',
    teaser: 'Watching, playing and stewarding.',
    text: ['I watch it, play it, and steward it at four different clubs.'],
    media: [],
  },
  {
    id: 'hiking',
    title: 'Hiking',
    colour: '#58ad42',
    teaser: 'Lake District trips with friends.',
    text: ['Lake District trips with friends, whatever the weather says.'],
    media: [],
  },
];
