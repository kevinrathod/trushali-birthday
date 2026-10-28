# 🎀 Trushali's Little Universe

A 10-page birthday surprise website, built with React, Vite, React Router and Framer Motion.
Frontend only: no backend, database, API key or paid service.

**Login:** username `butki`, password `2910` (change it in the config file).

---

## 1. Make it yours (one file!)

Open **`src/config/birthdayConfig.js`**. It holds: names, birthday date, login, letter and birthday
message, compliments, jar notes, photo list and captions, memory-game animals, nicknames, music path and theme colours.

### Photos (Memory Garden: 3 on top, 2 below)
1. Put images in `public/assets/photos/` named `photo-01.jpg` … `photo-05.jpg` in display order (or edit the paths in the config). Each photo has a `focus` setting in the config that decides which part stays visible when it is cropped.
2. Resize them to about 1200px wide so they load quickly on phones.
3. Missing photos show pretty placeholder frames. No photos are invented.

### Animal photos (memory-match game)
Put animal pictures in `public/assets/animals/` named `animal-01.jpg` … `animal-06.jpg` (one per pair).
Any card without a file shows the animal emoji instead. Edit names, emojis, paths and the surprise message under `memory` in the config.
Use photos you took or that are free to use.

### Nicknames
The gift box shows the nicknames from `nicknames` in the config.

### Music
The music file is `public/assets/birthday-music.mp3`; replace it to change the song. It starts by itself when she presses "Unlock the surprise" (the tap lets browsers allow sound) and she can pause, mute or change the volume with the buttons at the top right.
Put your own file at `public/assets/birthday-music.mp3`. Only use music you own or have permission to use.
If the file is missing the site works normally and the music button explains how to add it.
Browsers only allow audio after a tap, so music starts when she presses play.

### Login security
The login is a **cute surprise lock, not real security**. Frontend-only passwords can be read by anyone who
opens the browser developer tools. Never reuse a real password.

---

## 2. Run it on your computer (beginner steps)

1. Install **Node.js (LTS)** from https://nodejs.org
2. Install **VS Code** from https://code.visualstudio.com, then `File → Open Folder…` and choose this folder.
3. Open the terminal in VS Code (`Terminal → New Terminal`) and run:

```bash
npm install        # downloads the tools (first time only)
npm run dev        # starts the site; open the address it prints (usually http://localhost:5173)
```

Other commands:

```bash
npm run build      # makes the production site in the "dist" folder
npm run preview    # tries the production build locally
npm test           # runs the automated tests
```

---

## 3. Put it on GitHub and publish with GitHub Pages

1. Create a free account at https://github.com and click **New repository**. Name it anything (e.g. `trushali-birthday`),
   keep it **Public** (free GitHub Pages needs this), and do **not** add a README.
2. In the VS Code terminal, inside this project folder:

```bash
git init
git add .
git commit -m "Birthday website for Trushali"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

3. On GitHub open **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) builds and publishes automatically on every push to `main`.
   Watch it under the **Actions** tab. When it is green, your site is at
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

**Why refresh works:** the site uses hash routes (`/#/game`), so refreshing any page never gives a 404 on GitHub Pages.
`vite.config.js` uses `base: './'`, so it works under any repository name without edits.

> Photos in a public repo are public. Only upload pictures you are happy to share, or keep the repo private and use another host.

---

## 4. How progress works
- By default every visit (and every refresh) starts fresh from the login page, nothing is remembered.
  If you ever want the site to remember her place, set `saveProgress: true` in the config file.
- Pages unlock in order: the memory game must be completed, the letter read, the gift box opened,
  and the candles blown out before the matching **Next** buttons unlock.
- "↺ Start the adventure over" (bottom of every page) resets progress. The finale also has a replay button.

## 5. Project structure
```
src/config/birthdayConfig.js   ← everything you personalise
src/config/pages.js            page order
src/context/                   saved progress
src/components/                shell, music player, envelope, gift box, cake, lightbox, fireworks…
src/pages/                     Page01Login … Page10Finale
src/styles/                    base.css, components.css, pages.css
src/utils/                     confetti, sound effects, helpers
tests/                         automated tests (Vitest)
public/assets/                 your photos and optional music
```

## 6. Accessibility & responsiveness
Mobile-first layout, no horizontal scrolling, touch-sized buttons, keyboard-friendly controls (hold-to-hug works
with Space/Enter, the lightbox with arrow keys and Esc), semantic HTML, visible focus, and
`prefers-reduced-motion` support (decorations calm down; the heart game stays playable).
