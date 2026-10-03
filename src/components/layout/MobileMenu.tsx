import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import { NAV_LINKS } from '../../data/content';
import { cn } from '../../lib/cn';
import { lockScroll, scrollToSection } from '../../lib/scroll';
import { Logo } from '../brand/Logo';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  active: string | null;
}

/**
 * Native modal <dialog>: focus trap, inert background, Esc/back-gesture
 * dismissal (closedby) and light dismiss come from the platform.
 */
export function MobileMenu({ open, onClose, active }: MobileMenuProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lockScroll(true);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      lockScroll(false);
      onClose();
    };
    // Light-dismiss fallback for browsers without `closedby` support.
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  const go = (id: string) => (e: ReactMouseEvent) => {
    e.preventDefault();
    ref.current?.close();
    // Wait a frame so the dialog releases scroll lock before animating.
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <dialog
      ref={ref}
      id="mobile-menu"
      aria-label="Site menu"
      {...{ closedby: 'any' }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-transparent p-3 text-ink-200 backdrop:bg-basalt/70"
    >
      <div className="surface flex h-full flex-col rounded-xl p-5">
        <div className="flex items-center justify-between">
          <Logo className="h-6 text-ink-100" />
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink-100 hover:border-line-strong"
          >
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-10">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <li key={link.id} className="border-b border-line">
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  aria-current={active === link.id ? 'location' : undefined}
                  className={cn(
                    'flex items-baseline justify-between py-4 font-display text-title font-semibold transition-colors',
                    active === link.id ? 'text-ink-100' : 'text-ink-200 hover:text-ink-100',
                  )}
                >
                  {link.label}
                  <span className="font-mono text-caption text-ink-400">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-2.5 text-caption text-ink-300">
            <span aria-hidden="true" className="pulse-dot h-1.5 w-1.5 rounded-full bg-status-ok" />
            <span className="font-mono uppercase tracking-[0.12em]">PST/EST Pods Active</span>
          </div>
          <a
            href="#contact"
            onClick={go('contact')}
            className="flex h-12 items-center justify-center gap-2 rounded-md bg-signal font-medium text-basalt hover:bg-signal-soft"
          >
            Schedule Architecture Call
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </dialog>
  );
}
