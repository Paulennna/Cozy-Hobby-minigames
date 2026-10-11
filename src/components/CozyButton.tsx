import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../config/theme';

type Props = { label: string; onPress: () => void; secondary?: boolean };

// Pressable exposes pressed so we can give feedback without an animation library.
export function CozyButton({ label, onPress, secondary = false }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary,
        pressed && styles.pressed]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.sage, padding: 16, minHeight: 48,
    borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: colors.peach },
  pressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  label: { fontSize: 17, fontWeight: '600', color: colors.ink },
});
