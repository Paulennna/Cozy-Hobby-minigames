# Add My Artwork

All app artwork image references live in **`src/config/artwork.ts`**. `Artwork.tsx` shows the labeled emoji placeholder when `image` is `null`, and a React Native `Image` when you supply a source. Game rules and navigation do not need editing.

## 1. Export from Procreate

Use PNG files, with these exact lowercase filenames:

```text
assets/art/
  room/room-background.png
  objects/yarn-basket.png
  objects/notebook.png
  cards/flower.png
  cards/tea.png
  cards/yarn.png
```

- **Room:** start with a 1200 × 1600 canvas (3:4). Export the wall, floor, and decorations as one background; leave the interactive yarn basket and notebook out of it. The room container uses the same aspect ratio. No transparent background is necessary for this image.
- **Objects:** export each object separately as a transparent PNG, tightly cropped around the drawing. Transparent padding still belongs to the image rectangle and therefore the touch target, so trim excessive padding. Do not export a full-room-sized object layer.
- **Cards:** export one image for each pair, ideally on equally sized canvases. Both flower cards use `flower.png`; both tea cards use `tea.png`; both yarn cards use `yarn.png`. Transparent PNGs are supported here too.

You can add one image at a time. Missing images remain placeholders.

## 2. Connect the files

In `src/config/artwork.ts`, replace the relevant `image: null` values. For example, after you have added all six files:

```tsx
roomBackground: {
  image: require('../../assets/art/room/room-background.png'),
  emoji: '🪴',
  label: 'Room background',
},
yarnBasket: {
  image: require('../../assets/art/objects/yarn-basket.png'),
  emoji: '🧶',
  label: 'Yarn basket',
},
notebook: {
  image: require('../../assets/art/objects/notebook.png'),
  emoji: '📓',
  label: 'Desk / notebook',
},
cards: {
  flower: {
    image: require('../../assets/art/cards/flower.png'),
    emoji: '🌼', label: 'Flower',
  },
  tea: {
    image: require('../../assets/art/cards/tea.png'),
    emoji: '🍵', label: 'Tea',
  },
  yarn: {
    image: require('../../assets/art/cards/yarn.png'),
    emoji: '🧶', label: 'Yarn',
  },
},
```

These entries replace the matching entries **inside** the existing `artwork` object; do not paste a second object. The configuration also contains commented examples beside the placeholder entries.

Metro needs literal, static paths such as `require('../../assets/art/cards/tea.png')` at build time. Do not use `require(variable)` or construct paths with strings. Only uncomment a `require` after the file exists; an absent file will stop bundling even if its screen has not been opened. Filename case matters. Set `image` back to `null` to restore a placeholder.

## 3. Place the objects

Edit only `src/config/roomLayout.ts`:

```ts
export const roomLayout = {
  aspectRatio: 3 / 4,
  yarnBasket: { left: 0.08, top: 0.57, width: 0.35, height: 0.25 },
  notebook: { left: 0.55, top: 0.37, width: 0.36, height: 0.25 },
};
```

`left: 0.08` means 8% across the room; `top: 0.57` means 57% down. Width and height are also fractions of the room. Increase them to enlarge the object and its tappable rectangle together. Keep `left + width` and `top + height` at or below 1. Avoid overlapping rectangles and keep each target at least 44 points wide and high on your smallest phone.

The background and overlays share one fixed-ratio room container. That container grows or shrinks with screen width. The `RoomObject` Pressable occupies the same rectangle as its artwork, so the touch area follows the image on different phones. Images use `contain` to preserve their proportions; if the bounding box ratio differs from the PNG's ratio, it leaves empty space around the image. Match those ratios for a tighter fit.

If your background is a different ratio, change `aspectRatio` to its **pixel width / pixel height**, then adjust the object rectangles. Use a consistent background ratio rather than cropping differently on each phone.

## 4. Verify

Save the configuration while Metro is running. If a new file does not appear, restart with `npx expo start --clear`.

```sh
npm run typecheck
npm run bundle:ios
```

Then check the art and taps on a small and large iPhone or simulator. Labels in the configuration remain useful for VoiceOver even when the placeholder text disappears. Emoji and the room's geometric decoration are temporary visual placeholders, not final illustrations. The menu house is also a placeholder and is controlled by `artwork.menu`.
