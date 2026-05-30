/* ============================================================
   VESAK CARDS — app.js  |  Powered by Orvait
   ============================================================ */

'use strict';

/* ── State ─────────────────────────────────────────────── */
let selectedCard  = 'lotus';
let animFrame     = null;
let particles     = [];
let resizeHandler = null;

/* ── Card config ────────────────────────────────────────── */
const CARDS = {
  lotus: {
    icon:   '🪷',
    image:  'https://i.pinimg.com/736x/c6/2e/83/c62e8308c969736cca5e35411491d9f5.jpg',
    image2: 'https://i.pinimg.com/736x/d4/d9/24/d4d9246f12000c5a63003a2d21d5e61b.jpg',
    theme:  'theme-lotus',
    wish:   'Happy Vesak!',
    color:  '#c2547a',
    label:  'Lotus Vesak',
  },
  lantern: {
    icon:   '🏮',
    image:  'https://i.pinimg.com/1200x/a6/85/8d/a6858d4a93958ba1a93f83a66c977e05.jpg',
    image2: 'https://i.pinimg.com/1200x/e5/ae/4c/e5ae4c13105aeb5310a8789ef4618545.jpg',
    theme:  'theme-lantern',
    wish:   'Happy Vesak!',
    color:  '#d4823a',
    label:  'Lantern Vesak',
  },
  bodhi: {
    icon:   '🌿',
    image:  'https://i.pinimg.com/1200x/b6/7d/26/b67d26208dfe98abeb3215d48f938435.jpg',
    image2: 'https://i.pinimg.com/736x/c6/2e/83/c62e8308c969736cca5e35411491d9f5.jpg',
    theme:  'theme-bodhi',
    wish:   'Happy Vesak!',
    color:  '#3aaa5e',
    label:  'Bodhi Vesak',
  },
};

/* ── Template selector ──────────────────────────────────── */
function selectCard(type, btn) {
  selectedCard = type;
  document.querySelectorAll('.tmpl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── Generate card ──────────────────────────────────────── */
function generateCard() {
  const from = document.getElementById('from-name').value.trim();
  const to   = document.getElementById('to-name').value.trim();

  if (!from || !to) {
    const missing = !from ? 'from-name' : 'to-name';
    const el = document.getElementById(missing);
    el.focus();
    el.style.borderColor = '#e06060';
    setTimeout(() => el.style.borderColor = '', 1200);
    return;
  }

  /* Build URL params */
  const params = new URLSearchParams({ from, to, card: selectedCard });
  const newUrl = `${location.pathname}?${params.toString()}`;
  history.replaceState(null, '', newUrl);

  showCard(from, to, selectedCard);
}

/* ── Show card page ─────────────────────────────────────── */
function showCard(from, to, cardType) {
  const cfg = CARDS[cardType] || CARDS.lotus;

  const iconEl = document.getElementById('card-icon');
  iconEl.innerHTML = `<img src="${cfg.image}" alt="${cfg.label}" />`;

  document.getElementById('card-greeting').textContent = `For ${to}`;
  document.getElementById('card-wish').textContent     = cfg.wish;
  document.getElementById('card-from').textContent     = `With metta from ${from} 🙏`;

  const bg = document.getElementById('card-bg');
  bg.className = 'card-bg ' + cfg.theme;

  /* Set background deco images */
  const decos = [
    { id: 'card-deco-1', src: cfg.image  },
    { id: 'card-deco-2', src: cfg.image2 },
    { id: 'card-deco-3', src: cfg.image  },
  ];
  decos.forEach(({ id, src }) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<img src="${src}" alt="" />`;
  });

  /* Show/hide native share */
  document.getElementById('btn-native-share').style.display =
    navigator.share ? 'flex' : 'none';

  navigate('page-card');
  startCanvasAnimation(cfg);
}

/* ── Canvas animation ───────────────────────────────────── */
function startCanvasAnimation(cfg) {
  const canvas = document.getElementById('card-canvas');
  const ctx    = canvas.getContext('2d');

  cancelAnimationFrame(animFrame);
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  particles = [];

  let W = 0, H = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bg  = canvas.parentElement;
    W = canvas.offsetWidth  || (bg && bg.offsetWidth)  || window.innerWidth;
    H = canvas.offsetHeight || (bg && bg.offsetHeight) || window.innerHeight;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeHandler = resize;
  window.addEventListener('resize', resizeHandler);

  function loop() {
    ctx.clearRect(0, 0, W, H);

    /* Ambient glow — centre + bottom */
    const grd = ctx.createRadialGradient(
      W / 2, H * 0.85, 0,
      W / 2, H * 0.85, W * 0.6
    );
    grd.addColorStop(0, hexAlpha(cfg.color, 0.1));
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    /* Second glow at top */
    const grd2 = ctx.createRadialGradient(
      W / 2, H * 0.15, 0,
      W / 2, H * 0.15, W * 0.4
    );
    grd2.addColorStop(0, hexAlpha(cfg.color, 0.05));
    grd2.addColorStop(1, 'transparent');
    ctx.fillStyle = grd2;
    ctx.fillRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.y    -= p.vy;
      p.x    += Math.sin(p.drift + p.y * 0.008) * 0.4;
      p.life -= 1;
      p.alpha = Math.min(p.life / 40, 1) * p.maxAlpha;

      ctx.globalAlpha  = Math.max(0, p.alpha);
      ctx.font         = `${p.size}px serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, p.x, p.y);

      if (p.life <= 0 || p.y < -30) {
        particles[i] = makeParticle(W, H, cfg, false);
      }
    });

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(loop);
  }

  /* Defer first resize until browser has committed layout — fixes 0×0 canvas on mobile */
  requestAnimationFrame(function() {
    resize();
    const count = W < 600 ? 45 : 75;
    for (let i = 0; i < count; i++) {
      particles.push(makeParticle(W, H, cfg, true));
    }
    loop();
  });
}

