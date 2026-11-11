# Ratul Krishna Mojumder — Portfolio

Base design: menu bar + home page (hero, about, work, contact).

## Files

```
index.html        main page
css/style.css     all design (colours are at the top, in :root)
js/main.js        menu, animations, photo fallback
images/           put your pictures here
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

## Next steps (not built yet)

- Firebase connection (Firestore for content)
- Admin login (Firebase Authentication) + forgot password by email
- Edit / add / delete everything from the admin panel
- Work lists: Graphics and Projects, with icon search or image file name
