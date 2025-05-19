// src/components/forms/BookingForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/actions/booking';
import { IEquipment } from '@/models/equipment';

interface BookingFormProps {
  equipment: IEquipment;
}

export default function BookingForm({ equipment }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: '',
    sector: '',
    cell: '',
    idNumber: '',
    bookingDate: '',
    duration: 1
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && !value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    
    // ID number validation (assuming 16 digits for Rwanda)
    if (formData.idNumber && !/^\d{16}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'ID number must be 16 digits';
    }
    
    // Date validation
    const selectedDate = new Date(formData.bookingDate);
    const today = new Date();
    if (selectedDate < today) {
      newErrors.bookingDate = 'Booking date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const booking = await createBooking({
        ...formData,
        equipmentId: equipment._id.toString(),
        duration: Number(formData.duration)
      });
      
      // Redirect to payment page
      router.push(`/payment/${booking._id}`);
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ form: 'Failed to create booking. Please try again.' });
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-[#166534] mb-6">Book {equipment.name}</h2>
        
        {errors.form && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {errors.form}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="district" className="block text-gray-700 font-medium mb-2">
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.district && (
              <p className="text-red-500 text-sm mt-1">{errors.district}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="sector" className="block text-gray-700 font-medium mb-2">
              Sector
            </label>
            <input
              type="text"
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.sector ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.sector && (
              <p className="text-red-500 text-sm mt-1">{errors.sector}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="cell" className="block text-gray-700 font-medium mb-2">
              Cell
            </label>
            <input
              type="text"
              id="cell"
              name="cell"
              value={formData.cell}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.cell ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.cell && (
              <p className="text-red-500 text-sm mt-1">{errors.cell}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="idNumber" className="block text-gray-700 font-medium mb-2">
              ID Number
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.idNumber ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.idNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="bookingDate" className="block text-gray-700 font-medium mb-2">
              Booking Date
            </label>
            <input
              type="date"
              id="bookingDate"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.bookingDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.bookingDate && (
              <p className="text-red-500 text-sm mt-1">{errors.bookingDate}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
              Duration (Days)
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Day' : 'Days'}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-[#F7FEF9] p-6 rounded-lg">
        <div className="text-[#166534]">
          <p className="font-medium">Price:</p>
          <p className="text-xl font-bold">{equipment.price.toLocaleString()} RWF</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-[#166534] hover:bg-green-800 text-white font-medium py-3 px-8 rounded-md transition duration-300 disabled:opacity-70"
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </form>
  );
}