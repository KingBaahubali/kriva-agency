import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import tokens from '../../brand/tokens.json';

/**
 * tailwind-merge must know our custom theme keys. Without this, a token font
 * size like `text-small` is classified as a text *colour* and silently wins
 * over `text-basalt` (or vice versa), producing contrast bugs.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: Object.keys(tokens.font.scale),
      radius: Object.keys(tokens.radius),
      shadow: Object.keys(tokens.shadow),
      ease: Object.keys(tokens.motion.easing),
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
