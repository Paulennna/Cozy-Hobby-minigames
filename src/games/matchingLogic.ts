import type { CardPair } from '../config/artwork';

export type Card = { id: number; pair: CardPair };
export type MatchingState = {
  cards: Card[]; // The shuffled deck for this round.
  revealedIds: number[]; // Unmatched cards currently face up (at most two).
  matchedIds: number[]; // Cards already paired; these stay face up.
  round: number; // Identifies the round, so an old timer cannot affect a replay.
};
export type MatchingAction =
  | { type: 'reveal'; id: number }
  | { type: 'hide'; round: number }
  | { type: 'reset'; cards: Card[] };

// Fisher–Yates swaps each card with a random earlier card without mutating input.
export function createDeck(random: () => number = Math.random): Card[] {
  const pairs: CardPair[] = ['flower', 'tea', 'yarn'];
  const cards = pairs.flatMap((pair, pairIndex) => [
    { id: pairIndex * 2, pair }, { id: pairIndex * 2 + 1, pair },
  ]);
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }
  return cards;
}

// Build a clean round with no temporary reveals or permanent matches.
export function newMatchingState(cards: Card[] = createDeck()): MatchingState {
  return { cards, revealedIds: [], matchedIds: [], round: 0 };
}

// Reducer events are processed in order, even when many taps arrive together.
export function matchingReducer(state: MatchingState, action: MatchingAction): MatchingState {
  if (action.type === 'reset') {
    return { ...newMatchingState(action.cards), round: state.round + 1 };
  }
  if (action.type === 'hide') {
    // Ignore delayed callbacks from a round that has already been restarted.
    if (action.round !== state.round) return state;
    return { ...state, revealedIds: [] };
  }
  // Lock the board during a mismatch, and ignore visible or invalid cards.
  if (state.revealedIds.length === 2 || state.revealedIds.includes(action.id)
    || state.matchedIds.includes(action.id)) return state;
  const card = state.cards.find(candidate => candidate.id === action.id);
  if (!card) return state;
  const firstCard = state.cards.find(candidate => candidate.id === state.revealedIds[0]);
  if (firstCard?.pair === card.pair) {
    // A match moves both IDs to the permanent set and frees the next turn.
    return { ...state, revealedIds: [], matchedIds: [...state.matchedIds, firstCard.id, card.id] };
  }
  // The first tap reveals one card; a nonmatching second tap reveals two.
  return { ...state, revealedIds: [...state.revealedIds, card.id] };
}
