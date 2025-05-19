// src/components/sections/EquipmentList.tsx
import { getEquipment } from '@/actions/equipment';
import Card from '@/components/ui/Card';

interface EquipmentListProps {
  featured?: boolean;
  limit?: number;
}

export default async function EquipmentList({ featured = false, limit }: EquipmentListProps) {
  const equipment = await getEquipment(featured, limit);
  
  if (equipment.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No equipment available at the moment. Please check back later.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {equipment.map((item: any) => (
        <Card key={item._id} equipment={item} />
      ))}
    </div>
  );
}