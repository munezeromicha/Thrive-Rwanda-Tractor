import Link from 'next/link';
import Image from 'next/image';
import img1 from '../../../public/images/image/img1.jpg';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps) {
  return (
    <div className="relative bg-[#166534] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={img1}
          alt="Tractor in field"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={ctaLink}
              className="bg-white text-[#166534] hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition duration-300 text-center"
            >
              {ctaText}
            </Link>
            
            <Link 
              href="/about"
              className="border border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-md transition duration-300 text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}