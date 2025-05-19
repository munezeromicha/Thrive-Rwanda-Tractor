'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEquipmentById } from '@/actions/equipment';
import { IEquipment } from '@/models/equipment';

interface BookingPageProps {
  params: {
    id: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter();
  const [equipment, setEquipment] = useState<IEquipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: '',
    sector: '',
    cell: '',
    idNumber: '',
    bookingDate: '',
    duration: '1'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          equipmentId: params.id,
          duration: parseInt(formData.duration),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const data = await response.json();
      router.push(`/bookings/success?bookingId=${data.data.booking._id}`);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Replace useState with useEffect for fetching equipment
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await getEquipmentById(params.id);
        setEquipment(data);
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
        setError('Failed to load equipment details');
      }
    };

    fetchEquipment();
  }, [params.id]);

  if (!equipment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7FEF9] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Equipment</h1>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{equipment.name}</h2>
                <p className="text-gray-600">{equipment.description}</p>
                <p className="text-[#166534] font-semibold mt-2">
                  {equipment.price.toLocaleString()} RWF per day
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="idNumber" className="block text-gray-700 font-medium mb-2">
                      ID Number
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      required
                      value={formData.idNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-gray-700 font-medium mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="sector" className="block text-gray-700 font-medium mb-2">
                      Sector
                    </label>
                    <input
                      type="text"
                      id="sector"
                      name="sector"
                      required
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="cell" className="block text-gray-700 font-medium mb-2">
                      Cell
                    </label>
                    <input
                      type="text"
                      id="cell"
                      name="cell"
                      required
                      value={formData.cell}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="bookingDate" className="block text-gray-700 font-medium mb-2">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      id="bookingDate"
                      name="bookingDate"
                      required
                      value={formData.bookingDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    />
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
                      Duration (Days)
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      required
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Day' : 'Days'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <Link
                    href="/equipment"
                    className="text-[#166534] hover:text-[#166534]/80 font-medium"
                  >
                    Back to Equipment
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-[#166534] text-white px-6 py-2 rounded-md font-medium hover:bg-[#166534]/90 focus:outline-none focus:ring-2 focus:ring-[#166534] focus:ring-offset-2 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
