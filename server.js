const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080;

// Firebase config — reads Firestore REST API (no admin SDK needed)
const FIREBASE_PROJECT = process.env.FIREBASE_PROJECT_ID || 'richblok-app';

/**
 * Fetch a Firestore document via REST (public read).
 * Works because our badges collection is in test mode (open reads) until rules are deployed.
 * After rules deploy, public badge reads should be allowed by the rules file.
 */
function getFirestoreDoc(collection, docId) {
  return new Promise((resolve) => {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/${collection}/${docId}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) return resolve(null);
        try {
          const parsed = JSON.parse(body);
          resolve(extractFields(parsed.fields || {}));
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

/** Unpack Firestore REST "typed values" into plain JS. */
function extractFields(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v.stringValue !== undefined) out[k] = v.stringValue;
    else if (v.integerValue !== undefined) out[k] = parseInt(v.integerValue, 10);
    else if (v.doubleValue !== undefined) out[k] = v.doubleValue;
    else if (v.booleanValue !== undefined) out[k] = v.booleanValue;
    else if (v.timestampValue !== undefined) out[k] = v.timestampValue;
    else if (v.mapValue !== undefined) out[k] = extractFields(v.mapValue.fields || {});
  }
  return out;
}

function escapeXml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clamp(s, n) {
  if (!s) return '';
  return s.length > n ? s.substring(0, n - 1) + '…' : s;
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/** Build a 1200×630 SVG for the badge. */
function renderBadgeSvg(badge) {
  const name = escapeXml(clamp(badge.userName || 'Richblok member', 32));
  const skill = escapeXml(clamp(badge.skill || 'Challenge', 24));
  const level = escapeXml(capitalize(badge.level || 'Mid'));
  const score = Math.max(0, Math.min(100, parseInt(badge.score || 0, 10)));
  const percentile = parseInt(badge.percentile || 0, 10);
  const country = escapeXml(badge.userCountry || '');
  const scoreColor = score >= 80 ? '#1dd1a1' : score >= 60 ? '#f97316' : '#ef4444';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="1" stop-color="#16243f"/>
    </linearGradient>
    <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1dd1a1"/>
      <stop offset="1" stop-color="#00d4ff"/>
    </linearGradient>
    <radialGradient id="rg" cx="75%" cy="25%" r="60%">
      <stop offset="0" stop-color="#1dd1a1" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#1dd1a1" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="url(#rg)"/>

  <!-- Logo mark -->
  <g transform="translate(60 60)">
    <rect x="0" y="0" width="56" height="56" rx="12" fill="url(#gr)"/>
    <text x="28" y="42" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="900" font-size="34" fill="#0b1220" text-anchor="middle">R</text>
  </g>
  <text x="130" y="96" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="32" fill="#ffffff">Richblok</text>

  <!-- Verified chip -->
  <g transform="translate(60 140)">
    <rect x="0" y="0" width="180" height="36" rx="8" fill="#1dd1a1" opacity="0.15"/>
    <text x="14" y="24" font-family="system-ui" font-weight="700" font-size="14" fill="#1dd1a1">✓ VERIFIED BADGE</text>
  </g>

  <!-- Skill -->
  <text x="60" y="230" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="600" font-size="28" fill="#a5b4cf">${skill} · ${level}</text>

  <!-- Name -->
  <text x="60" y="285" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="900" font-size="56" fill="#ffffff">${name}${country ? ' ' + country : ''}</text>

  <!-- Score (big) -->
  <g transform="translate(60 370)">
    <text x="0" y="0" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="900" font-size="200" fill="${scoreColor}" letter-spacing="-6">${score}</text>
    <text x="280" y="-110" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="700" font-size="56" fill="#6b7a99">/ 100</text>
  </g>

  <!-- Percentile -->
  ${percentile ? `<text x="60" y="500" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="600" font-size="30" fill="#a5b4cf">Top ${Math.max(1, 100 - percentile)}% of ${level.toLowerCase()} candidates</text>` : ''}

  <!-- Footer -->
  <line x1="60" y1="550" x2="1140" y2="550" stroke="#223154" stroke-width="2"/>
  <text x="60" y="590" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="600" font-size="22" fill="#6b7a99">Earn yours at richblok.app</text>
  <text x="1140" y="590" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="500" font-size="18" fill="#6b7a99" text-anchor="end">Verified by Richblok</text>
</svg>`;
}

function renderFallbackSvg(label) {
  const esc = escapeXml(label || 'Richblok');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="1" stop-color="#16243f"/>
    </linearGradient>
    <linearGradient id="gr" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1dd1a1"/>
      <stop offset="1" stop-color="#00d4ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(600 260)">
    <rect x="-48" y="-48" width="96" height="96" rx="20" fill="url(#gr)"/>
    <text x="0" y="18" font-family="system-ui" font-weight="900" font-size="60" fill="#0b1220" text-anchor="middle">R</text>
  </g>
  <text x="600" y="420" font-family="system-ui" font-weight="900" font-size="72" fill="#ffffff" text-anchor="middle">Richblok</text>
  <text x="600" y="480" font-family="system-ui" font-weight="600" font-size="32" fill="#1dd1a1" text-anchor="middle">${esc}</text>
</svg>`;
}

// OG image endpoint — dynamic SVG rendered server-side, readable by Facebook / Twitter / WhatsApp crawlers
app.get('/og/badge/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const badge = await getFirestoreDoc('badges', id);
    const svg = badge ? renderBadgeSvg(badge) : renderFallbackSvg('Verified Skills, Hired Globally');
    res.set('Content-Type', 'image/svg+xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    res.send(svg);
  } catch (err) {
    console.error('OG badge error:', err);
    res.set('Content-Type', 'image/svg+xml; charset=utf-8');
    res.send(renderFallbackSvg('Richblok'));
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the Angular build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle Angular routing - send all non-static, non-og requests to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Richblok server running on port ${PORT}`);
});
