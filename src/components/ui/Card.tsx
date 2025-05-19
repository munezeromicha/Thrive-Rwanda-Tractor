// src/components/ui/Card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { IEquipment } from '@/models/equipment';

interface CardProps {
  equipment: IEquipment;
}

export default function Card({ equipment }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={equipment.imageUrl}
          alt={equipment.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold text-[#166534] mb-2">{equipment.name}</h3>
        <p className="text-gray-600 mb-4">{equipment.shortDescription}</p>
        
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">{equipment.price.toLocaleString()} RWF</p>
          <Link 
            href={`/equipment/${equipment._id}/booking`}
            className="bg-[#166534] hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}