# ANIVERSE (Anime News & Cosplay Hub)

Front-End website built as a static anime and cosplay portal with responsive Bootstrap styling, theme toggling, storage interactions, and a cosplay gallery.

## Features

- **Dark / light theme toggle** with localStorage persistence
- **News page** using the Jikan API plus JSON fallback data
- **Gallery page** with cosplay images, favorites, and a spotlight video
- **Events RSVP** with sessionStorage behavior
- **Community page** with a poll and comment-style demo content
- **Contact page** with form validation, remember-me cookies, and follow-us links

## Current gallery setup

The gallery loads image files from `assets/images/gallery-1.png` through `gallery-8.png`.
The gallery also includes an embedded cosplay spotlight video on `gallery.html`.

## How to run

### Option A — Local dev server (recommended)

This project uses [Vite](https://vitejs.dev/) so relative fetch requests and assets work correctly.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173/`). Use the navbar to visit `index.html`, `news.html`, `gallery.html`, `events.html`, `community.html`, and `contact.html`.

### Option B — Open files directly

You can open `index.html` in a browser, but some modern browsers block local `fetch()` requests. If the News page does not load correctly, use Option A.

## Pages

| Page      | File             | Highlights |
| --------- | ---------------- | ---------- |
| Home      | `index.html`     | Landing welcome page with navigation and site overview |
| News      | `news.html`      | Anime news feed with Jikan API + fallback JSON |
| Gallery   | `gallery.html`   | Cosplay image grid, favorites, and YouTube spotlight video |
| Events    | `events.html`    | Event cards and RSVP modal with sessionStorage state |
| Community | `community.html` | Demo community poll and comment feed |
| Contact   | `contact.html`   | Form validation, remember-me cookie, follow-us links |

## Tech stack

- HTML5, CSS3, JavaScript
- Bootstrap 5.3 via CDN
- Bootstrap Icons
- Vite for local development and build
- Browser storage: `localStorage`, `sessionStorage`, cookies

## Build and preview

```bash
npm run build
npm run preview
```

The built site is written to `dist/`.

## Notes

- Place your cosplay images in `assets/images/` with names matching `gallery-1.png` through `gallery-8.png`
- The contact page now uses direct follow links for Instagram, Discord, and YouTube
- If you deploy to a static host, the site is ready as a plain static frontend
