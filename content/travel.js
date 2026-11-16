/* TRAVEL ALBUM: one block per country, each with its pin on the map and its photos.
   lon and lat place the pin (search "<city> coordinates" and use longitude, latitude).
   Photos are file names from assets/photos/.                                       */
window.SITE = window.SITE || {};

SITE.travel = [
  {
    place: 'Japan', lon: 138, lat: 36,
    blurb: 'Kyoto shrines, the deer of Nara, Mt Fuji, Shibuya at night and Expo 2025 in Osaka.',
    photos: [
      { file: 'japan-statue.jpg', caption: 'Meeting a legend in Japan' },
      { file: 'japan-fuji.jpg', caption: 'Mt Fuji behind the pagoda' },
      { file: 'japan-bamboo.jpg', caption: 'Bamboo forest' },
      { file: 'japan-console.jpg', caption: 'Mt Fuji, handheld edition' },
      { file: 'japan-nara.jpg', caption: 'The deer of Nara Park' },
      { file: 'japan-shrine.jpg', caption: 'Shrine gates in Kyoto' },
      { file: 'japan-boat.jpg', caption: 'River boat in Kyoto' },
      { file: 'japan-shibuya-sky.jpg', caption: 'Shibuya from above' },
      { file: 'japan-shibuya.jpg', caption: 'Shibuya at dusk' },
      { file: 'japan-expo.jpg', caption: 'Expo 2025, Osaka' },
    ],
  },
  {
    place: 'South Korea', lon: 127.5, lat: 37,
    blurb: 'Palace courtyards and pagodas.',
    photos: [
      { file: 'korea-palace.jpg', caption: 'Palace courtyard' },
      { file: 'korea-pagoda.jpg', caption: 'Pagoda in the gardens' },
    ],
  },
  {
    place: 'Italy', lon: 11.5, lat: 43.5,
    blurb: 'Coastlines at golden hour, harbours and one famous leaning tower.',
    photos: [
      { file: 'italy-coast.jpg', caption: 'Golden hour on the coast' },
      { file: 'italy-harbour.jpg', caption: 'Above the harbour' },
      { file: 'pisa.jpg', caption: 'Pisa' },
    ],
  },
  {
    place: 'United Kingdom', lon: -2, lat: 53,
    home: true, // the pin the flight routes start from
    blurb: 'Home base. Lake District hikes and London sunsets.',
    photos: [
      { file: 'lakes-crew.jpg', caption: 'Lake District with the crew' },
      { file: 'lakes-view.jpg', caption: 'A rest above the lake' },
      { file: 'uk-deer.jpg', caption: 'A field, a deer and a sunset' },
      { file: 'greenwich.jpg', caption: 'London skyline from Greenwich' },
    ],
  },
];
