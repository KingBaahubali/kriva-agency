import { cn } from '../../lib/cn';

interface LogoProps {
  className?: string;
  /** Render the monogram only. */
  markOnly?: boolean;
  title?: string;
}

/** Inline Kriva lockup — identical geometry to /public/brand/kriva-logo.svg. */
export function Logo({ className, markOnly = false, title = 'Kriva' }: LogoProps) {
  return (
    <svg
      viewBox={markOnly ? '0 0 27 32' : '0 0 122 32'}
      className={cn('block h-7 w-auto', className)}
      role="img"
      aria-label={title}
      focusable="false"
    >
      <g fill="currentColor">
        <rect x="4" y="4" width="6" height="24" />
        <polygon points="12,8 16,4 23,4 12,15" />
        <polygon points="12,24 16,28 23,28 12,17" />
      </g>
      <polygon points="14,16 16,14 18,16 16,18" fill="#FF4B1F" />
      {!markOnly && (
        <g fill="currentColor" transform="translate(-6 2)">
          <rect x="44" y="4" width="3.5" height="22" />
          <polygon points="49.5,17.5 55,12 59.9,12 49.5,22.4" />
          <polygon points="53.5,18.4 56,15.9 66.1,26 61.1,26" />
          <rect x="70" y="12" width="3.5" height="14" />
          <rect x="73.5" y="12" width="6.5" height="3.5" />
          <rect x="84" y="12" width="3.5" height="14" />
          <rect x="84" y="5" width="3.5" height="3.5" />
          <polygon points="91.5,12 95.2,12 99.5,22.6 103.8,12 107.5,12 101.4,26 97.6,26" />
          <circle cx="117" cy="19" r="5.25" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <rect x="120.75" y="12" width="3.5" height="14" />
        </g>
      )}
    </svg>
  );
}
