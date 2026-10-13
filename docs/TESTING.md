# Manual play-test checklist

Run these checks on an iPhone or iOS Simulator. Automated tests cannot verify native touch handling, artwork appearance, or VoiceOver.

## Navigation

- [ ] Fresh launch shows Cozy Room and Play as Guest.
- [ ] Play as Guest opens the room without a login prompt.
- [ ] Tapping yarn opens crochet; tapping the notebook opens matching.
- [ ] Pressed room objects and buttons give visible feedback.
- [ ] Back to Room works from both unfinished and completed games.
- [ ] Returning to a game starts a fresh round.

## Crochet

- [ ] Only the golden stitch advances progress; other taps do nothing.
- [ ] Highlight moves after every accepted tap; progress goes from 0 to 10.
- [ ] Rapid repeated taps cannot count a stale highlighted step twice.
- [ ] Exactly ten accepted stitches show completion and Crochet again.
- [ ] Completed stitch buttons no longer change progress.
- [ ] Crochet again resets to 0 and highlights the first stitch.

## Matching and timers

- [ ] Six face-down cards contain exactly three pairs.
- [ ] First tap reveals one card; tapping it again does not count as a pair.
- [ ] A matching second card keeps both visible and increments pairs found.
- [ ] Two different cards remain visible for roughly 900 ms, then both hide.
- [ ] Tap a third card rapidly during that delay: it must remain face down.
- [ ] Matched cards stay visible through subsequent wrong guesses.
- [ ] Three pairs show completion and Play again.
- [ ] Restart matching / Play again clears all cards and progress and reshuffles. A shuffle can occasionally produce the same order.
- [ ] Restart during a mismatch delay, immediately reveal a new card, and wait: the old timer must not hide the new card.
- [ ] Go Back to Room during a mismatch delay and reopen matching: no old timer should affect the new round or log a warning.

## Layout and artwork

- [ ] Try a small iPhone (320–375-point width) and a large one (430-point width).
- [ ] The notch and home indicator do not cover content.
- [ ] Short screens can scroll to all controls and Back to Room.
- [ ] Larger system text remains readable; scroll when necessary.
- [ ] Room proportions remain fixed; taps stay aligned with both objects.
- [ ] Portrait stays portrait when the phone rotates.
- [ ] Replace one placeholder with a PNG; other placeholders still work.
- [ ] Transparent objects show the room behind them and stay tappable.
- [ ] Test VoiceOver: hidden cards should not reveal their pair names; visible cards announce their names; room objects announce their hobby object labels.

## Automated checks

- `npm run typecheck`: strict TypeScript, including tests.
- `npm test`: 13 tests covering crochet rules/completion/replay, deck contents/shuffle, matching rules, rapid taps, stale hide events after replay, room bounds at four widths, and the iOS scene-lifecycle migration.
- `npm run bundle:ios`: production JavaScript export for iOS, including asset resolution.

The tests exercise pure game transitions. Timer timing/cleanup, rendered screen navigation, actual press feedback, and native display are manual checks, not claims made by the reducer tests.

- [ ] After applying the scene-lifecycle fix and rebuilding, the Simulator launches Cozy Room without a `NoSceneLifecycleAdoption` crash.
