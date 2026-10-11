import { useEffect, useReducer } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { CozyButton } from '../components/CozyButton';
import { Artwork } from '../components/Artwork';
import { artwork } from '../config/artwork';
import { gameSettings } from '../config/gameSettings';
import { colors, common } from '../config/theme';
import { createDeck, matchingReducer, newMatchingState } from '../games/matchingLogic';

type Props = { onBack: () => void };

export function MatchingScreen({ onBack }: Props) {
  // State holds the deck, temporarily revealed cards, permanent matches, and round ID.
  // The initializer shuffles once when this screen mounts, rather than on every render.
  const [state, dispatch] = useReducer(matchingReducer, undefined, () => newMatchingState());
  const isComplete = state.matchedIds.length === state.cards.length;
  const isWaiting = state.revealedIds.length === 2;

  // Start a timer only for two unmatched cards; matched cards never enter this state.
  useEffect(() => {
    if (!isWaiting) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'hide', round: state.round });
    }, gameSettings.unmatchedCardDelayMs);
    // React runs cleanup on replay, dependency changes, and leaving the screen.
    return () => clearTimeout(timer);
  }, [isWaiting, state.round]);

  // A fresh shuffle and incremented round also invalidate any old timer callback.
  function replay() {
    dispatch({ type: 'reset', cards: createDeck() });
  }

  return (
    <Screen>
      <Text style={common.title}>Little things, paired</Text>
      <Text style={common.subtitle}>Find the three pairs. A soft moment for your memory.</Text>
      <Text style={common.message} accessibilityLiveRegion="polite">
        {state.matchedIds.length / 2} / 3 pairs found
      </Text>
      <View style={styles.board}>
        {state.cards.map((card, index) => {
          const isMatched = state.matchedIds.includes(card.id);
          const isVisible = isMatched || state.revealedIds.includes(card.id);
          const isDisabled = isWaiting || isVisible;
          return (
            <Pressable key={card.id} onPress={() => dispatch({ type: 'reveal', id: card.id })}
              disabled={isDisabled} accessibilityRole="button"
              accessibilityState={{ disabled: isDisabled }}
              accessibilityLabel={`Card ${index + 1}, ${isVisible ? artwork.cards[card.pair].label : 'face down'}${isMatched ? ', matched' : ''}`}
              style={({ pressed }) => [styles.card, isVisible && styles.faceUp,
                isMatched && styles.matched, pressed && styles.pressed]}>
              {isVisible ? <Artwork item={artwork.cards[card.pair]} compact /> : (
                <View style={styles.cardBack}>
                  <Text style={styles.star}>✿</Text><Text style={styles.backLabel}>Cozy</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
      <Text style={common.message} accessibilityLiveRegion="polite">
        {isComplete ? 'All together! You found every pair. 🌼' : isWaiting ? 'Take a little peek…' : 'Choose two cards.'}
      </Text>
      <CozyButton label={isComplete ? 'Play again' : 'Restart matching'} onPress={replay} />
      <CozyButton label="Back to Room" onPress={onBack} secondary />
    </Screen>
  );
}

const styles = StyleSheet.create({
  board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: { width: '30%', aspectRatio: 0.8, backgroundColor: colors.peach,
    borderRadius: 18, borderWidth: 2, borderColor: colors.border, overflow: 'hidden' },
  faceUp: { backgroundColor: colors.paper }, matched: { borderColor: colors.sageDark, borderWidth: 3 },
  pressed: { opacity: 0.65, transform: [{ scale: 0.96 }] },
  cardBack: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  star: { fontSize: 36, color: colors.ink }, backLabel: { fontSize: 12, color: colors.ink },
});
