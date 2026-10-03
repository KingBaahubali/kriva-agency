import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { NAV_LINKS } from '../../data/content';
import { useClock } from '../../hooks/useClock';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { cn } from '../../lib/cn';
import { EASE_KINETIC } from '../../lib/motion';
import { currentPhase, PHASE_LABEL } from '../../lib/time';
import { Logo } from '../brand/Logo';
import { ButtonLink } from '../ui/Button';
import { MobileMenu } from './MobileMenu';

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);
  const now = useClock(30_000);
  const phase = currentPhase(now);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_KINETIC, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
      >
        <div
          className={cn(
            'mx-auto flex max-w-shell items-center gap-4 rounded-xl border px-3 transition-all duration-base ease-kinetic sm:px-4',
            scrolled
              ? 'h-14 border-line-strong bg-basalt/80 shadow-lift backdrop-blur-md'
              : 'h-16 border-line bg-basalt/60 backdrop-blur-md',
          )}
        >
          <a href="#top" className="flex shrink-0 items-center rounded-md p-1 text-ink-100" aria-label="Kriva — back to top">
            <Logo className="h-6" title="Kriva" />
          </a>

          <nav aria-label="Primary" className="ml-4 hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative rounded-md px-3 py-2 text-small transition-colors duration-fast',
                        isActive ? 'text-ink-100' : 'text-ink-300 hover:text-ink-100',
                      )}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-px h-px bg-signal"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div
              className="hidden items-center gap-2.5 rounded-pill border border-line bg-graphite/70 px-3 py-1.5 xl:flex"
              title={PHASE_LABEL[phase]}
            >
              <span aria-hidden="true" className="pulse-dot h-1.5 w-1.5 rounded-full bg-status-ok" />
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-200">
                PST/EST Pods Active
              </span>
              <span className="sr-only">— {PHASE_LABEL[phase]}</span>
            </div>

            <ButtonLink href="#contact" size="sm" className="hidden sm:inline-flex">
              Schedule Architecture Call
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink-100 transition-colors hover:border-line-strong lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
    </>
  );
}
