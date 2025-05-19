'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipment } from '@/actions/equipment';
import { IEquipment } from '@/models/equipment';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminEquipmentPage() {
  const router = useRouter();
  const [equipment, setEquipment] = useState<IEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch equipment on component mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (err) {
      setError('Failed to load equipment');
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (equipmentId: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;

    try {
      const response = await fetch(`/api/equipment/${equipmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete equipment');

      // Remove the deleted item from state
      setEquipment(prev => prev.filter(item => item._id !== equipmentId));
      router.refresh();
    } catch (err) {
      console.error('Error deleting equipment:', err);
      alert('Failed to delete equipment. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F7FEF9] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manage Equipment
          </h1>
          
          <div className="flex space-x-4">
            <Link href="/admin" className="text-[#166534] hover:underline">
              Back to Dashboard
            </Link>
            <Link
              href="/admin/upload"
              className="bg-[#166534] hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
            >
              Upload New Equipment
            </Link>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item: IEquipment) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.shortDescription}</p>
                <p className="text-[#166534] font-bold mt-2">{item.price.toLocaleString()} RWF</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Category: {item.category}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/equipment/${item._id}/edit`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {equipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No equipment available.</p>
            <p className="text-gray-500 mt-2">
              Start by uploading new equipment using the button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 