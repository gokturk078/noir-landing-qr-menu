import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Features from '@/components/landing/Features';
import FeaturedDishes from '@/components/landing/FeaturedDishes';
import Gallery from '@/components/landing/Gallery';
import Chef from '@/components/landing/Chef';
import Testimonials from '@/components/landing/Testimonials';
import Reservation from '@/components/landing/Reservation';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="bg-obsidian min-h-screen text-ivory font-body selection:bg-gold selection:text-obsidian">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <FeaturedDishes />
        <Gallery />
        <Chef />
        <Testimonials />
        <Reservation />
      </main>
      <Footer />
    </div>
  );
}
