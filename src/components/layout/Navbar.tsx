// src/components/layout/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../../../public/images/image/Final_logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Equipment', href: '/equipment' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Thrive Africa Tractor"
                width={64}
                height={64}
                className="mr-3"
              />
              <span className="font-bold text-xl text-[#166534]">Thrive Rwanda Tractor</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium ${
                  isActive(link.href)
                    ? 'text-[#166534]'
                    : 'text-gray-600 hover:text-[#166534]'
                } transition duration-300`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link
              href="/admin"
              className="bg-[#166534] hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Admin
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              title="Toggle Mobile Menu"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-[#166534] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-t border-gray-100">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium block px-3 py-2 rounded-md ${
                  isActive(link.href)
                    ? 'text-[#166534] bg-[#F7FEF9]'
                    : 'text-gray-600 hover:text-[#166534] hover:bg-[#F7FEF9]'
                } transition duration-300`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <Link
              href="/admin"
              className="bg-[#166534] hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 block text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}