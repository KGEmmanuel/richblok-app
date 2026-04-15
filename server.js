const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON bodies per endpoint. CV uploads can be ~12MB (PDF base64).
app.use('/api/star-map', express.json({ limit: '100kb' }));
app.use('/api/coach', express.json({ limit: '100kb' }));
app.use('/api/cv-extract', express.json({ limit: '12mb' }));
app.use('/api/cv-to-star', express.json({ limit: '200kb' }));
// Default smaller limit for other /api endpoints
app.use('/api/health', express.json({ limit: '8kb' }));

// Anthropic Claude API config
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5';
const CLAUDE_HAIKU_MODEL = process.env.CLAUDE_HAIKU_MODEL || 'claude-haiku-4-5';

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
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: !!ANTHROPIC_API_KEY
  });
});

/**
 * Call Claude Messages API.
 * `userContent` may be a plain string OR an array of content blocks
 * (for PDF / document inputs: [{type:'document',source:{type:'base64',...}}, {type:'text',text:'...'}]).
 * Returns { content: string } or throws.
 */
function callClaude({ model, system, userMessage, userContent, maxTokens = 1200, temperature = 0.4 }) {
  return new Promise((resolve, reject) => {
    if (!ANTHROPIC_API_KEY) {
      return reject(new Error('ANTHROPIC_API_KEY not configured on server'));
    }
    const content = userContent !== undefined ? userContent : userMessage;
    const body = JSON.stringify({
      model: model || CLAUDE_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: system || '',
      messages: [{ role: 'user', content }]
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-length': Buffer.byteLength(body)
      },
      timeout: 60000
    }, (resp) => {
      let chunks = '';
      resp.on('data', c => chunks += c);
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(chunks);
          if (parsed.error) {
            return reject(new Error(parsed.error.message || 'Claude API error'));
          }
          // Concatenate text blocks (Claude may return multiple text blocks)
          const text = (parsed.content || [])
            .filter(b => b.type === 'text')
            .map(b => b.text)
            .join('\n');
          resolve({ content: text, usage: parsed.usage });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('Claude API timeout')); });
    req.write(body);
    req.end();
  });
}

const COMPETENCY_Q = {
  leadership: 'Tell me about a time you led a team through a complex problem.',
  conflict_resolution: 'Describe a time you resolved a disagreement with a teammate.',
  pressure_performance: 'Tell me about your most stressful professional situation.',
  learning_from_failure: 'Tell me about a time you failed at work.',
  teamwork: 'Give an example of working with a difficult colleague.',
  communication: 'Explain a technical concept to a non-technical stakeholder.',
  initiative: 'Tell me about a time you showed initiative.',
  decision_making: 'Give me an example of a decision you made with incomplete information.',
  adaptability: 'Describe a time you had to adjust to major changes at work.',
  feedback_reception: 'Tell me about a time you received critical feedback.'
};

const COMPETENCY_LABELS = {
  leadership: 'Leadership',
  conflict_resolution: 'Conflict Resolution',
  pressure_performance: 'Pressure Performance',
  learning_from_failure: 'Learning from Failure',
  teamwork: 'Teamwork',
  communication: 'Communication',
  initiative: 'Initiative',
  decision_making: 'Decision Making',
  adaptability: 'Adaptability',
  feedback_reception: 'Feedback Reception'
};

/**
 * POST /api/star-map
 * Body: { challengeTitle, challengeFormat, skills[], competencyTags[], score, correct, total, userName?, project? }
 * Returns: { answers: [ { competency, question, situation, task, action, result } ], unlockedQuestions[] }
 *
 * Uses Claude when ANTHROPIC_API_KEY is set; otherwise returns a templated fallback.
 */
