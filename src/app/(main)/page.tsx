import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import EquipmentList from '@/components/sections/EquipmentList';
import Features from '@/components/sections/Features';

export default async function Home() {
  return (
    <main className="min-h-screen bg-[#F7FEF9]">
      <Hero 
        title="Transforming Agriculture with Digital Access to Mechanization"
        subtitle="Connect with tractor services to increase productivity and reduce manual labor"
        ctaText="Explore Equipment"
        ctaLink="/equipment"
      />
      
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#166534] mb-4">
            Available Farming Equipment
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Browse our selection of high-quality farming equipment available for booking
          </p>
        </div>
        
        <EquipmentList featured={true} limit={6} />
        
        <div className="text-center mt-10">
          <Link 
            href="/equipment"
            className="bg-[#166534] hover:bg-green-800 text-white font-medium py-3 px-6 rounded-md transition duration-300"
          >
            View All Equipment
          </Link>
        </div>
      </section>
      
      <Features />
    </main>
  );
} 