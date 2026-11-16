/* TRAVEL ALBUM: one block per country, each with its pin on the map and its photos.
   lon and lat place the pin (search "<city> coordinates" and use longitude, latitude).

   Each photo has:
     file     a file name from assets/photos/
     caption  the short line under the picture
     note     (optional) the story shown beside the picture when it is clicked         */
window.SITE = window.SITE || {};

SITE.travel = [
  {
    place: 'Japan', lon: 138, lat: 36,
    blurb: 'Kyoto shrines, the deer of Nara, Mt Fuji, Shibuya at night and Expo 2025 in Osaka.',
    photos: [
      {
        file: 'japan-statue.jpg',
        caption: 'Meeting a legend in Japan',
        note: 'Visited the Pokémon Center at Tokyo Solamachi by the Skytree. Growing up on these games sparked my early interest in tech, so picking up cards and plushies here was a full-circle moment.',
      },
      {
        file: 'japan-fuji.jpg',
        caption: 'Mt Fuji behind the pagoda',
        note: 'Climbing up to Chureito Pagoda was where we met Junichi. Taking his advice, we set out at 5am to catch Mt Fuji from empty, quiet roads and the surrounding valley—proof that local insight and early starts always pay off.',
      },
      {
        file: 'japan-mt-fuji-kind-stranger.jpg',
        caption: 'Mt Fuji local hero',
        note: 'We met a local volunteer, Junichi, who shared hidden spots around Fujiyoshida. Exploring his recommendations gave us completely different angles of Mt Fuji away from the usual tourist crowds.',
      },
      {
        file: 'japan-bamboo.jpg',
        caption: 'Bamboo forest',
        note: 'Walking through the bamboo groves in Kyoto was a great change of pace from the busy cities—a quiet space to step back, reset, and take everything in.',
      },
      {
        file: 'japan-console.jpg',
        caption: 'Mt Fuji, handheld edition',
        note: 'A shared passion for Japanese retro hardware and handheld engineering was one of the main reasons my friends and I planned this trip, so bringing my PS Vita along to Mt Fuji felt only right.',
      },
      {
        file: 'japan-nara.jpg',
        caption: 'The deer of Nara Park',
        note: 'Spent the afternoon in Nara Park seeing how seamlessly wildlife and city life coexist there. It was a memorable example of how deeply local customs and respect for nature are woven into everyday life.',
      },
      {
        file: 'japan-shrine.jpg',
        caption: 'Shrine gates in Kyoto',
        note: 'Exploring Fushimi Inari with friends. Navigating the trails and steep climbs together made reaching the quieter viewpoints higher up the mountain even more rewarding.',
      },
      {
        file: 'japan-boat.jpg',
        caption: 'River boat in Kyoto',
        note: 'Taking a traditional wooden boat down the river in Kyoto. Watching the boatmen steer through the currents with total precision and coordination was impressive to see.',
      },
      {
        file: 'japan-shibuya-sky.jpg',
        caption: 'Shibuya from above',
        note: 'Looking out over Tokyo from Shibuya Sky at night. Seeing the scale and organisation of the city from above puts infrastructure and urban engineering into a whole new perspective.',
      },
      {
        file: 'japan-shibuya.jpg',
        caption: 'Shibuya at dawn',
        note: 'Being out in Shibuya at dawn showed a completely different side to one of the busiest districts in the world—calm, orderly, and just starting to wake up.',
      },
      {
        file: 'japan-expo.jpg',
        caption: 'Expo 2025, Osaka',
        note: 'Expo 2025 in Osaka was a highlight of the trip. Exploring emerging technologies from different countries, learning about new cultures, and networking with people from around the world was genuinely inspiring.',
      },
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
      {
        file: 'lakes-crew.jpg', caption: 'Lake District',
        note: 'I love hiking. Trips like this are where I pick up new skills, and getting a whole group up a hill in the rain takes real teamwork and determination.',
      },
      { file: 'lakes-view.jpg', caption: 'A rest above the lake' },
      { file: 'uk-deer.jpg', caption: 'A field, a deer and a sunset' },
      { file: 'greenwich.jpg', caption: 'London skyline from Greenwich',
        note: 'This is my favourite park in London, I love going on walks to refresh my brain and to take a break from work, and I like visiting this park because of the skyline and nature, especially if the weather is good.',},
    ],
  },
  {
    place: 'Saudi Arabia', lon: 45, lat: 24,
    blurb: 'Photos coming soon.',
    photos: [
      { file: 'saudi-1.jpg', caption: 'Photo coming soon' },
    ],
  },
  {
    place: 'Bangladesh', lon: 90.4, lat: 23.8,
    blurb: 'Photos coming soon.',
    photos: [
      { file: 'bangladesh-1.jpg', caption: 'Photo coming soon' },
    ],
  },
];
