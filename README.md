# Ratul Krishna Mojumder — Portfolio

Base design: menu bar + home page (hero, about, work, contact).

## Files

```
index.html             main page
css/style.css          all design (colours are at the top, in :root)
js/content.js          default text, lists and contact buttons
js/main.js             shows the content, menu, popups
js/agents.js           the moving-cursor "build" effect
js/firebase-config.js  paste your Firebase config here
js/live.js             loads saved content from Firebase
admin/                 admin panel -> open <site link>/admin/
images/                put your pictures here
FIREBASE-SETUP.md      how to connect Firebase (one time)
```

## Put it on GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `portfolio`).
2. Upload everything in this folder (keep the folder structure).
3. Repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `(root)` → Save.
4. After a minute the site is live at `https://<your-username>.github.io/portfolio/`.

## Your photo

Upload your photo to the `images` folder with the name **`profile.jpg`**.
A portrait photo (4:5, e.g. 800×1000) looks best. Until it is uploaded the
site shows "RK" in its place.

## Admin

Open `<site link>/admin/`. It works after you finish FIREBASE-SETUP.md.
Until then, edit `js/content.js` directly to change text and links.
