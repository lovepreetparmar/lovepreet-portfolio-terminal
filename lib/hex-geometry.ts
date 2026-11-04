import { PlaneGeometry } from "three";

const WIDTH = 0.56;
const HEIGHT = WIDTH * (704 / 512);

const face = new PlaneGeometry(WIDTH, HEIGHT);
const glow = new PlaneGeometry(WIDTH * 1.06, HEIGHT * 1.05);

export const CARD_WIDTH = WIDTH;
export const CARD_HEIGHT = HEIGHT;
export const cardFaceGeometry = face;
export const cardGlowGeometry = glow;
