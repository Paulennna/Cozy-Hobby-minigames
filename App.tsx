import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainMenuScreen } from './src/screens/MainMenuScreen';
import { RoomScreen } from './src/screens/RoomScreen';
import { CrochetScreen } from './src/screens/CrochetScreen';
import { MatchingScreen } from './src/screens/MatchingScreen';

type ScreenName = 'menu' | 'room' | 'crochet' | 'matching';

// Four screens need only one navigation state, rather than a routing dependency.
export default function App() {
  // screen tracks which screen is visible. Progress stays local to each mini-game.
  const [screen, setScreen] = useState<ScreenName>('menu');

  // Returning to the room unmounts the game, clearing state and timer effects.
  function returnToRoom() {
    setScreen('room');
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {screen === 'menu' && <MainMenuScreen onPlay={returnToRoom} />}
      {screen === 'room' && <RoomScreen onCrochet={() => setScreen('crochet')}
        onMatching={() => setScreen('matching')} />}
      {screen === 'crochet' && <CrochetScreen onBack={returnToRoom} />}
      {screen === 'matching' && <MatchingScreen onBack={returnToRoom} />}
    </SafeAreaProvider>
  );
}
