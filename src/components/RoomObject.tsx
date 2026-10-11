import { Pressable, StyleSheet } from 'react-native';
import type { ArtworkItem } from '../config/artwork';
import type { RoomObjectBounds } from '../config/roomLayout';
import { colors } from '../config/theme';
import { Artwork } from './Artwork';

type Props = { item: ArtworkItem; bounds: RoomObjectBounds; onPress: () => void };

// One rectangle controls both the object's picture and its touch target.
export function RoomObject({ item, bounds, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button"
      accessibilityLabel={item.label} accessibilityHint="Opens a hobby mini-game"
      style={({ pressed }) => [styles.object, {
        // Percentages scale with the room rather than the phone's screen pixels.
        left: `${bounds.left * 100}%`, top: `${bounds.top * 100}%`,
        width: `${bounds.width * 100}%`, height: `${bounds.height * 100}%`,
        // Transparent images keep their alpha; only placeholders get a panel.
        backgroundColor: item.image ? 'transparent' : colors.paper,
      }, pressed && styles.pressed]}>
      <Artwork item={item} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  object: { position: 'absolute', borderRadius: 18 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
});
