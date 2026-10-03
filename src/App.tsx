import { LucideProvider } from 'lucide-react';
import { useEffect } from 'react';
import { NoiseOverlay } from './components/brand/NoiseOverlay';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Capabilities } from './components/sections/Capabilities';
import { CaseStudies } from './components/sections/CaseStudies';
import { CollaborationModel } from './components/sections/CollaborationModel';
import { Contact } from './components/sections/Contact';
import { EngagementModels } from './components/sections/EngagementModels';
import { FAQ } from './components/sections/FAQ';
import { Hero } from './components/sections/Hero';
import { VelocityCalculator } from './components/sections/VelocityCalculator';
import { initSmoothScroll } from './lib/scroll';

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <LucideProvider strokeWidth={1.25}>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-md bg-signal px-4 py-2 font-medium text-basalt"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Capabilities />
        <CollaborationModel />
        <EngagementModels />
        <CaseStudies />
        <VelocityCalculator />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <NoiseOverlay />
    </LucideProvider>
  );
}
