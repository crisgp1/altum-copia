import Navbar from './components/navigation/Navbar';
import HeroSection from './components/sections/HeroSection';
import ServicesPreview from './components/sections/ServicesPreview';
import AttorneysCarousel from './components/sections/AttorneysCarousel';
import AboutSection from './components/sections/AboutSection';
import ContactSection from './components/sections/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesPreview />
      <AttorneysCarousel />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
