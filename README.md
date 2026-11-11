# Ratul Krishna Mojumder — Portfolio

Base design: menu bar + home page (hero, about, work, contact).

## Files

```
index.html             home page
cv.html                CV page (opens from the CV button)
css/style.css          all design (colours are at the top, in :root)
js/content.js          default text, lists and contact buttons
js/core.js             shared helpers
js/main.js             home page logic, popups
js/cv.js               CV page logic
js/agents.js           moving cursors + sparks effect
js/firebase-config.js  Firebase connection
js/live.js             loads saved content from Firebase
admin/                 admin panel -> open <site link>/admin/
images/                your photo (profile.png)
files/                 CV_Ratul.pdf (the download button uses this)
FIREBASE-SETUP.md      how to connect Firebase (one time)
```

## Put it on GitHub Pages

1. Create a new **public** repository on GitHub (e.g. `portfolio`).
2. Upload everything in this folder (keep the folder structure).
3. Repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `(root)` → Save.
4. After a minute the site is live at `https://<your-username>.github.io/portfolio/`.

## Your photo

Upload your photo to the `images` folder with the name **`profile.png`**.
A transparent (cut-out) portrait PNG looks best in front of the ring design. Until it is uploaded the
site shows "RK" in its place.

## Admin

Open `<site link>/admin/`. It works after you finish FIREBASE-SETUP.md.
Until then, edit `js/content.js` directly to change text and links.
