import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const { migrateAppDelegate, configureSceneManifest } = require('../plugins/withIosSceneLifecycle');
const template = readFileSync(new URL('./fixtures/AppDelegate.sdk57.swift', import.meta.url), 'utf8');

test('migrates the actual SDK 57 template to scene-owned startup', () => {
  const result = migrateAppDelegate(template);
  assert.ok(result.includes('class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {'));
  assert.ok(result.includes('reactNativeFactory = factory'));
  assert.ok(result.includes('var window: UIWindow?'));
  assert.ok(!result.includes('window = UIWindow(frame:'));
  assert.ok(!result.includes('factory.startReactNative('));
  assert.ok(result.includes('override func bundleURL()'));
  assert.equal(migrateAppDelegate(result), result);
});

test('registers the built-in Expo scene delegate without losing plist settings', () => {
  const initial = { CFBundleDisplayName: 'Cozy Room', UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'] };
  const result = configureSceneManifest(initial);
  assert.equal(result.CFBundleDisplayName, initial.CFBundleDisplayName);
  assert.deepEqual(result.UISupportedInterfaceOrientations, initial.UISupportedInterfaceOrientations);
  assert.equal(result.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes, false);
  assert.equal(result.UIApplicationSceneManifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0].UISceneDelegateClassName, 'EXExpoAppSceneDelegate');
  assert.equal(configureSceneManifest(result), result);
  assert.equal(initial.hasOwnProperty('UIApplicationSceneManifest'), false);
});

test('preserves native templates already using a custom scene delegate', () => {
  const initial = { UIApplicationSceneManifest: { UISceneConfigurations: {
    UIWindowSceneSessionRoleApplication: [{ UISceneDelegateClassName: 'CozyRoom.SceneDelegate' }],
  } } };
  assert.equal(configureSceneManifest(initial), initial);
});

test('fails clearly on unsupported native templates rather than guessing', () => {
  assert.throws(() => migrateAppDelegate('class AppDelegate: NSObject {}'), /expected an Expo Swift/);
  assert.throws(() => migrateAppDelegate('class AppDelegate: ExpoAppDelegate { factory.startReactNative() }'), /unfamiliar window startup/);
  assert.throws(() => configureSceneManifest({ UIApplicationSceneManifest: {} }), /without a scene delegate/);
});
