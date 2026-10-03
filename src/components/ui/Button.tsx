import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { SPRING } from '../../lib/motion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium select-none ' +
  'transition-[background-color,border-color,color,box-shadow] duration-fast ease-kinetic ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-signal text-basalt hover:bg-signal-soft shadow-[0_0_0_1px_rgba(255,75,31,0.5),0_10px_30px_-12px_rgba(255,75,31,0.6)]',
  secondary:
    'surface-raised text-ink-100 hover:border-line-strong hover:bg-graphite-hover',
  ghost: 'text-ink-200 hover:text-ink-100',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-small',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-13 px-6 text-base min-h-[52px]',
};

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

const interaction = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: SPRING,
};

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Common & Omit<HTMLMotionProps<'a'>, 'children'>) {
  return (
    <motion.a {...interaction} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </motion.a>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: Common & Omit<HTMLMotionProps<'button'>, 'children'>) {
  return (
    <motion.button
      {...interaction}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
