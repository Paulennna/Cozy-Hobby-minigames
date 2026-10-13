// SDK 57 supplies a scene delegate, but its published native template still uses
// the old app-delegate window setup. New iOS runtimes reject that setup at launch.
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

// Apply Expo's scene-lifecycle migration to the generated Swift AppDelegate.
// Keep this in a config plugin so regenerating ios/ keeps the fix.
function migrateAppDelegate(source) {
  const classDeclaration = /class AppDelegate: ExpoAppDelegate([^\n{]*)\{/;
  if (!classDeclaration.test(source)) {
    throw new Error('Scene lifecycle fix expected an Expo Swift AppDelegate.');
  }
  let result = source.replace(classDeclaration, (declaration, protocols) => {
    if (protocols.includes('ExpoReactNativeFactoryProvider')) return declaration;
    return `class AppDelegate: ExpoAppDelegate${protocols.trimEnd()}, ExpoReactNativeFactoryProvider {`;
  });

  // The built-in ExpoAppSceneDelegate creates the window and starts React Native.
  // Remove the template's old startup block to avoid starting the app twice.
  const legacyStartup = /#if os\(iOS\) \|\| os\(tvOS\)\s+window = UIWindow\(frame: UIScreen\.main\.bounds\)\s+factory\.startReactNative\(\s+withModuleName: "main",\s+in: window,\s+launchOptions: launchOptions\)\s*#endif/;
  result = result.replace(legacyStartup,
    '// ExpoAppSceneDelegate creates the window and starts React Native.');
  // Fail clearly if an unfamiliar template still starts React Native itself.
  if (result.includes('factory.startReactNative(')) {
    throw new Error('Scene lifecycle fix found an unfamiliar window startup block.');
  }
  return result;
}

function configureSceneManifest(infoPlist) {
  const existing = infoPlist.UIApplicationSceneManifest;
  if (existing) {
    // Preserve native templates that already declare their own scene delegate.
    const scenes = existing.UISceneConfigurations?.UIWindowSceneSessionRoleApplication;
    if (!Array.isArray(scenes) || !scenes.some(scene => scene.UISceneDelegateClassName)) {
      throw new Error('Scene lifecycle fix found a scene manifest without a scene delegate.');
    }
    return infoPlist;
  }
  return {
    ...infoPlist,
    UIApplicationSceneManifest: {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [{
          UISceneConfigurationName: 'Default Configuration',
          // This is the Objective-C name of Expo's existing native scene delegate.
          UISceneDelegateClassName: 'EXExpoAppSceneDelegate',
        }],
      },
    },
  };
}

function withIosSceneLifecycle(config) {
  config = withInfoPlist(config, mod => {
    mod.modResults = configureSceneManifest(mod.modResults);
    return mod;
  });
  return withAppDelegate(config, mod => {
    if (mod.modResults.language !== 'swift') {
      throw new Error('Scene lifecycle fix requires the SDK 57 Swift template.');
    }
    mod.modResults.contents = migrateAppDelegate(mod.modResults.contents);
    return mod;
  });
}

module.exports = withIosSceneLifecycle;
// Export the pure transformations so tests can check real template input.
module.exports.migrateAppDelegate = migrateAppDelegate;
module.exports.configureSceneManifest = configureSceneManifest;
