// MUDANÇA 1: Troca de require por import. (Vamos precisar desse arquivo 'thresholds.js')
import { POS_THRESHOLD, NEG_THRESHOLD, MIN_MAGNITUDE_NEUTRAL } from './thresholds.js';

// MUDANÇA 2: Usamos export direto na função
export function labelFrom(score = 0, magnitude = 0) {
  if (magnitude < MIN_MAGNITUDE_NEUTRAL) return { score, magnitude, label: 'neutral' };
  if (score > POS_THRESHOLD) return { score, magnitude, label: 'positive' };
  if (score < NEG_THRESHOLD) return { score, magnitude, label: 'negative' };
  return { score, magnitude, label: 'neutral' };
}