import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advanceCrochet, highlightedStitch } from '../src/games/crochetLogic';
import { createDeck, matchingReducer, newMatchingState } from '../src/games/matchingLogic';
import { gameSettings } from '../src/config/gameSettings';
import { roomLayout } from '../src/config/roomLayout';

// A fixed random source makes the shuffle repeatable for assertions.
const deck = createDeck(() => 0.5);

function reveal(state: ReturnType<typeof newMatchingState>, id: number) {
  return matchingReducer(state, { type: 'reveal', id });
}

test('crochet ignores the wrong stitch and duplicate rapid taps', () => {
  const initial = { completedStitches: 0 };
  assert.equal(advanceCrochet(initial, { type: 'stitch', index: 1, expectedStep: 0 }, 10, 5), initial);
  const action = { type: 'stitch' as const, index: 0, expectedStep: 0 };
  const next = advanceCrochet(initial, action, 10, 5);
  assert.equal(next.completedStitches, 1);
  assert.equal(advanceCrochet(next, action, 10, 5), next);
});

test('crochet completes exactly ten stitches and replays from zero', () => {
  let state = { completedStitches: 0 };
  for (let step = 0; step < gameSettings.stitchGoal; step += 1) {
    state = advanceCrochet(state, {
      type: 'stitch', index: highlightedStitch(step, gameSettings.stitchPositions), expectedStep: step,
    }, gameSettings.stitchGoal, gameSettings.stitchPositions);
    assert.equal(state.completedStitches, step + 1);
  }
  assert.equal(advanceCrochet(state, { type: 'stitch', index: 0, expectedStep: 10 }, 10, 5), state);
  assert.deepEqual(advanceCrochet(state, { type: 'reset' }, 10, 5), { completedStitches: 0 });
});

test('shuffle preserves six unique cards and three pairs', () => {
  for (let seed = 0; seed < 20; seed += 1) {
    const shuffled = createDeck(() => seed / 20);
    assert.equal(new Set(shuffled.map(card => card.id)).size, 6);
    for (const pair of ['flower', 'tea', 'yarn']) {
      assert.equal(shuffled.filter(card => card.pair === pair).length, 2);
    }
  }
  assert.notDeepEqual(createDeck(() => 0), createDeck(() => 0.99));
});

test('matching ignores a second tap on the same card and invalid IDs', () => {
  const state = reveal(newMatchingState(deck), 0);
  assert.equal(reveal(state, 0), state);
  assert.equal(reveal(state, 99), state);
  assert.deepEqual(state.revealedIds, [0]);
});

test('a mismatch locks out rapid third taps until hidden', () => {
  const state = reveal(reveal(newMatchingState(deck), 0), 2);
  assert.deepEqual(state.revealedIds, [0, 2]);
  assert.equal(reveal(state, 4), state);
  const hidden = matchingReducer(state, { type: 'hide', round: state.round });
  assert.deepEqual(hidden.revealedIds, []);
  assert.deepEqual(reveal(hidden, 4).revealedIds, [4]);
});

test('matches stay visible through later mismatches', () => {
  const matched = reveal(reveal(newMatchingState(deck), 0), 1);
  assert.deepEqual(matched.matchedIds, [0, 1]);
  assert.deepEqual(matched.revealedIds, []);
  assert.equal(reveal(matched, 0), matched);
  const mismatch = reveal(reveal(matched, 2), 4);
  const hidden = matchingReducer(mismatch, { type: 'hide', round: 0 });
  assert.deepEqual(hidden.matchedIds, [0, 1]);
});

test('all three pairs complete the game', () => {
  let state = newMatchingState(deck);
  for (const id of [0, 1, 2, 3, 4, 5]) state = reveal(state, id);
  assert.equal(state.matchedIds.length, 6);
  assert.deepEqual(state.revealedIds, []);
});

test('replay clears progress and rejects a timer from the previous round', () => {
  const waiting = reveal(reveal(newMatchingState(deck), 0), 2);
  const restarted = matchingReducer(waiting, { type: 'reset', cards: createDeck(() => 0) });
  assert.equal(restarted.round, 1);
  assert.deepEqual(restarted.matchedIds, []);
  assert.deepEqual(restarted.revealedIds, []);
  const freshTap = reveal(restarted, 4);
  assert.equal(matchingReducer(freshTap, { type: 'hide', round: waiting.round }), freshTap);
});

test('room targets stay inside the artwork at common phone widths', () => {
  for (const phoneWidth of [320, 375, 390, 430]) {
    const roomWidth = phoneWidth - 40;
    const roomHeight = roomWidth / roomLayout.aspectRatio;
    for (const bounds of [roomLayout.yarnBasket, roomLayout.notebook]) {
      assert.ok(bounds.left >= 0 && bounds.top >= 0);
      assert.ok((bounds.left + bounds.width) * roomWidth <= roomWidth);
      assert.ok((bounds.top + bounds.height) * roomHeight <= roomHeight);
      assert.ok(bounds.width * roomWidth >= 44 && bounds.height * roomHeight >= 44);
    }
  }
});
