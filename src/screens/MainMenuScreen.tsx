import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { CozyButton } from '../components/CozyButton';
import { Artwork } from '../components/Artwork';
import { artwork } from '../config/artwork';
import { colors, common } from '../config/theme';

type Props = { onPlay: () => void };

export function MainMenuScreen({ onPlay }: Props) {
  return (
    <Screen>
      <View style={styles.illustration}>
        <Artwork item={artwork.menu} />
      </View>
      <Text style={common.title}>Cozy Room</Text>
      <Text style={common.subtitle}>A quiet little place to make something lovely.</Text>
      <CozyButton label="Play as Guest" onPress={onPlay} />
      <Text style={common.subtitle}>No account needed. Just a moment for you.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  illustration: { height: 190, padding: 24, backgroundColor: colors.peach, borderRadius: 80, alignItems: 'center' },
});
