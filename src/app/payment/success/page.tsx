// src/app/payment/success/page.tsx
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F7FEF9] py-16 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="py-8 px-6 text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-[#166534]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. We have sent a confirmation email 
            with all the details.
          </p>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-gray-600 mb-6">
              Thank you for using Thrive Africa Tractor Platform. Our team will 
              contact you soon to coordinate the service.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Link 
                href="/"
                className="bg-[#166534] hover:bg-green-800 text-white font-medium py-3 px-4 rounded-md transition duration-300 w-full"
              >
                Return to Home
              </Link>
              
              <Link 
                href="/equipment"
                className="border border-[#166534] text-[#166534] hover:bg-[#166534]/5 font-medium py-3 px-4 rounded-md transition duration-300 w-full"
              >
                Browse More Equipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}