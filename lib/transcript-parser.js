/**
 * F18 — AI-session transcript ingestion.
 *
 * Input: a raw transcript string the candidate pasted. Could be any of:
 *   - Claude Code jsonl  (one JSON object per line, { type, role, message, ... })
 *   - Cursor chat export (JSON or pseudo-markdown with @Cursor blocks)
 *   - OpenAI Codex / ChatGPT (JSON with messages[] array)
 *   - Generic JSON (plain array of {role, content} objects)
 *   - Markdown paste ([user] / [assistant] blocks — what our own seed test uses)
 *   - Anything else → treated as raw plaintext
 *
 * Output: a structured summary PLUS the normalized turn list. The summary
 * goes to Claude in the <transcript_summary> XML tag alongside the raw text,
 * giving the scorer a high-signal starting point (turn count, tool-call
 * count, heuristic user-pushback count, approx tokens) without trusting
 * the parser to be perfect.
 *
 * Importantly — we NEVER fail the caller. Every branch returns at least
 * an empty-but-valid summary. Parser bugs must not brick scoring.
 */

const MAX_CONTENT_PREVIEW = 240;   // chars per turn for the preview field

/**
 * Public entry point.
 * @param {string} raw  — whatever the candidate pasted
 * @returns {{ format: string, turnCount: number, userTurns: number,
 *            assistantTurns: number, toolUses: number, toolResults: number,
 *            userPushbackCount: number, approxTokens: number,
 *            firstUserMessage: string, turns: Array<{role, preview, hasCode, hasToolUse}> }}
 */
function parseTranscript(raw) {
  if (typeof raw !== 'string' || raw.length === 0) {
    return emptySummary('empty');
  }

  // Detect format from first non-whitespace token.
  const format = detectFormat(raw);

  let turns = [];
  try {
    switch (format) {
      case 'jsonl':
        turns = parseJsonl(raw);
        break;
      case 'openai-messages':
        turns = parseOpenAiMessages(raw);
        break;
      case 'cursor-chat':
        turns = parseCursorChat(raw);
        break;
      case 'markdown-paste':
        turns = parseMarkdownPaste(raw);
        break;
      case 'plaintext':
      default:
        // Heuristic fallback — treat the whole thing as one user turn so
        // downstream code has at least one row to work with.
        turns = [{ role: 'user', content: raw, toolUse: false, toolResult: false }];
        break;
    }
  } catch (err) {
    // Parser errors downgrade to plaintext — never throw to the caller.
    turns = [{ role: 'user', content: raw, toolUse: false, toolResult: false }];
  }

  return buildSummary(format, turns, raw);
}

// ======================================================================
// Format detection
// ======================================================================

function detectFormat(raw) {
  const trimmed = raw.trim();
  const head = trimmed.substring(0, 2048);

  // Markdown-paste is the most common case from manual testing:
  //   [user]
  //   blah
  //   [assistant]
  //   blah
  if (/^\s*\[(user|assistant|system|tool)\]/im.test(head)) {
    return 'markdown-paste';
  }

  // Try whole-string JSON parse BEFORE jsonl. A single-line {messages:[...]}
  // object is valid jsonl by the line-by-line rule, but is actually openai.
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && 'role' in parsed[0]) {
        return 'openai-messages';
      }
      if (parsed && Array.isArray(parsed.messages)) {
        return 'openai-messages';
      }
      if (parsed && Array.isArray(parsed.conversation) && parsed.conversation[0] && 'text' in parsed.conversation[0]) {
        return 'cursor-chat';
      }
    } catch {
      /* not valid whole-string JSON — try jsonl next */
    }
  }

  // jsonl: >=2 non-empty lines AND every sampled line parses as JSON.
  // Requiring >=2 avoids misclassifying a single-line openai-messages object.
  const firstLines = raw.split(/\r?\n/).filter(l => l.trim().length > 0).slice(0, 3);
  if (firstLines.length >= 2 && firstLines.every(looksLikeJsonObject)) {
    return 'jsonl';
  }

  return 'plaintext';
}

function looksLikeJsonObject(line) {
  const t = line.trim();
  if (!t.startsWith('{') || !t.endsWith('}')) return false;
  try {
    JSON.parse(t);
    return true;
  } catch {
    return false;
  }
}

// ======================================================================
// Format-specific parsers. Each returns a normalized turn list:
//   [{ role: 'user'|'assistant'|'system'|'tool', content: string,
//      toolUse: boolean, toolResult: boolean }]
// ======================================================================

function parseJsonl(raw) {
  const turns = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    let obj;
    try { obj = JSON.parse(t); } catch { continue; }

    // Claude Code jsonl shape: { type, message: { role, content: [ ... ] }, ... }
    // content blocks: {type:'text', text} | {type:'tool_use', ...} | {type:'tool_result', ...}
    const inner = obj.message || obj;
    const role = inner.role || obj.role || obj.type;  // 'user' | 'assistant' | 'tool_use' | 'tool_result' | 'summary'
    if (!role) continue;

    if (Array.isArray(inner.content)) {
      const textParts = [];
      let hasToolUse = false;
      let hasToolResult = false;
      for (const c of inner.content) {
        if (c && c.type === 'text' && typeof c.text === 'string') textParts.push(c.text);
        else if (c && c.type === 'tool_use') hasToolUse = true;
        else if (c && c.type === 'tool_result') hasToolResult = true;
      }
      turns.push({
        role: normalizeRole(role),
        content: textParts.join('\n'),
        toolUse: hasToolUse,
        toolResult: hasToolResult
      });
    } else if (typeof inner.content === 'string') {
      turns.push({
        role: normalizeRole(role),
        content: inner.content,
        toolUse: false,
        toolResult: false
      });
    }
  }
  return turns;
}

