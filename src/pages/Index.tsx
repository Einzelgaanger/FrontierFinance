import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Mission from '@/components/home/Mission';
import Pillars from '@/components/home/Pillars';
import PartnersSection from '@/components/home/PartnersSection';
import Impact from '@/components/home/Impact';
import NewsletterSection from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
      <Hero />
      <Mission />
      <Pillars />
      <PartnersSection />
      <Impact />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
