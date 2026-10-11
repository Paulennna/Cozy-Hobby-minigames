import { StyleSheet } from 'react-native';

// Edit this palette to recolor every screen in one place.
export const colors = {
  cream: '#FAF5EC', paper: '#FFFCF7', ink: '#4B403B', muted: '#75685E',
  sage: '#CCD8BE', sageDark: '#526B49', peach: '#F2D2BF', rose: '#E5B9AD',
  wall: '#F1E3D1', floor: '#DCC2A5', border: '#D3BEA6', highlight: '#F5D38A',
};

// These shared styles keep screen spacing and text consistent.
export const common = StyleSheet.create({
  title: { fontSize: 32, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  subtitle: { fontSize: 16, lineHeight: 24, color: colors.muted, textAlign: 'center' },
  message: { fontSize: 18, lineHeight: 26, color: colors.ink, textAlign: 'center' },
  panel: { padding: 16, borderRadius: 24, backgroundColor: colors.paper, gap: 16 },
});
