import type { Config } from 'tailwindcss';
import tokens from './brand/tokens.json';

/**
 * Tailwind v4 legacy-config bridge.
 * Loaded from src/index.css via `@config`, so brand/tokens.json remains the
 * single source of truth for every colour, type step, radius and motion value.
 */
type FontScale = Record<string, [string, { lineHeight: string; letterSpacing?: string }]>;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: tokens.color,
      fontFamily: tokens.font.family,
      fontSize: tokens.font.scale as unknown as FontScale,
      borderRadius: tokens.radius,
      spacing: tokens.space,
      boxShadow: tokens.shadow,
      maxWidth: { shell: tokens.layout.maxWidth },
      transitionTimingFunction: { kinetic: tokens.motion.easing.kinetic },
      transitionDuration: tokens.motion.duration,
    },
  },
} satisfies Config;
