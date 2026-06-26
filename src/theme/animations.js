// src/theme/animations.js
import { Easing } from 'react-native';

export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 450,
  verySlow: 600,
};

export const easing = {
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
  spring: { damping: 18, stiffness: 200 },
  snappy: { damping: 14, stiffness: 280 },
  gentle: { damping: 22, stiffness: 120 },
};