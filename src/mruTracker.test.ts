import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MruTracker } from './mruTracker';

test('recordActivation moves an id to the front', () => {
  const t = new MruTracker();
  t.recordActivation('a');
  t.recordActivation('b');
  assert.deepEqual(t.getOrdered(), ['b', 'a']);
});

test('recordActivation on an existing id dedupes instead of duplicating', () => {
  const t = new MruTracker();
  t.recordActivation('a');
  t.recordActivation('b');
  t.recordActivation('a');
  assert.deepEqual(t.getOrdered(), ['a', 'b']);
});

test('remove drops an id and is a no-op if absent', () => {
  const t = new MruTracker();
  t.recordActivation('a');
  t.remove('a');
  t.remove('does-not-exist');
  assert.deepEqual(t.getOrdered(), []);
});

test('getOrdered(excluding) filters out the current buffer', () => {
  const t = new MruTracker();
  t.recordActivation('a');
  t.recordActivation('b');
  assert.deepEqual(t.getOrdered('b'), ['a']);
});

test('seed appends unseen ids without disturbing known order or duplicating', () => {
  const t = new MruTracker();
  t.recordActivation('a');
  t.seed(['a', 'b', 'c']);
  assert.deepEqual(t.getOrdered(), ['a', 'b', 'c']);
});
