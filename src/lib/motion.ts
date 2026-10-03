import type { Transition, Variants } from 'framer-motion';
import tokens from '../../brand/tokens.json';

export const EASE_KINETIC = [0.16, 1, 0.3, 1] as const;

export const SPRING: Transition = {
  type: 'spring',
  stiffness: tokens.motion.spring.stiffness,
  damping: tokens.motion.spring.damping,
  mass: tokens.motion.spring.mass,
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_KINETIC, delay },
  }),
};

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_KINETIC } },
};
