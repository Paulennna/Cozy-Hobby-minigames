import { Image, StyleSheet, Text, View } from 'react-native';
import type { ArtworkItem } from '../config/artwork';
import { colors } from '../config/theme';

type Props = { item: ArtworkItem; resizeMode?: 'contain' | 'cover'; compact?: boolean };

// A supplied image and its placeholder occupy exactly the same parent bounds.
export function Artwork({ item, resizeMode = 'contain', compact = false }: Props) {
  if (item.image) {
    // Local require() values are passed straight to React Native's image source.
    return <Image source={item.image} resizeMode={resizeMode} style={styles.image}
      accessible={false} />;
  }
  return (
    <View style={styles.placeholder} accessible={false}>
      <Text style={[styles.emoji, compact && styles.smallEmoji]}>{item.emoji}</Text>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.note}>Placeholder art</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 6, gap: 3 },
  emoji: { fontSize: 44 }, smallEmoji: { fontSize: 30 },
  label: { fontSize: 12, color: colors.ink, textAlign: 'center', fontWeight: '600' },
  note: { fontSize: 10, color: colors.muted, textAlign: 'center' },
});
