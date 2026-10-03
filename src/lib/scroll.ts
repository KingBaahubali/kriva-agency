import Lenis from 'lenis';

/**
 * Lenis singleton + accessible anchor navigation.
 * Smooth scrolling is skipped entirely under prefers-reduced-motion.
 */

let lenis: Lenis | null = null;
const HEADER_OFFSET = -88;

export function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    lenis = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  }

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href')!.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToSection(id);
  };

  document.addEventListener('click', onClick);
  return () => {
    document.removeEventListener('click', onClick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Scroll to a section, update the URL hash, and move focus for keyboard/AT users. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const focusTarget = () => {
    const heading = target.querySelector<HTMLElement>('[data-section-focus]') ?? target;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  };

  history.replaceState(null, '', id === 'top' ? location.pathname + location.search : `#${id}`);

  if (lenis) {
    lenis.scrollTo(id === 'top' ? 0 : target, {
      offset: HEADER_OFFSET,
      duration: 1.2,
      onComplete: focusTarget,
    });
  } else {
    const y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: 'auto' });
    focusTarget();
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}
