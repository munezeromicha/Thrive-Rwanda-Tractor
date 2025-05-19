// src/components/sections/Features.tsx
import Image from 'next/image';
import booking from '../../../public/images/icons/booking.svg';
import mobile from '../../../public/images/icons/mobile.svg';
import payment from '../../../public/images/icons/payment.svg';
import analytics from '../../../public/images/icons/analytics.svg';
import farmerTractor from '../../../public/images/image/user_1.jpg';

export default function Features() {
  const features = [
    {
      icon: booking,
      title: 'Real-Time Booking',
      description: 'Book farming equipment with just a few clicks, anytime and anywhere.',
    },
    {
      icon: mobile,
      title: 'Mobile Accessibility',
      description: 'Access services from any device including basic phones via SMS in remote areas.',
    },
    {
      icon: payment,
      title: 'Secure Payments',
      description: 'Pay securely using mobile money integration for seamless transactions.',
    },
    {
      icon: analytics,
      title: 'Equipment Utilization',
      description: 'Track tractor usage trends to help owners maximize productivity.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#166534] mb-4">
            Key Platform Features
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our platform connects smallholder farmers with mechanization service providers, 
            improving agricultural productivity across rural communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#F7FEF9] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-[#166534]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={32}
                  height={32}
                />
              </div>
              
              <h3 className="text-xl font-semibold text-[#166534] mb-3 text-center">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-[#166534]/5 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#166534] mb-4">
                Transforming Agriculture in Africa
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#166534] mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Reduces manual labor and increases timely land preparation</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#166534] mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Enhances income opportunities for service providers</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#166534] mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Promotes sustainable and precision farming practices</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#166534] mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Aligns with UN SDGs: Zero Hunger, Industry Innovation, and Climate Action</span>
                </li>
              </ul>
            </div>
            
            <div className="relative h-64 md:h-80">
              <Image
                src={farmerTractor}
                alt="Farmer with tractor"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}