import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { HERO } from '../../data/content';
import { EASE_KINETIC } from '../../lib/motion';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { ButtonLink } from '../ui/Button';
import { TelemetryWidget } from './TelemetryWidget';

export function Hero() {
  const reduce = useReducedMotion();
  const line = (i: number) =>
    reduce
      ? {}
      : {
          initial: { y: '110%' },
          animate: { y: 0 },
          transition: { duration: 1, ease: EASE_KINETIC, delay: 0.15 + i * 0.09 },
        };

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-[var(--spacing-section)] pt-32 sm:pt-40"
    >
      <div aria-hidden="true" className="hairline-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-signal/[0.07] blur-3xl"
      />

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 lg:pt-6">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="eyebrow mb-7 flex items-center gap-3"
          >
            <span aria-hidden="true" className="inline-block h-px w-8 bg-signal" />
            {HERO.kicker}
          </motion.p>

          <h1 id="hero-title" data-section-focus className="text-display-xl font-bold">
            {HERO.headline.map((text, i) => (
              <span key={text} className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block" {...line(i)}>
                  {text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_KINETIC, delay: 0.55 }}
            className="mt-8 max-w-[38rem] text-body-lg text-ink-200"
          >
            {HERO.lead}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_KINETIC, delay: 0.65 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <ButtonLink href="#contact" size="lg">
              {HERO.primaryCta}
              <ArrowUpRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </ButtonLink>
            <a
              href="#simulator"
              className="group inline-flex items-center gap-2 py-2 text-[0.9375rem] font-medium text-ink-100"
            >
              <span className="border-b border-line-strong pb-0.5 transition-colors group-hover:border-signal">
                {HERO.secondaryCta}
              </span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-base ease-kinetic group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_KINETIC, delay: 0.8 }}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4"
          >
            {HERO.metrics.map((m) => (
              <div key={m.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-2 text-caption text-ink-300">{m.label}</dt>
                <dd className="font-display text-display-md font-semibold leading-none text-ink-100">
                  {'static' in m ? (
                    <span className="tabular">{m.static}</span>
                  ) : (
                    <AnimatedNumber
                      value={m.value}
                      decimals={m.decimals}
                      prefix={'prefix' in m ? m.prefix : ''}
                      suffix={m.suffix}
                    />
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_KINETIC, delay: 0.5 }}
          className="lg:col-span-5 lg:mt-14"
        >
          <TelemetryWidget />
        </motion.div>
      </div>
    </section>
  );
}
