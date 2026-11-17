/* ABOUT YOU: name, intro, quick facts and contact details.
   Change the text between the quotes. Pictures are file names from assets/photos/. */
window.SITE = window.SITE || {};

SITE.profile = {
  name: 'Cavio Hossain',
  tagline: 'Computer Science with AI student who likes building things you can play with.',

  email: 'hossaincavio@gmail.com',
  linkedin: 'https://www.linkedin.com/in/cavio/',
  github: 'https://github.com/Cav-io',

  photo: 'portrait.jpg',        // About section
  heroPhoto: 'linkedin.jpg',    // round picture at the very top of the classic view
  contactPhoto: 'contact.jpg',  // Contact section

  // Each line in quotes is one paragraph of the About section.
  about: [
    "Hi, I'm Cavio. I study Computer Science with Artificial Intelligence at the University of Nottingham, and I split my time between Nottingham and London.",
    'I got into programming by making games. My A-Level project was a 2D RPG written from scratch in JavaScript, and my university group project was testing a cross-platform game framework for Feral Interactive. This site is a small game too, because that felt more honest than a page of bullet points.',
    'Before code I was an animator. I still draw digitally and edit videos, and that eye for how things look and move follows me into everything I build.',
  ],

  // The small boxes under the About text.
  facts: [
    { label: 'Studying', value: 'BSc Computer Science with AI' },
    { label: 'Based in', value: 'Nottingham and London, UK' },
    { label: 'Speaks', value: 'English, Bengali, Italian (native), Spanish (basic)' },
    { label: 'Currently into', value: 'C++, testing, machine learning' },
  ],

  // The paragraph in the Contact section.
  contactText: "I'm looking for software engineering internships and placements. If you think I'd be a good fit for your team, or you just want to talk about games, send me a message.",
};
