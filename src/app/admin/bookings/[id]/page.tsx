// src/app/admin/bookings/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBookingById } from '@/actions/booking';
import { getEquipmentById } from '@/actions/equipment';
import { updateBookingStatus } from '@/actions/booking';
import Link from 'next/link';
import Image from 'next/image';

interface BookingDetailsProps {
  params: {
    id: string;
  };
}

export default function BookingDetails({ params }: BookingDetailsProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
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
        setError('Failed to load booking details');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);
  
  const handleStatusUpdate = async (status: string) => {
    setUpdateLoading(true);
    
    try {
      const updatedBooking = await updateBookingStatus(booking._id, status);
      setBooking(updatedBooking);
      setUpdateLoading(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update booking status');
      setUpdateLoading(false);
    }
  };
  
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
            onClick={() => router.push('/admin/bookings')}
            className="w-full bg-[#166534] hover:bg-green-800 text-white font-medium py-3 rounded-md transition duration-300"
          >
            Return to Bookings
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F7FEF9] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/bookings"
            className="text-[#166534] hover:underline inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bookings
          </Link>
          
          <div>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
              ${booking.status === 'paid' ? 'bg-green-100 text-green-800' : 
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                booking.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                'bg-red-100 text-red-800'}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#166534] py-4 px-6">
            <h1 className="text-xl font-bold text-white">
              Booking Details
            </h1>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Customer Information
                </h2>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{booking.fullName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">ID Number</p>
                      <p className="font-medium">{booking.idNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">
                        {booking.district}, {booking.sector}, {booking.village}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <p className="font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Booking Created</p>
                      <p className="font-medium">
                        {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Equipment Information
                </h2>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <div className="relative h-16 w-16 mr-4">
                      <Image
                        src={equipment.imageUrl}
                        alt={equipment.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{equipment.name}</h3>
                      <p className="text-sm text-gray-500">{equipment.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm">{equipment.shortDescription}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium text-[#166534]">
                        {equipment.price.toLocaleString()} RWF
                      </p>
                    </div>
                    
                    {booking.paymentId && (
                      <div>
                        <p className="text-sm text-gray-500">Payment ID</p>
                        <p className="font-medium text-xs break-all">
                          {booking.paymentId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Update Booking Status
              </h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusUpdate('confirmed')}
                  disabled={updateLoading || booking.status === 'confirmed'}
                  className={`px-4 py-2 rounded-md font-medium text-sm 
                    ${booking.status === 'confirmed' 
                      ? 'bg-blue-100 text-blue-800 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'} 
                    transition duration-300 disabled:opacity-50`}
                >
                  Confirm Booking
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={updateLoading || booking.status === 'completed' || booking.status === 'cancelled'}
                  className={`px-4 py-2 rounded-md font-medium text-sm 
                    ${booking.status === 'completed' 
                      ? 'bg-gray-100 text-gray-800 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'} 
                    transition duration-300 disabled:opacity-50`}
                >
                  Mark as Completed
                </button>
                
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updateLoading || booking.status === 'cancelled' || booking.status === 'completed'}
                  className={`px-4 py-2 rounded-md font-medium text-sm 
                    ${booking.status === 'cancelled' 
                      ? 'bg-red-100 text-red-800 cursor-not-allowed' 
                      : 'bg-red-600 text-white hover:bg-red-700'} 
                    transition duration-300 disabled:opacity-50`}
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}