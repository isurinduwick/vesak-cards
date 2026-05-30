# 🪷 Vesak Cards — Powered by Orvait

A beautiful, animated Vesak card platform. No backend. No database. No sign-up.
Users enter two names, pick a card style, and get a unique shareable link instantly.

---

## How it works

Everything lives in the URL as query parameters:

```
vesak-cards.vercel.app?from=Isuru&to=Ravidu&card=lotus
```

When someone opens that link, the card renders automatically with their names and
the chosen animation. No server needed — it's 100% static HTML/CSS/JS.

---

## Card themes

| Theme   | Icon | Feel           |
|---------|------|----------------|
| Lotus   | 🪷   | Pink / Serene  |
| Lantern | 🏮   | Warm / Golden  |
| Bodhi   | 🌿   | Green / Earthy |

---

## Deploy for FREE (5 minutes)

### Option A — Vercel (recommended)

1. Create a free account at https://vercel.com
2. Push this folder to a GitHub repository
3. In Vercel, click **"Add New Project"** → import your GitHub repo
4. Click **Deploy** — done!

Your live URL: `https://your-project-name.vercel.app`

### Option B — GitHub Pages

1. Push this folder to a GitHub repo (e.g. `vesak-cards`)
2. Go to repo **Settings → Pages**
3. Set source to **"Deploy from a branch"** → select `main` → `/ (root)`
4. Save — GitHub will give you: `https://yourusername.github.io/vesak-cards/`

### Option C — Netlify drag & drop

1. Go to https://app.netlify.com/drop
2. Drag the entire `vesak-cards` folder onto the page
3. Your site is live instantly!

---

## Custom domain (optional)

Once deployed, you can point a domain like `vesakcards.lk` to your Vercel/Netlify
project in their dashboard under **Domains**. The free plan supports custom domains.

---

## Project structure

```
vesak-cards/
├── index.html        ← single page app
├── css/
│   └── style.css     ← all styles
├── js/
│   └── app.js        ← all logic
└── README.md
```

---

## Sharing flow

1. User fills in **their name** + **recipient's name**
2. Picks a card template
3. Clicks **Create My Card**
4. A unique link is generated (URL params)
5. Share via **WhatsApp**, **Copy link**, or **Native share** (Telegram, Viber, etc.)
6. Recipient opens link → sees animated card immediately

---

Powered by **Orvait** 🙏
