import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  lead?: string;
  id: string;
  className?: string;
  aside?: ReactNode;
}

/** Left-aligned editorial section header: eyebrow · h2 · lead, with optional right-side slot. */
export function SectionHeader({ eyebrow, title, lead, id, className, aside }: SectionHeaderProps) {
  return (
    <div className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
      <Reveal className="lg:col-span-7">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-signal" />
          {eyebrow}
        </p>
        <h2 id={`${id}-title`} data-section-focus className="text-display-lg font-semibold">
          {title}
        </h2>
      </Reveal>
      {(lead || aside) && (
        <Reveal className="lg:col-span-5" delay={0.08}>
          {lead && <p className="text-body-lg text-ink-300">{lead}</p>}
          {aside}
        </Reveal>
      )}
    </div>
  );
}
