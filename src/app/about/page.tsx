'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import aboutHero from '../../../public/images/image/tr_2.jpg';
import missionImg from '../../../public/images/image/img1.jpg';
import TeamSection from '@/components/sections/TeamSection';
import augustinImg from '../../../public/images/image/augustin.jpg';
import honorineImg from '../../../public/images/image/honorine.jpg';
import michelImg from '../../../public/images/image/michel.jpg';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7FEF9]">
        {/* Hero Section */}
        <div className="relative bg-[#166534] py-16 md:py-24">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#166534]/90 to-[#166534]/70 mix-blend-multiply"></div>
            <Image 
              src={aboutHero}
              alt="Farming in Africa" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Thrive Rwanda Tractor</h1>
              <p className="text-xl md:text-2xl text-white/90">
                Empowering African farmers through innovative agricultural mechanization solutions
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-xl overflow-hidden">
                <Image
                  src={missionImg}
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#166534] mb-6">Our Mission</h2>
                <p className="text-gray-700 text-lg mb-8">
                  To revolutionize African agriculture by providing accessible mechanization services 
                  to smallholder farmers, enhancing productivity, and fostering sustainable farming practices 
                  across the continent.
                </p>
                <h2 className="text-3xl font-bold text-[#166534] mb-6">Our Vision</h2>
                <p className="text-gray-700 text-lg">
                  To be the leading platform connecting farmers with agricultural mechanization services, 
                  driving rural development, and ensuring food security in Africa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#166534] mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  icon: (
                    <svg className="w-12 h-12 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  description: "Embracing technology to transform traditional farming practices"
                },
                {
                  title: "Sustainability",
                  icon: (
                    <svg className="w-12 h-12 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  description: "Promoting environmentally conscious farming methods"
                },
                {
                  title: "Community",
                  icon: (
                    <svg className="w-12 h-12 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  description: "Building strong relationships with farmers and service providers"
                }
              ].map((value, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-[#F7FEF9] shadow-sm">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#166534] mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="py-16 bg-[#F7FEF9]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#166534] mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "0", label: "Farmers Served" },
                { number: "0", label: "Equipment Registered" },
                { number: "0", label: "Districts Covered" },
                { number: "0%", label: "Satisfaction Rate" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-[#166534] mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <TeamSection
          members={[
            {
              name: "NKUNDIMANA Augustin",
              role: "Founder",
              email: "aunkundimana@gmail.com",
              image: augustinImg.src,
              social: {
                x: "https://x.com/aunkundimana?t=U6dxiagDsyftJRh33eHimw&s=09",
                linkedin: "https://www.linkedin.com/in/augustin-nkundimana-162349257?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                whatsapp: "https://wa.me/250783692429"
              }
            },
            {
              name: "UWASE Honorine",
              role: "Marketing",
              email: "honorine@example.com",
              image: honorineImg.src,
              social: {
                x: "https://x.com/honorine",
                linkedin: "https://linkedin.com/in/honorine",
                whatsapp: "https://wa.me/your_number"
              }
            },
            {
              name: "MUNEZERO NTAGANIRA Michel",
              role: "Software Developer",
              email: "munezerontaganiramichel@gmail.com",
              image: michelImg.src,
              social: {
                x: "https://x.com/michel_munezero",
                linkedin: "https://www.linkedin.com/in/munezero-ntaganira-michel-062187265/",
                whatsapp: "https://wa.me/250790962901"
              }
            }
          ]}
        />

        {/* Call to Action */}
        <div className="bg-[#166534] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Join Our Mission?</h2>
              <p className="text-white/90 text-lg mb-8">
                Be part of the agricultural transformation in Africa. Start using our platform today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/equipment"
                  className="bg-white text-[#166534] hover:bg-white/90 font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                  Browse Equipment
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 