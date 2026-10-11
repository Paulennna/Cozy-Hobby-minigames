import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Artwork } from '../components/Artwork';
import { RoomObject } from '../components/RoomObject';
import { artwork } from '../config/artwork';
import { roomLayout } from '../config/roomLayout';
import { colors, common } from '../config/theme';

type Props = { onCrochet: () => void; onMatching: () => void };

export function RoomScreen({ onCrochet, onMatching }: Props) {
  return (
    <Screen>
      <Text style={common.title}>Your cozy room</Text>
      <Text style={common.subtitle}>Tap the yarn to crochet, or the notebook to match.</Text>
      {/* The room keeps the same proportions at every phone width. */}
      <View style={[styles.room, { aspectRatio: roomLayout.aspectRatio }]}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {artwork.roomBackground.image ? <Artwork item={artwork.roomBackground} /> : (
            <>
              <View style={styles.floor} />
              <View style={styles.window}><Text style={styles.sun}>☀️</Text></View>
              <View style={styles.rug} />
              <View style={styles.backgroundLabel}><Artwork item={artwork.roomBackground} compact /></View>
            </>
          )}
        </View>
        {/* Objects are separate overlays, so changing art never changes navigation. */}
        <RoomObject item={artwork.yarnBasket} bounds={roomLayout.yarnBasket} onPress={onCrochet} />
        <RoomObject item={artwork.notebook} bounds={roomLayout.notebook} onPress={onMatching} />
      </View>
      <Text style={common.subtitle}>Take your time. There’s no rush here.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  room: { width: '100%', backgroundColor: colors.wall, borderRadius: 28,
    overflow: 'hidden', borderWidth: 2, borderColor: colors.border },
  floor: { position: 'absolute', top: '62%', bottom: 0, width: '100%', backgroundColor: colors.floor },
  window: { position: 'absolute', left: '12%', top: '10%', width: '30%', height: '23%',
    backgroundColor: colors.paper, borderWidth: 6, borderColor: colors.border,
    borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  sun: { fontSize: 34 },
  rug: { position: 'absolute', left: '20%', top: '79%', width: '65%', height: '14%',
    borderRadius: 80, backgroundColor: colors.rose },
  backgroundLabel: { position: 'absolute', right: '6%', top: '7%', width: '46%', height: '26%' },
});
