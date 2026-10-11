# Cozy-Hobby-minigames — Cozy Room

A small portrait iPhone prototype built with Expo SDK 57, React Native, and TypeScript. Play as Guest → tap the room's yarn basket or notebook → play crochet or matching → Back to Room. There is no app login, server, or saved progress. Leaving a game starts a fresh round next time.

## Run on your Mac in VS Code

Install **Node.js 24 LTS**. Open this repository folder in VS Code, then choose **Terminal → New Terminal**. If the terminal is outside the repository, first run `cd /path/to/Cozy-Hobby-minigames` (replace that path with yours).

```sh
npm ci
npm start
```

`npm ci` installs the exact versions in `package-lock.json`. Keep the terminal running; saving code triggers Fast Refresh. Stop the server with Control+C.

**iPhone / Expo Go:** read [Running on iPhone](docs/RUNNING.md) first. Current official SDK 57 guidance requires building Expo Go for iOS via TestFlight with Apple Developer membership, and signing into the same Expo account in CLI and Expo Go. An older App Store Expo Go is not guaranteed to support SDK 57. There is no login inside this game.

**Simplest alternative on a Mac:** install Xcode, open it once to finish setup, and install an iOS Simulator runtime. Then build directly for the simulator:

```sh
npx expo run:ios
```

This creates local `ios/` files and builds the app. Subsequent simulator sessions can use `npm start` and reopen the installed app. See [Running](docs/RUNNING.md) for device and network details.

## Check the project

```sh
npm run typecheck
npm test
npm run bundle:ios
```

Tests exercise game rules, completion, replay, rapid taps, stale timer events, and proportional room bounds. The iOS export checks that Metro can bundle the app; it does **not** build or launch native iOS code. Follow the [manual checklist](docs/TESTING.md) on your iPhone or simulator.

## Find and change things

- [File map and customization](docs/CUSTOMIZATION.md): colors, text, layout, and game settings.
- [Add My Artwork](docs/ADD_MY_ARTWORK.md): exact filenames and static image-loading examples.
- [Running on iPhone](docs/RUNNING.md): current Expo Go requirements and alternatives.
- [Manual testing checklist](docs/TESTING.md): navigation, replay, timers, and screen sizes.

The only runtime dependencies beyond the official blank template are `react-native-safe-area-context` for iPhone notch protection. Navigation is one state variable in `App.tsx`; game screens own their own progress. Assets are optional: the project runs with clearly labeled placeholders.
