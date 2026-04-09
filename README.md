# ANIVERSE (Anime News & Cosplay Hub)

Student front-end demo styled from **`Demo Design/Design.docx`** mockups: cyberpunk **dark** theme (neon pink / cyan / purple, grid background, mono UI) and a **light** theme (scanline-style grey background). Six Bootstrap pages: anime catalog (**Jikan** + JSON fallback), cosplay gallery (**localStorage** favorites), events (**sessionStorage** RSVP), community poll + comments (local demo only), contact form + optional **cookies**, theme toggle (**localStorage** + cookie mirror).

## How to run

### Option A — Local dev server (recommended)

Uses [Vite](https://vitejs.dev/) so `fetch` works reliably for `/assets/data/news-fallback.json` and the Jikan API.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173/**) and navigate with the navbar (`/news.html`, `/gallery.html`, etc.).

### Option B — Open files directly

Double-click **`index.html`** or open it from your browser. Some browsers restrict `file://` fetches; if the News page cannot load the fallback JSON, use Option A.

## Pages

| Page        | File           | Highlights                                      |
| ----------- | -------------- | ----------------------------------------------- |
| Home        | `index.html`   | Carousel (WebP), sidebar, share links           |
| News        | `news.html`    | Jikan API + `assets/data/news-fallback.json`    |
| Gallery     | `gallery.html` | WebP grid, lazy loading, favorites              |
| Events      | `events.html`  | RSVP modal, sessionStorage                      |
| Community   | `community.html` | Poll “Best Anime of 2025”, comments (demo)  |
| Contact     | `contact.html` | Validation, FAQ accordion, remember-me cookie   |

## Tech

- HTML5, CSS3, JavaScript (ES5/ES6-style IIFEs)
- Bootstrap 5.3 (CDN), Bootstrap Icons
- Storage: `localStorage`, `sessionStorage`, cookies

## Build (optional)

```bash
npm run build
npm run preview
```

Output is in `dist/`; adjust paths if you deploy to a subfolder.