function parseOpenAiMessages(raw) {
  const parsed = JSON.parse(raw);
  const arr = Array.isArray(parsed) ? parsed
            : Array.isArray(parsed.messages) ? parsed.messages
            : [];
  return arr
    .filter(m => m && typeof m === 'object')
    .map(m => ({
      role: normalizeRole(m.role || 'user'),
      content: typeof m.content === 'string' ? m.content
             : Array.isArray(m.content) ? m.content.filter(c => c && c.type === 'text').map(c => c.text || '').join('\n')
             : '',
      toolUse: Array.isArray(m.tool_calls) && m.tool_calls.length > 0,
      toolResult: m.role === 'tool'
    }));
}

function parseCursorChat(raw) {
  // Cursor exports are heterogeneous — best effort: if it's JSON with
  // {conversation: [{role|author, text}]}, map it. Otherwise defer to
  // markdown-paste heuristics on the raw text.
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.conversation)) {
      return parsed.conversation.map(m => ({
        role: normalizeRole(m.role || m.author || 'user'),
        content: typeof m.text === 'string' ? m.text : (m.content || ''),
        toolUse: false,
        toolResult: false
      }));
    }
  } catch { /* fall through */ }
  return parseMarkdownPaste(raw);
}

function parseMarkdownPaste(raw) {
  // Split on lines like "[user]" or "[assistant]" (case-insensitive).
  // Everything between two such markers is that role's content.
  const turns = [];
  const lines = raw.split(/\r?\n/);
  let currentRole = null;
  let currentBuf = [];
  const MARKER = /^\[(user|assistant|system|tool)\]\s*$/i;

  const flush = () => {
    if (currentRole) {
      turns.push({
        role: normalizeRole(currentRole),
        content: currentBuf.join('\n').trim(),
        toolUse: false,
        toolResult: false
      });
    }
  };

  for (const line of lines) {
    const m = line.match(MARKER);
    if (m) {
      flush();
      currentRole = m[1].toLowerCase();
      currentBuf = [];
    } else {
      currentBuf.push(line);
    }
  }
  flush();
  return turns.filter(t => t.content.length > 0);
}

function normalizeRole(role) {
  const r = String(role).toLowerCase();
  if (r === 'user' || r === 'human') return 'user';
  if (r === 'assistant' || r === 'ai' || r === 'claude') return 'assistant';
  if (r === 'system') return 'system';
  if (r === 'tool' || r === 'tool_result' || r === 'function') return 'tool';
  if (r === 'tool_use') return 'assistant';  // tool_use is still assistant emitting a tool call
  return 'user';
}

// ======================================================================
// Summary builder — the signal we pass to Claude
// ======================================================================

// Signals of verification discipline (earns the user points on that dimension).
// Detected via regex heuristics — imperfect but directionally useful.
const PUSHBACK_PATTERNS = [
  /\b(that'?s (?:wrong|incorrect|not right|not quite))\b/i,
  /\b(you'?re (?:wrong|mistaken|confused))\b/i,
  /\b(actually,?\s+(?:no|that's|it's))\b/i,
  /\b(i don'?t think (?:that'?s|you'?re|this is))\b/i,
  /\b(that (?:doesn'?t|won'?t) work|doesn'?t make sense)\b/i,
  /\b(wait,?\s+(?:that|no|let me))\b/i,
  /\b(hold on|hang on|let me (?:check|verify|test))\b/i,
  /\b(i (?:just )?(?:tested|ran|verified)\b.*\b(?:it|this|that) (?:does|doesn'?t|works|fails))\b/i,
  /\b(the test (?:fails|passes|doesn'?t)|that test|that assertion)\b/i,
  /\b(push(?:ing)? back\b|fact[-\s]check|let me sanity[-\s]check)\b/i
];

function buildSummary(format, turns, raw) {
  if (!Array.isArray(turns) || turns.length === 0) {
    return emptySummary(format);
  }

  let userTurns = 0, assistantTurns = 0, toolUses = 0, toolResults = 0;
  let userPushbackCount = 0;
  let firstUserMessage = '';
  const minimalTurns = [];

  for (const t of turns) {
    if (t.role === 'user') {
      userTurns++;
      if (!firstUserMessage && t.content) {
        firstUserMessage = t.content.substring(0, 400);
      }
      for (const pat of PUSHBACK_PATTERNS) {
        if (pat.test(t.content || '')) { userPushbackCount++; break; }
      }
    } else if (t.role === 'assistant') {
      assistantTurns++;
    }
    if (t.toolUse) toolUses++;
    if (t.toolResult) toolResults++;

    minimalTurns.push({
      role: t.role,
      preview: (t.content || '').substring(0, MAX_CONTENT_PREVIEW),
      hasCode: containsCodeBlock(t.content || ''),
      hasToolUse: !!t.toolUse
    });
  }

  return {
    format,
    turnCount: turns.length,
    userTurns,
    assistantTurns,
    toolUses,
    toolResults,
    userPushbackCount,
    approxTokens: Math.round(raw.length / 4),   // ~4 chars per token for English+code
    firstUserMessage,
    turns: minimalTurns
  };
}

function containsCodeBlock(s) {
  return /```/.test(s) || /^\s*(function|class|const|let|var|import|def|if|for)\b/m.test(s);
}

function emptySummary(format) {
  return {
    format,
    turnCount: 0,
    userTurns: 0,
    assistantTurns: 0,
    toolUses: 0,
    toolResults: 0,
    userPushbackCount: 0,
    approxTokens: 0,
    firstUserMessage: '',
    turns: []
  };
}

module.exports = { parseTranscript };
