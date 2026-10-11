import { useReducer } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { CozyButton } from '../components/CozyButton';
import { gameSettings } from '../config/gameSettings';
import { colors, common } from '../config/theme';
import { advanceCrochet, highlightedStitch } from '../games/crochetLogic';
import type { CrochetState, CrochetAction } from '../games/crochetLogic';

type Props = { onBack: () => void };
const { stitchGoal, stitchPositions } = gameSettings;

// The reducer uses our editable settings for every accepted tap.
function crochetReducer(state: CrochetState, action: CrochetAction) {
  return advanceCrochet(state, action, stitchGoal, stitchPositions);
}

export function CrochetScreen({ onBack }: Props) {
  // completedStitches tracks both progress and the next highlighted position.
  const [state, dispatch] = useReducer(crochetReducer, { completedStitches: 0 });
  const isComplete = state.completedStitches === stitchGoal;
  const activeIndex = highlightedStitch(state.completedStitches, stitchPositions);

  // Include the visible step so duplicate taps from this render are ignored.
  function tapStitch(index: number) {
    dispatch({ type: 'stitch', index, expectedStep: state.completedStitches });
  }

  return (
    <Screen>
      <Text style={common.title}>A little crochet</Text>
      <Text style={common.subtitle}>Tap the golden stitch to keep your yarn going.</Text>
      <View style={common.panel}>
        <Text style={common.message} accessibilityLiveRegion="polite">
          {state.completedStitches} / {stitchGoal} stitches
        </Text>
        <View style={styles.track} accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: stitchGoal, now: state.completedStitches }}>
          {/* Percentage width follows the stitch count, with no extra progress state. */}
          <View style={[styles.progress, { width: `${state.completedStitches / stitchGoal * 100}%` }]} />
        </View>
        <View style={styles.stitches}>
          {Array.from({ length: stitchPositions }, (_, index) => {
            const isActive = !isComplete && index === activeIndex;
            return (
              <Pressable key={index} onPress={() => tapStitch(index)} disabled={isComplete}
                accessibilityRole="button" accessibilityLabel={`Stitch ${index + 1}${isActive ? ', highlighted' : ''}`}
                accessibilityState={{ disabled: isComplete }}
                style={({ pressed }) => [styles.stitch, isActive && styles.active,
                  pressed && styles.pressed]}>
                <Text style={styles.loop}>{isActive ? '◎' : '○'}</Text>
                <Text style={styles.number}>{index + 1}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={common.message} accessibilityLiveRegion="polite">
          {isComplete ? 'Lovely work! Your little piece is finished. 🧶' : 'One gentle stitch at a time.'}
        </Text>
        {isComplete && <CozyButton label="Crochet again" onPress={() => dispatch({ type: 'reset' })} />}
      </View>
      <CozyButton label="Back to Room" onPress={onBack} secondary />
    </Screen>
  );
}

const styles = StyleSheet.create({
  track: { height: 12, borderRadius: 6, overflow: 'hidden', backgroundColor: colors.cream },
  progress: { height: '100%', backgroundColor: colors.sageDark },
  stitches: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  stitch: { flex: 1, minHeight: 66, backgroundColor: colors.cream, borderRadius: 14,
    borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.highlight, borderColor: colors.ink },
  pressed: { opacity: 0.6 }, loop: { fontSize: 28, color: colors.ink },
  number: { fontSize: 12, color: colors.ink },
});
