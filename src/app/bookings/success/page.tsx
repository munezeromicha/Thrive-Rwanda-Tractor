'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useEffect, useState } from 'react';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) {
      setError('Invalid booking reference');
      return;
    }
    const id = searchParams.get('bookingId');
    if (!id) {
      setError('No booking reference found');
      return;
    }
    setBookingId(id);
  }, [searchParams]);

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7FEF9] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
                <p className="text-gray-600 text-lg mb-8">{error}</p>
                <Link
                  href="/equipment"
                  className="bg-[#166534] text-white hover:bg-green-700 font-medium py-3 px-8 rounded-lg transition duration-300 text-center"
                >
                  Return to Equipment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!bookingId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7FEF9] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#166534] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading booking details...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7FEF9] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Successful!</h1>
              <p className="text-gray-600 text-lg mb-2">
                Thank you for booking with Thrive Rwanda Tractor.
              </p>
              <p className="text-gray-600">
                Your booking reference number is: <span className="font-semibold">{bookingId}</span>
              </p>
            </div>

            <div className="bg-[#F7FEF9] rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#166534] mb-4">Next Steps</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#166534] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  We will review your booking request
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#166534] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  You will receive a confirmation email shortly
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-[#166534] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Our team will contact you to finalize the details
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/equipment"
                className="bg-[#166534] text-white hover:bg-green-700 font-medium py-3 px-8 rounded-lg transition duration-300 text-center"
              >
                Browse More Equipment
              </Link>
              <Link
                href="/contact"
                className="border-2 border-[#166534] text-[#166534] hover:bg-[#166534]/5 font-medium py-3 px-8 rounded-lg transition duration-300 text-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 