app.post('/api/star-map', async (req, res) => {
  const p = req.body || {};
  const tags = Array.isArray(p.competencyTags) && p.competencyTags.length
    ? p.competencyTags
    : ['pressure_performance', 'decision_making', 'learning_from_failure'];

  // Fallback: structured templated STAR answers (works without Claude)
  function fallbackAnswers() {
    return tags.slice(0, 5).map(tag => {
      const label = COMPETENCY_LABELS[tag] || tag;
      const question = COMPETENCY_Q[tag] || 'Tell me about a challenging experience.';
      return {
        competency: tag,
        competencyLabel: label,
        question,
        situation: `I completed the Richblok "${p.challengeTitle || 'skill challenge'}" — a timed assessment covering ${(p.skills || []).join(', ') || 'core engineering topics'}.`,
        task: `My goal was to demonstrate ${label.toLowerCase()} by answering ${p.total || 20} rapid-fire questions correctly under a ${Math.round(((p.total || 20) * 60) / 60)}-minute constraint, with no opportunity to look things up.`,
        action: `I prioritized the questions I was most confident on first to secure easy wins, then systematically worked through ambiguous ones, eliminating implausible options before committing.`,
        result: `I scored ${p.score || 0}/100 (${p.correct || 0} of ${p.total || 20} correct), earning a verified Richblok badge. This confirmed my ${label.toLowerCase()} under real time pressure — a concrete example I can point to in interviews.`
      };
    });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.json({
      mode: 'fallback',
      answers: fallbackAnswers(),
      unlockedQuestions: tags.map(t => COMPETENCY_Q[t]).filter(Boolean)
    });
  }

  try {
    const system = `You are a behavioral interview coach. Generate draft STAR (Situation, Task, Action, Result) answers for candidates based on their concrete project work. Write in first-person, past tense, be specific, avoid generic fluff. Reference real numbers (scores, question counts, durations) from the user's project. Each STAR answer must be 4 crisp sentences total. Output ONLY valid JSON — no markdown, no commentary.`;

    const userPrompt = `Project completed by the user:
- Challenge title: ${p.challengeTitle || '(unknown)'}
- Format: ${p.challengeFormat || 'solo_capstone'}
- Skills demonstrated: ${(p.skills || []).join(', ') || 'various'}
- Outcome: ${p.correct || 0}/${p.total || 20} correct (score ${p.score || 0}/100)
- Target competencies: ${tags.map(t => COMPETENCY_LABELS[t] || t).join(', ')}
${p.project ? `- Additional project context: ${String(p.project).substring(0, 600)}` : ''}

For EACH of these competencies, generate a STAR answer this user could honestly give in an interview:
${tags.map(t => `- ${t}: ${COMPETENCY_Q[t]}`).join('\n')}

Return this exact JSON shape:
{
  "answers": [
    {
      "competency": "leadership",
      "question": "Tell me about a time you led a team through a complex problem.",
      "situation": "...",
      "task": "...",
      "action": "...",
      "result": "..."
    }
  ]
}`;

    const { content } = await callClaude({
      model: CLAUDE_HAIKU_MODEL,   // fast + cheap for STAR generation
      system,
      userMessage: userPrompt,
      maxTokens: 2000,
      temperature: 0.3
    });

    // Extract JSON from response (strip markdown if any slipped through)
    let json = content.trim();
    const match = json.match(/\{[\s\S]*\}/);
    if (match) json = match[0];
    const parsed = JSON.parse(json);

    // Attach labels + ensure shape
    const answers = (parsed.answers || []).map(a => ({
      competency: a.competency,
      competencyLabel: COMPETENCY_LABELS[a.competency] || a.competency,
      question: a.question || COMPETENCY_Q[a.competency] || '',
      situation: a.situation || '',
      task: a.task || '',
      action: a.action || '',
      result: a.result || ''
    }));

    res.json({
      mode: 'ai',
      answers,
      unlockedQuestions: answers.map(a => a.question).filter(Boolean)
    });
  } catch (err) {
    console.error('star-map error:', err.message);
    // Always return something usable — never 500 on this critical path
    res.json({
      mode: 'fallback_error',
      error: err.message,
      answers: fallbackAnswers(),
      unlockedQuestions: tags.map(t => COMPETENCY_Q[t]).filter(Boolean)
    });
  }
});

/**
 * POST /api/coach
 * Body: { answer: StarAnswer, userMessage: string, projectContext?: string, history?: [] }
 * Returns: { reply: string }
 */
