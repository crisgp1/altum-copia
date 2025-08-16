import Navbar from '../components/navigation/Navbar';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/sections/Footer';

export default function ContactoPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}