function makeParticle(w, h, cfg, scatter) {
  const emojis = {
    theme_lotus:   ['🪷','🌸','✨','🌺','💮'],
    theme_lantern: ['🏮','✨','🕯️','⭐','🌟'],
    theme_bodhi:   ['🌿','🍃','✨','🌱','💚'],
  };
  const set = emojis['theme_' + cfg.theme.replace('theme-','')]
           || emojis['theme_lotus'];

  return {
    emoji:    set[Math.floor(Math.random() * set.length)],
    x:        Math.random() * w,
    y:        scatter ? Math.random() * h : h + 20,
    vy:       0.4 + Math.random() * 0.8,
    drift:    Math.random() * Math.PI * 2,
    size:     14 + Math.random() * 18,
    life:     80 + Math.random() * 120,
    maxAlpha: 0.25 + Math.random() * 0.45,
    alpha:    0,
  };
}

function hexAlpha(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ── Home particles (sparkles) ──────────────────────────── */
function spawnHomeParticles() {
  const container = document.getElementById('home-particles');
  if (!container) return;

  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    const size = 4 + Math.random() * 6;
    const delay = Math.random() * 6;
    const dur   = 4 + Math.random() * 4;
    const x     = Math.random() * 100;

    p.style.cssText = `
      position:absolute;
      left:${x}%;
      top:${80 + Math.random()*20}%;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:rgba(200,150,62,${0.1+Math.random()*0.4});
      box-shadow:0 0 ${size*2}px rgba(200,150,62,0.4);
      animation:sparkle-up ${dur}s ${delay}s ease-in infinite;
      pointer-events:none;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkle-up {
      0%   { transform:translateY(0) scale(1) translateZ(0); opacity:0; }
      10%  { opacity:1; }
      100% { transform:translateY(-70vh) scale(0.3) translateZ(0); opacity:0; }
    }
  `;
  document.head.appendChild(style);
}

/* ── Share ──────────────────────────────────────────────── */
function currentUrl() { return location.href; }

function shareWhatsApp() {
  const url  = currentUrl();
  const from = new URLSearchParams(location.search).get('from') || '';
  const to   = new URLSearchParams(location.search).get('to')   || '';
  const text = `${from} sent you a Vesak blessing 🪷\n\nOpen your card: ${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function copyLink() {
  navigator.clipboard.writeText(currentUrl()).then(() => {
    const lbl = document.getElementById('copy-label');
    lbl.textContent = 'Copied! ✓';
    setTimeout(() => lbl.textContent = 'Copy link', 2000);
  });
}

function nativeShare() {
  const from = new URLSearchParams(location.search).get('from') || '';
  const to   = new URLSearchParams(location.search).get('to')   || '';
  navigator.share({
    title: `Vesak blessings from ${from} 🪷`,
    text:  `${from} sent you a Vesak card, ${to}!`,
    url:   currentUrl(),
  }).catch(() => {});
}

/* ── Navigation ─────────────────────────────────────────── */
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function newCard() {
  cancelAnimationFrame(animFrame);
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  const newUrl = location.pathname;
  history.replaceState(null, '', newUrl);
  navigate('page-home');
}

/* ── Init — read URL params on load ─────────────────────── */
function init() {
  spawnHomeParticles();

  const params  = new URLSearchParams(location.search);
  const from    = params.get('from');
  const to      = params.get('to');
  const cardType = params.get('card') || 'lotus';

  if (from && to) {
    /* Someone opened a shared link — go straight to card */
    selectedCard = cardType;
    showCard(from, to, cardType);

    /* Pre-fill form in case they navigate back */
    document.getElementById('from-name').value = from;
    document.getElementById('to-name').value   = to;
    document.querySelectorAll('.tmpl-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.card === cardType);
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
