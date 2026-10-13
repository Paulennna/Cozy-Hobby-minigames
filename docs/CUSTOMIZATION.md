# File map and customization

## Important files

| File | What it controls |
| --- | --- |
| `App.tsx` | Switches between menu, room, crochet, and matching using one `screen` state variable. Unmounting a game clears its local state. |
| `plugins/withIosSceneLifecycle.js` | Native iOS startup compatibility fix, applied automatically by Expo prebuild. Leave this alone when customizing game art. |
| `index.ts` | Expo entry point; registers `App`. Usually leave it alone. |
| `app.json` | App name, portrait orientation, light appearance, and iOS app identifier. |
| `src/config/theme.ts` | Shared colors, text styles, and panel styling. |
| `src/config/artwork.ts` | All optional local image references and placeholder labels. |
| `src/config/roomLayout.ts` | Room aspect ratio and each object's position and size. |
| `src/config/gameSettings.ts` | Stitch goal, number of stitch positions, and mismatch delay. |
| `src/components/Artwork.tsx` | Reusable image-or-placeholder renderer. |
| `src/components/RoomObject.tsx` | Image and aligned touch target with press feedback. |
| `src/components/CozyButton.tsx` | Shared button styling and press feedback. |
| `src/components/Screen.tsx` | Safe areas, centered content, and scrolling on short screens. |
| `src/screens/MainMenuScreen.tsx` | Working title and Play as Guest button. |
| `src/screens/RoomScreen.tsx` | Placeholder room decoration and hobby object connections. |
| `src/screens/CrochetScreen.tsx` | Stitch buttons, progress, completion, and replay. |
| `src/screens/MatchingScreen.tsx` | Six cards, mismatch timer, completion, and replay. |
| `src/games/crochetLogic.ts` | Which stitch is highlighted and which taps count. |
| `src/games/matchingLogic.ts` | Deck shuffle and matching rules; guards rapid taps and old timer events. |
| `assets/art/` | Your room, object, and card PNGs. Empty until you add drawings. |
| `tests/gameLogic.test.ts` | Repeatable tests for both games and room bounds. |
| `package.json` / `package-lock.json` | Commands and compatible, locked dependencies. |

## Small changes to try

**Colors:** change the hex values in `src/config/theme.ts`. For example, `sage` changes button fills and `cream` changes screen backgrounds. `highlight` changes the active crochet stitch. Keep text readable against backgrounds.

**Text:** change the text inside the appropriate screen file. The menu's “Cozy Room” title is in `MainMenuScreen.tsx`; the home-screen app display name is `app.json` → `expo.name`. Placeholder and accessibility object labels are in `artwork.ts`.

**Object placement:** edit `left`, `top`, `width`, and `height` in `roomLayout.ts`. These fractions are relative to the background, never absolute phone pixels. See [Add My Artwork](ADD_MY_ARTWORK.md).

**Game pace:** edit `gameSettings.ts`:

```ts
export const gameSettings = {
  stitchGoal: 10,                // Positive whole number of taps needed to finish.
  stitchPositions: 5,           // Highlight loops through these stitch buttons.
  unmatchedCardDelayMs: 900,     // How long two wrong cards remain visible.
};
```

For this first version, keep five stitch positions so the buttons fit comfortably. The matching board stays at six cards and three pairs. Restart the app after changing settings to begin a fresh round; Fast Refresh can preserve earlier state.

## How the state works

- `App.screen` records the active screen. Callback props such as `onBack` ask App to change that value.
- Crochet's `completedStitches` records accepted taps. The next highlight is `completedStitches % stitchPositions`. A tap carries the step seen on screen; the reducer rejects duplicate taps from an old render. No penalty or timer is used.
- Matching's `cards` records the shuffled deck. `revealedIds` holds up to two unmatched face-up cards; `matchedIds` holds all permanent matches. Comparing pair names decides whether the second card matches.
- Matching's `round` increases on replay. Delayed hide events from older rounds are ignored. The timer effect starts only when two unmatched cards are visible and clears its timeout on replay or unmount. While waiting, the board ignores more taps.

These rules are separate from artwork, so replacing PNGs never changes the games. This prototype intentionally does not save progress when you exit or restart the app.
