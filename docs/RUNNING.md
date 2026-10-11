# Running on your Mac and iPhone

## Install and start

Install Node.js **24 LTS** (the cloud checks used Node 24.19.0). Open the repository in VS Code and open its terminal:

```sh
npm ci
npm start
```

Do not run `create-expo-app` again: this repository already contains the app. No application credentials, backend, or environment variables are needed.

## Current Expo Go compatibility

This project uses **Expo SDK 57**, React **19.2.3**, and React Native **0.86.3**, selected from Expo's official blank TypeScript template. Its native safe-area dependency uses Expo's bundled compatible version. Do not individually upgrade React or React Native.

Official guidance checked on **October 11, 2026**:

- [Create a project](https://docs.expo.dev/get-started/create-a-project/) supports a blank TypeScript template via `create-expo-app --template blank-typescript`.
- [Set up iPhone with Expo Go](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical&mode=expo-go) currently describes building Expo Go with `npx eas-cli@latest go`, using Apple Developer membership, and distributing it through TestFlight.
- [Start developing](https://docs.expo.dev/get-started/start-developing/) requires Expo CLI and Expo Go to use the **same Expo account** on a physical iPhone.

The documentation website and live Expo/App Store APIs were blocked in the cloud. The current instructions were read from Expo's [official documentation source](https://github.com/expo/expo/blob/main/docs/scenes/get-started/set-up-your-environment/instructions/iosPhysicalExpoGo.mdx); dependency versions were checked against the published official npm template. We could not inspect the Expo Go installed on your phone or verify an App Store client supports SDK 57. An old Expo Go client may reject this SDK. This game uses only Expo-supported components and no custom native game engine.

### If you have a compatible Expo Go on your iPhone

1. Connect the Mac and iPhone to the same Wi-Fi network.
2. Sign in on your Mac:
   ```sh
   npx expo login
   npm start
   ```
3. Open Expo Go and sign in with that **same** Expo account.
4. Scan the terminal QR code using the iPhone Camera, and open the Expo Go link.
5. Allow local-network access if iOS asks. You should see “Cozy Room” and “Play as Guest.”

These Expo tooling accounts are separate from the game, which needs no login.

If Wi-Fi blocks device access, try:

```sh
npx expo start --tunnel
```

Expo may ask to install its tunnel helper. This is optional and requires internet access; LAN is faster. Do not add a tunnel dependency unless you need it.

### If Expo Go is unavailable or reports an unsupported SDK

**Simplest alternative for learning on your Mac: use the iOS Simulator.** Install Xcode from the Mac App Store, launch it once, complete its setup, and install an iOS Simulator runtime in Xcode Settings → Components (or Platforms, depending on Xcode version). Then:

```sh
npx expo run:ios
```

This builds and installs this app directly instead of relying on a particular Expo Go release. The first run can take several minutes and generates `ios/` locally. Those generated native files are ignored by Git. You do not need paid Apple Developer membership for simulator testing. After installation, leave Metro running and reopen the app in Simulator. If the development server is stopped, use `npm start` to restart it; use `npx expo run:ios` again after changes to native configuration.

**To follow the current Expo Go iPhone route:** with Apple Developer membership and an Expo account, follow the official guide above:

```sh
npx eas-cli@latest go
```

Finish its signing/build prompts, install TestFlight, and add your Apple ID as an internal tester in App Store Connect. Then install your Expo Go build and follow the same-account QR steps. This route involves Apple accounts and distribution; it is not part of the game's implementation.

**To run this app directly on a connected iPhone instead:** enable Developer Mode on the phone, connect it to the Mac, trust the Mac, set up your Apple signing team in Xcode, and run:

```sh
npx expo run:ios --device
```

Device builds need valid signing/provisioning. If command-line signing fails, open the generated iOS workspace in Xcode and choose your team under Signing & Capabilities. A personal Apple team may allow local device testing with restrictions; paid membership is needed for TestFlight distribution. Simulator testing avoids that setup.

## Checks available here

```sh
npm run typecheck
npm test
npm run bundle:ios
npx expo install --check
```

The first three check TypeScript, game rules, and an iOS JavaScript bundle. Dependency checking can also consult online Expo services. If your network blocks those services, Expo can fall back to the SDK's bundled compatibility map:

```sh
EXPO_OFFLINE=1 npx expo install --check
```

Offline checks do not verify the installed Expo Go binary or the latest React Native Directory metadata. The cloud used offline Expo commands because its proxy blocked Expo APIs. Mac commands above do not require the cloud's temporary npm cache or telemetry settings.

Native simulator builds and real iPhone use still need to be tested on your Mac. Use [the checklist](TESTING.md). No cloud localhost preview link is needed.
