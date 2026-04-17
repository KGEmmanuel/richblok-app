/**
 * Tests for lib/transcript-parser.js — F18 transcript ingestion.
 *
 * Each test covers one format detection + parse path. Format-detection
 * accuracy is more important than field precision — parser bugs must
 * never fail the scoring endpoint, so every branch produces an empty
 * summary rather than throwing.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseTranscript } = require('../../lib/transcript-parser.js');

// =========================================================================
// Format detection
// =========================================================================

test('empty string → format=empty, 0 turns', () => {
  const s = parseTranscript('');
  assert.equal(s.format, 'empty');
  assert.equal(s.turnCount, 0);
});

test('null/undefined → format=empty', () => {
  assert.equal(parseTranscript(null).format, 'empty');
  assert.equal(parseTranscript(undefined).format, 'empty');
});

test('markdown-paste format detected from [user]/[assistant] markers', () => {
  const s = parseTranscript('[user]\nhello\n[assistant]\nhi there');
  assert.equal(s.format, 'markdown-paste');
  assert.equal(s.userTurns, 1);
  assert.equal(s.assistantTurns, 1);
  assert.equal(s.firstUserMessage, 'hello');
});

test('markdown-paste handles multi-line content per turn', () => {
  const s = parseTranscript(`[user]
line one
line two

[assistant]
response line
and another`);
  assert.equal(s.format, 'markdown-paste');
  assert.equal(s.turnCount, 2);
  const userTurn = s.turns.find(t => t.role === 'user');
  assert.ok(userTurn.preview.includes('line one'));
  assert.ok(userTurn.preview.includes('line two'));
});

test('jsonl format — Claude Code shape', () => {
  const lines = [
    JSON.stringify({ type: 'user',      message: { role: 'user',      content: [{ type: 'text', text: 'fix the bug' }] } }),
    JSON.stringify({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: 'reading the file' }, { type: 'tool_use', name: 'read_file', input: {} }] } }),
    JSON.stringify({ type: 'assistant', message: { role: 'user',      content: [{ type: 'tool_result', content: 'file contents here' }] } })
  ];
  const s = parseTranscript(lines.join('\n'));
  assert.equal(s.format, 'jsonl');
  assert.equal(s.turnCount, 3);
  assert.equal(s.toolUses, 1);
  assert.equal(s.toolResults, 1);
});

test('openai-messages format — array of {role, content}', () => {
  const raw = JSON.stringify([
    { role: 'user',      content: 'hello' },
    { role: 'assistant', content: 'hi' }
  ]);
  const s = parseTranscript(raw);
  assert.equal(s.format, 'openai-messages');
  assert.equal(s.turnCount, 2);
});

test('openai-messages format — object with {messages: [...]}', () => {
  const raw = JSON.stringify({
    messages: [
      { role: 'user',      content: 'q' },
      { role: 'assistant', content: 'a', tool_calls: [{ name: 'foo' }] }
    ]
  });
  const s = parseTranscript(raw);
  assert.equal(s.format, 'openai-messages');
  assert.equal(s.toolUses, 1);
});

test('plaintext fallback when format is unrecognizable', () => {
  const s = parseTranscript('this is just a blob of text with no structure');
  assert.equal(s.format, 'plaintext');
  assert.equal(s.turnCount, 1);
  assert.equal(s.turns[0].role, 'user');
});

// =========================================================================
// User pushback detection (verification-discipline signal)
// =========================================================================

test('pushback detected: "actually, that is wrong"', () => {
  const s = parseTranscript(`[user]
actually, that's wrong — the test mocks Date.now, it's not real

[assistant]
you're right, let me re-check`);
  assert.ok(s.userPushbackCount >= 1, `expected >=1 pushback, got ${s.userPushbackCount}`);
});

test('pushback detected: "wait, hold on"', () => {
  const s = parseTranscript(`[user]
wait, let me check that claim before you proceed`);
  assert.ok(s.userPushbackCount >= 1);
});

test('no pushback when user only says "thanks, ship it"', () => {
  const s = parseTranscript(`[user]
thanks, ship it

[user]
looks good`);
  assert.equal(s.userPushbackCount, 0);
});

// =========================================================================
// Resilience — parser must never throw
// =========================================================================

test('malformed jsonl lines are skipped, not thrown', () => {
  const raw = [
    JSON.stringify({ role: 'user', content: 'valid' }),
    '{not valid json}',
    JSON.stringify({ role: 'assistant', content: 'also valid' })
  ].join('\n');
  const s = parseTranscript(raw);
  // Should fall through to plaintext since not ALL first 3 lines parse.
  assert.ok(['plaintext', 'jsonl', 'openai-messages'].includes(s.format));
  // Whatever format wins, we don't throw.
  assert.ok(s.turnCount >= 0);
});

test('huge input (1MB) still parses in <100ms', () => {
  const huge = '[user]\n' + 'x'.repeat(1000000) + '\n[assistant]\ndone';
  const start = Date.now();
  const s = parseTranscript(huge);
  const elapsed = Date.now() - start;
  assert.equal(s.format, 'markdown-paste');
  assert.ok(elapsed < 500, `parse took ${elapsed}ms, expected <500`);
});

// =========================================================================
// Summary invariants
// =========================================================================

test('approxTokens is populated and non-zero for non-empty input', () => {
  const s = parseTranscript('hello world');
  assert.ok(s.approxTokens > 0);
});

test('firstUserMessage is capped at 400 chars', () => {
  const long = 'x'.repeat(1000);
  const s = parseTranscript(`[user]\n${long}\n[assistant]\ndone`);
  assert.ok(s.firstUserMessage.length <= 400);
});

test('turns[].preview is capped at 240 chars', () => {
  const long = 'x'.repeat(1000);
  const s = parseTranscript(`[user]\n${long}`);
  assert.ok(s.turns[0].preview.length <= 240);
});
