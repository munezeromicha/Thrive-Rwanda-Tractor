// src/app/equipment/page.tsx
import { getEquipment } from '@/actions/equipment';
import EquipmentList from '@/components/sections/EquipmentList';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default async function EquipmentPage() {
  return (
    <>
          <Navbar />
          <div className="min-h-screen bg-[#F7FEF9] py-16 px-4">

<div className="container mx-auto">
  <div className="text-center mb-12">
    <h1 className="text-3xl md:text-4xl font-bold text-[#166534] mb-4">
      Available Farming Equipment
    </h1>
    <p className="text-gray-700 max-w-2xl mx-auto">
      Browse our selection of high-quality farming equipment available for booking.
      Find tractors, ploughs, harvesters, and more for all your agricultural needs.
    </p>
  </div>
  
  {/* <div className="bg-white rounded-lg shadow-md p-6 mb-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-3">
        <input
          type="text"
          placeholder="Search for equipment..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
        />
      </div>
      
      <div>
        <select
          title="Select Category" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534]"
        >
          <option value="">All Categories</option>
          <option value="tractor">Tractors</option>
          <option value="plough">Ploughs</option>
          <option value="harvester">Harvesters</option>
          <option value="seeder">Seeders</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  </div> */}
  
  <EquipmentList />
  
  <div className="mt-16 bg-[#166534]/5 rounded-lg p-8">
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#166534] mb-4">
        Can't Find What You Need?
      </h2>
      
      <p className="text-gray-700 mb-6">
        Contact us directly if you're looking for specific equipment not listed here.
        We can help you find the right tools for your farming needs.
      </p>
      
      <Link
        href="/contact"
        className="bg-[#166534] hover:bg-green-800 text-white font-medium py-3 px-8 rounded-md transition duration-300 inline-block"
      >
        Contact Us
      </Link>
    </div>
  </div>
</div>
</div>
    </>

  );
}