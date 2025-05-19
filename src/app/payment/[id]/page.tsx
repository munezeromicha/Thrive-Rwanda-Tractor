// src/app/payment/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBookingById } from '@/actions/booking';
import { getEquipmentById } from '@/actions/equipment';
import { initiatePayment } from '@/actions/payment';
import { IBooking } from '@/models/booking';
import { IEquipment } from '@/models/equipment';

// Import Flutterwave SDK
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

interface PaymentPageProps {
  params: {
    id: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [equipment, setEquipment] = useState<IEquipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await getBookingById(params.id);
        
        if (!bookingData) {
          setError('Booking not found');
          setLoading(false);
          return;
        }
        
        setBooking(bookingData);
        
        const equipmentData = await getEquipmentById(bookingData.equipmentId.toString());
        
        if (!equipmentData) {
          setError('Equipment details not found');
          setLoading(false);
          return;
        }
        
        setEquipment(equipmentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load payment details');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FEF9]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#166534]"></div>
      </div>
    );
  }
  
  if (error || !booking || !equipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FEF9]">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Something went wrong'}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-[#166534] hover:bg-green-800 text-white font-medium py-3 rounded-md transition duration-300"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: `thrive-africa-${Date.now()}`,
    amount: equipment.price,
    currency: 'RWF',
    payment_options: 'card,mobilemoney',
    customer: {
      email: 'aunkundimana@gmail.com',
      name: booking.fullName,
      phone_number: '0783692429'  // You should replace this with actual phone number from booking
    },
    customizations: {
      title: 'Thrive Africa Tractor Platform',
      description: `Payment for ${equipment.name}`,
      logo: 'https://thriveafrica.com/logo.png',
    },
    callback: async (response: any) => {
      // Close payment modal
      closePaymentModal();
      
      if (response.status === 'successful') {
        // Update booking status and save payment details
        try {
          await initiatePayment({
            bookingId: booking._id.toString(),
            paymentId: response.transaction_id,
            amount: response.amount,
            currency: response.currency,
            status: 'paid',
          });
          
          router.push('/payment/success');
        } catch (error) {
          console.error('Payment processing error:', error);
          router.push('/payment/error');
        }
      } else {
        router.push('/payment/error');
      }
    },
    onClose: () => {
      // Do nothing
    },
  };
  
  return (
    <div className="min-h-screen bg-[#F7FEF9] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#166534] py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Complete Your Payment</h1>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="font-medium">{booking.fullName}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Booking Date</p>
                  <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium">{booking.district}, {booking.sector}, {booking.cell}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Equipment</p>
                  <p className="font-medium">{equipment.name}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between mb-6">
                <p className="text-lg font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-[#166534]">{equipment.price.toLocaleString()} RWF</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-sm text-gray-600">
                  Your payment will be processed securely via Flutterwave. You can pay using mobile money or card.
                </p>
              </div>
              
              <FlutterWaveButton
                {...config}
                className="w-full bg-[#166534] hover:bg-green-800 text-white font-medium py-4 px-6 rounded-md transition duration-300 text-center"
              >
                Pay Now
              </FlutterWaveButton>
              
              <button
                onClick={() => router.back()}
                className="w-full mt-4 bg-white border border-gray-300 text-gray-700 font-medium py-4 px-6 rounded-md transition duration-300 hover:bg-gray-50"
              >
                Back to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}