app.post('/api/coach', async (req, res) => {
  const p = req.body || {};
  if (!p.answer || !p.userMessage) {
    return res.status(400).json({ error: 'answer + userMessage required' });
  }
  if (!ANTHROPIC_API_KEY) {
    return res.json({
      mode: 'fallback',
      reply: `To make this answer land, quantify the Result more: "I scored X/100, which placed me in the top Y%." Then add one sentence about what you'd do differently next time — interviewers love self-aware candidates. Your current "Action" is too abstract; replace "I systematically worked through" with a concrete heuristic you actually used.`
    });
  }

  try {
    const system = `You are a sharp, warm behavioral interview coach. You help candidates turn their real project work into compelling STAR answers. Be direct, specific, practical. Point out weak spots. Suggest concrete rewrites. Keep replies under 150 words unless asked for more.`;

    const userPrompt = `Candidate's draft STAR answer for "${p.answer.question}":

Situation: ${p.answer.situation}
Task: ${p.answer.task}
Action: ${p.answer.action}
Result: ${p.answer.result}

Candidate's question/request to you: "${p.userMessage}"

${p.projectContext ? `Project context: ${String(p.projectContext).substring(0, 400)}` : ''}

Coach them. Be specific and actionable.`;

    const { content } = await callClaude({
      model: CLAUDE_MODEL,
      system,
      userMessage: userPrompt,
      maxTokens: 600,
      temperature: 0.6
    });

    res.json({ mode: 'ai', reply: content });
  } catch (err) {
    console.error('coach error:', err.message);
    res.json({
      mode: 'fallback_error',
      error: err.message,
      reply: 'I hit a temporary issue reaching my model. In the meantime, the best thing you can do is add one specific number to your Result — a score, a percentile, a date — and rewrite the Action in one sentence that starts with a verb.'
    });
  }
});

/**
 * POST /api/cv-extract
 * Body (PDF mode):   { source: 'pdf', filename, base64 }          — PDF binary up to ~8MB
 * Body (text mode):  { source: 'text', text }                     — pasted resume text
 *
 * Returns structured JSON parsed from the CV:
 *   { mode, profile: { fullName, headline, location, email },
 *     experiences: [{ role, company, location, startDate, endDate, duration, description, achievements[] }],
 *     projects: [{ name, description, tech[], impact }],
 *     education: [{ school, degree, field, years }],
 *     skills: [...strings...] }
 */
app.post('/api/cv-extract', async (req, res) => {
  const p = req.body || {};
  const source = p.source || (p.base64 ? 'pdf' : 'text');

  if (!ANTHROPIC_API_KEY) {
    return res.json({
      mode: 'fallback',
      error: 'AI parsing not configured. Set ANTHROPIC_API_KEY to enable CV parsing.',
      profile: { fullName: '', headline: '', location: '' },
      experiences: [],
      projects: [],
      education: [],
      skills: []
    });
  }

  const system = `You are a world-class résumé parser. Extract structured information from a CV/resume. Output ONLY valid JSON matching the shape described. Be faithful to the source — do not invent content. If a field is absent, omit it or use an empty array. Quantify achievements when the CV includes numbers.`;

  const instruction = `Extract a structured JSON from this résumé. Return EXACTLY this shape (no markdown, no commentary):

{
  "profile": {
    "fullName": "",
    "headline": "",
    "location": "",
    "email": ""
  },
  "experiences": [
    {
      "role": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "duration": "",
      "description": "",
      "achievements": ["...", "..."]
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "tech": ["..."],
      "impact": ""
    }
  ],
  "education": [
    {
      "school": "",
      "degree": "",
      "field": "",
      "years": ""
    }
  ],
  "skills": ["skill1", "skill2"]
}

Rules:
- Each experience "description" is 1-2 sentences summarizing scope.
- "achievements" is an array of concrete, quantified bullet points (2-5 max per role).
- Projects include personal / academic / side projects explicitly mentioned.
- "headline" is a one-line self-description (e.g., "Senior Backend Engineer · Payments").
- Keep dates in "YYYY-MM" format when possible; otherwise use what the CV shows.
- Return ONLY the JSON. No prose before or after.`;

  try {
    let userContent;

    if (source === 'pdf' && p.base64) {
      // PDF document input (Claude 3.5+ supports direct PDF via Messages API)
      userContent = [
        {
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: p.base64
          }
        },
        { type: 'text', text: instruction }
      ];
    } else if (p.text && typeof p.text === 'string') {
      // Pasted text
      userContent = `${instruction}\n\nCV TEXT:\n"""\n${String(p.text).substring(0, 18000)}\n"""`;
    } else {
      return res.status(400).json({ error: 'Provide { source:"pdf", base64 } or { source:"text", text }' });
    }

    const { content, usage } = await callClaude({
      model: CLAUDE_HAIKU_MODEL,
      system,
      userContent,
      maxTokens: 4000,
      temperature: 0.2
    });

    // Extract JSON
    let json = content.trim();
    const match = json.match(/\{[\s\S]*\}/);
    if (match) json = match[0];
    const parsed = JSON.parse(json);

    res.json({
      mode: 'ai',
      ...parsed,
      _usage: usage
    });
  } catch (err) {
    console.error('cv-extract error:', err.message);
    res.json({
      mode: 'error',
      error: err.message,
      profile: {},
      experiences: [],
      projects: [],
      education: [],
      skills: []
    });
  }
});

