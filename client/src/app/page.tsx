'use client';

import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import AcademySlider from './components/AcademySlider';
import About from './components/About';
import PricingSection from './components/PricingSection';
import ContactSection from './components/ContactSection';
import Header from './components/Header';    
import Footer from './components/Footer';
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <Header/>
        <Hero />
        <FeaturesSection />
        <AcademySlider />
        <About />
        <PricingSection />
        <ContactSection />
        <Footer/>
      </main>
    </div>
  );
}
