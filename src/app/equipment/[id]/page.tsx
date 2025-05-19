// src/app/equipment/[id]/page.tsx
import { getEquipmentById } from '@/actions/equipment';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface EquipmentDetailsProps {
  params: {
    id: string;
  };
}

export default async function EquipmentDetails({ params }: EquipmentDetailsProps) {
  const equipment = await getEquipmentById(params.id);
  
  if (!equipment) {
    notFound();
  }
  
  return (
    <div className="bg-[#F7FEF9] min-h-screen py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-72 md:h-full w-full">
                <Image
                  src={equipment.imageUrl}
                  alt={equipment.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-[#166534] font-semibold">
                {equipment.category}
              </div>
              
              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {equipment.name}
              </h1>
              
              <p className="mt-4 text-gray-600 whitespace-pre-line">
                {equipment.description}
              </p>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Price</p>
                    <p className="text-3xl font-bold text-[#166534]">
                      {equipment.price.toLocaleString()} RWF
                    </p>
                  </div>
                  
                  <Link
                    href={`/equipment/${equipment._id}/booking`}
                    className="bg-[#166534] hover:bg-green-800 text-white font-medium py-3 px-8 rounded-md transition duration-300"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Equipment Specifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F7FEF9] p-4 rounded-md">
                <h3 className="font-medium text-[#166534] mb-2">Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#166534] mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Modern and efficient
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
