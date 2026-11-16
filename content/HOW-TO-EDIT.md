# How to edit the site

Everything the site says lives in this folder. You never need to open the files in `js/`.

| To change... | Edit this file |
| --- | --- |
| Name, intro, quick facts, email and links, main photos | `profile.js` |
| Projects | `projects.js` |
| Jobs and work experience | `experience.js` |
| Education and skills | `education.js` |
| Hobbies | `hobbies.js` |
| Travel map and its photos | `travel.js` |

## Changing text

Open the file, find the sentence, and change the words between the quotes. Save, then refresh the page.

Three rules keep the file working:

1. Keep the quotes around the text. If your text contains an apostrophe (like `I'm`), wrap it in double quotes: `"I'm a student"`.
2. Keep the comma at the end of each line.
3. Every `{` needs its `}` and every `[` needs its `]`.

If the page goes blank after an edit, it is almost always a missing quote or comma on the line you just changed.

## Changing a picture

All pictures live in `assets/photos/`.

- **Swap a picture:** save your new picture into `assets/photos/` with the same file name as the old one. Nothing else to do.
- **Use a different file:** put the picture in `assets/photos/`, then change the file name in the content file, for example `photo: 'portrait.jpg'` to `photo: 'me-at-graduation.jpg'`.

A file name that does not exist yet shows a "photo coming soon" placeholder, so you can write the name first and add the picture later.

Use `.jpg` for photos and keep them under about 1 MB each so the site stays fast. Around 1600 pixels on the longest side is plenty.

### Optional: sharper small pictures

The small pictures in the travel and hobby galleries look their sharpest with a pre-shrunk copy. If you want one, save a smaller version (about 500 pixels on the longest side) with the **same file name** into `assets/photos/thumbs/`. If you skip this, the site simply uses the full picture.

## Adding something new

Copy an existing block, from its `{` to its `},`, paste it where you want it in the list, and change the text. The order in the file is the order on the site.

## Putting changes live

Commit and push to `main`. The live site at cavio.uk updates a minute or two later.

```bash
git add -A
git commit -m "Update content"
git push
```
