import type { ImageSourcePropType } from 'react-native';

export type CardPair = 'flower' | 'tea' | 'yarn';
export type ArtworkItem = {
  image: ImageSourcePropType | null;
  emoji: string;
  label: string;
};

// Each image starts as null, so Artwork displays a labeled placeholder.
// Use literal require paths: Metro must know each filename while bundling.
// After adding assets/art/room/room-background.png, replace image: null with:
// image: require('../../assets/art/room/room-background.png'),
export const artwork: {
  menu: ArtworkItem;
  roomBackground: ArtworkItem;
  yarnBasket: ArtworkItem;
  notebook: ArtworkItem;
  cards: Record<CardPair, ArtworkItem>;
} = {
  menu: { image: null, emoji: '🏡', label: 'Cozy house' },
  roomBackground: { image: null, emoji: '🪴', label: 'Room background' },
  // Example: image: require('../../assets/art/objects/yarn-basket.png'),
  yarnBasket: { image: null, emoji: '🧶', label: 'Yarn basket' },
  // Example: image: require('../../assets/art/objects/notebook.png'),
  notebook: { image: null, emoji: '📓', label: 'Desk / notebook' },
  cards: {
    // Example: image: require('../../assets/art/cards/flower.png'),
    flower: { image: null, emoji: '🌼', label: 'Flower' },
    tea: { image: null, emoji: '🍵', label: 'Tea' },
    yarn: { image: null, emoji: '🧶', label: 'Yarn' },
  },
};