/**
 * POST /api/cv-to-star
 * Body: { cvData (parsed), uid?, userName?, targetCompetencies?: string[] }
 *
 * Turns a parsed CV into N draft STAR answers (one per experience × competency pair).
 * Each answer carries source:"cv" and verified:false until the user completes a challenge.
 */
app.post('/api/cv-to-star', async (req, res) => {
  const p = req.body || {};
  const cv = p.cvData || {};
  const experiences = Array.isArray(cv.experiences) ? cv.experiences : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];

  // Pick a diverse set of competencies to cover (max 6)
  const allCompetencies = ['leadership', 'pressure_performance', 'decision_making', 'learning_from_failure', 'teamwork', 'communication', 'initiative', 'adaptability'];
  const targetCompetencies = Array.isArray(p.targetCompetencies) && p.targetCompetencies.length
    ? p.targetCompetencies
    : allCompetencies.slice(0, 6);

  function fallbackAnswers() {
    // Pick the first experience or project we can reference, or return empty.
    const source = experiences[0] || projects[0];
    if (!source) { return []; }
    return targetCompetencies.slice(0, 5).map(tag => ({
      competency: tag,
      competencyLabel: COMPETENCY_LABELS[tag] || tag,
      question: COMPETENCY_Q[tag] || 'Tell me about a challenging experience.',
      situation: `In my role as ${source.role || source.name || 'a contributor'} ${source.company ? 'at ' + source.company : ''}, ${source.description || ''}`.trim(),
      task: `Demonstrate ${(COMPETENCY_LABELS[tag] || tag).toLowerCase()} in a concrete professional context.`,
      action: (source.achievements && source.achievements[0]) || 'I took ownership of the outcome and executed.',
      result: `Delivered measurable impact on the project.`,
      verified: false,
      source: 'cv'
    }));
  }

  if (!ANTHROPIC_API_KEY || (experiences.length === 0 && projects.length === 0)) {
    return res.json({ mode: 'fallback', answers: fallbackAnswers() });
  }

  try {
    const system = `You are a behavioral interview coach. You read a candidate's CV and draft honest, specific STAR (Situation, Task, Action, Result) answers based ONLY on the experiences and projects listed. You NEVER invent facts. You reference real company names, roles, numbers, and achievements from the CV. Mark each STAR answer as DRAFT until the candidate verifies it with a Richblok challenge. Return ONLY valid JSON.`;

    const prompt = `CANDIDATE CV DATA:
${JSON.stringify({ profile: cv.profile, experiences, projects, skills: cv.skills }, null, 2)}

TASK: For each of these ${targetCompetencies.length} behavioral competencies, write a STAR draft answer grounded in ONE of the candidate's real experiences or projects above.
${targetCompetencies.map(t => `- ${t} → "${COMPETENCY_Q[t]}"`).join('\n')}

Rules:
- Pull from the CV verbatim where possible (role, company, tech, numbers).
- Each STAR field (S/T/A/R) is 1-2 crisp sentences.
- If the CV doesn't contain enough material for a competency, SKIP that competency entirely. Better to return 3 strong answers than 6 weak ones.
- Every answer MUST name a real experience/project from the CV.
- Output this EXACT JSON shape (no prose, no markdown):

{
  "answers": [
    {
      "competency": "leadership",
      "question": "Tell me about a time you led a team through a complex problem.",
      "situation": "...",
      "task": "...",
      "action": "...",
      "result": "...",
      "sourceExperience": "Company X · Role Y"
    }
  ]
}`;

    const { content } = await callClaude({
      model: CLAUDE_HAIKU_MODEL,
      system,
      userMessage: prompt,
      maxTokens: 3500,
      temperature: 0.35
    });

    let json = content.trim();
    const match = json.match(/\{[\s\S]*\}/);
    if (match) json = match[0];
    const parsed = JSON.parse(json);

    const answers = (parsed.answers || []).map(a => ({
      competency: a.competency,
      competencyLabel: COMPETENCY_LABELS[a.competency] || a.competency,
      question: a.question || COMPETENCY_Q[a.competency] || '',
      situation: a.situation || '',
      task: a.task || '',
      action: a.action || '',
      result: a.result || '',
      sourceExperience: a.sourceExperience || '',
      verified: false,
      source: 'cv'
    }));

    res.json({ mode: 'ai', answers });
  } catch (err) {
    console.error('cv-to-star error:', err.message);
    res.json({ mode: 'fallback_error', error: err.message, answers: fallbackAnswers() });
  }
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
