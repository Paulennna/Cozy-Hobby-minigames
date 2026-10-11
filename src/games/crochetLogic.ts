// The stitch count is also the sequence step; no duplicated progress state.
export type CrochetState = { completedStitches: number };
export type CrochetAction =
  | { type: 'stitch'; index: number; expectedStep: number }
  | { type: 'reset' };

// A deterministic sequence moves the highlight around the row of stitches.
export function highlightedStitch(completedStitches: number, positions: number): number {
  return completedStitches % positions;
}

// Pure state transitions are easy to test without a phone or a rendered screen.
export function advanceCrochet(
  state: CrochetState, action: CrochetAction, goal: number, positions: number,
): CrochetState {
  if (action.type === 'reset') return { completedStitches: 0 };
  // Reject events from an older render, so rapid taps cannot skip a step.
  if (action.expectedStep !== state.completedStitches) return state;
  if (state.completedStitches >= goal) return state;
  // Tapping a stitch other than the highlighted one has no effect.
  if (action.index !== highlightedStitch(state.completedStitches, positions)) return state;
  return { completedStitches: state.completedStitches + 1 };
}
