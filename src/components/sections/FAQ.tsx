import { Plus } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { FAQ as FAQ_CONTENT } from '../../data/content';
import { cn } from '../../lib/cn';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';

/**
 * WAI-ARIA accordion. Panels use hidden="until-found" so browser find-in-page
 * and URL text fragments can reveal answers; `beforematch` keeps the trigger's
 * aria-expanded in sync.
 */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    panels.current.forEach((panel, i) => {
      if (!panel) return;
      if (open === i) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', 'until-found');
    });
  }, [open]);

  useEffect(() => {
    const cleanups = panels.current.map((panel, i) => {
      if (!panel) return () => {};
      const onMatch = () => setOpen(i);
      panel.addEventListener('beforematch', onMatch);
      return () => panel.removeEventListener('beforematch', onMatch);
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = FAQ_CONTENT.items.length - 1;
    const map: Record<string, number> = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      triggers.current[map[e.key]]?.focus();
    }
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-[var(--spacing-section)]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeader id="faq" eyebrow={FAQ_CONTENT.eyebrow} title={FAQ_CONTENT.title} className="!block" />
            <Reveal delay={0.1}>
              <p className="mt-6 text-small text-ink-300">
                Need your counsel to review our paper? Email{' '}
                <a href="mailto:hello@kriva.io" className="text-ink-100 underline decoration-line-strong underline-offset-4 hover:decoration-signal">
                  hello@kriva.io
                </a>{' '}
                for the MSA, DPA and security overview.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="lg:col-span-8">
          <div className="border-t border-line">
            {FAQ_CONTENT.items.map((item, i) => {
              const isOpen = open === i;
              const tid = `${baseId}-t${i}`;
              const pid = `${baseId}-p${i}`;
              return (
                <div key={item.q} className="border-b border-line">
                  <h3>
                    <button
                      ref={(el) => {
                        triggers.current[i] = el;
                      }}
                      id={tid}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={pid}
                      onClick={() => setOpen(isOpen ? null : i)}
                      onKeyDown={(e) => onKeyDown(e, i)}
                      className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className="font-display text-[1.125rem] font-semibold text-ink-100 transition-colors group-hover:text-white sm:text-[1.25rem]">
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-all duration-base ease-kinetic',
                          isOpen ? 'rotate-45 border-signal text-signal' : 'border-line-strong text-ink-200 group-hover:border-ink-300',
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    ref={(el) => {
                      panels.current[i] = el;
                    }}
                    id={pid}
                    role="region"
                    aria-labelledby={tid}
                  >
                    <p className="faq-answer max-w-2xl pb-7 pr-12 text-ink-300">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
