// Match this aspect ratio to the background exported from Procreate.
// Coordinates are fractions of the room: 0 is left/top; 1 is right/bottom.
// Keep left + width and top + height <= 1 so artwork stays inside the room.
export const roomLayout = {
  aspectRatio: 3 / 4,
  yarnBasket: { left: 0.08, top: 0.57, width: 0.35, height: 0.25 },
  notebook: { left: 0.55, top: 0.37, width: 0.36, height: 0.25 },
};

export type RoomObjectBounds = typeof roomLayout.yarnBasket;
