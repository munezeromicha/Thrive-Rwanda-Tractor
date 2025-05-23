'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEquipmentById, updateEquipment } from '@/actions/equipment';
import { IEquipment } from '@/models/equipment';
import Link from 'next/link';
import Image from 'next/image';

interface EditEquipmentPageProps {
  params: {
    id: string;
  };
}

export default function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const router = useRouter();
  const [equipment, setEquipment] = useState<IEquipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchEquipment();
  }, [params.id]);

  const fetchEquipment = async () => {
    try {
      const data = await getEquipmentById(params.id);
      if (data) {
        setEquipment(data);
        setFormData({
          name: data.name,
          description: data.description,
          shortDescription: data.shortDescription,
          price: data.price.toString(),
          category: data.category,
          isAvailable: data.isAvailable,
        });
        setPreviewUrl(data.imageUrl);
      }
    } catch (err) {
      setError('Failed to load equipment details');
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('isAvailable', formData.isAvailable.toString());
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await updateEquipment(params.id, formDataToSend);
      router.push('/admin/equipment');
      router.refresh();
    } catch (err) {
      console.error('Error updating equipment:', err);
      setError('Failed to update equipment. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!equipment) return <div className="text-center py-12">Equipment not found</div>;

  return (
    <div className="min-h-screen bg-[#F7FEF9] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Edit Equipment
          </h1>
          
          <Link
            href="/admin/equipment"
            className="text-[#166534] hover:underline"
          >
            Back to Equipment List
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#166534] focus:ring-[#166534]"
                  required
                />
              </div>

              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                  Short Description
                </label>
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#166534] focus:ring-[#166534]"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Full Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#166534] focus:ring-[#166534]"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (RWF)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#166534] focus:ring-[#166534]"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#166534] focus:ring-[#166534]"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="tractor">Tractor</option>
                  <option value="plough">Plough</option>
                  <option value="harvester">Harvester</option>
                  <option value="seeder">Seeder</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="rounded border-gray-300 text-[#166534] focus:ring-[#166534]"
                  />
                  <span className="text-sm font-medium text-gray-700">Available for booking</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Image
                </label>
                <div className="relative h-64 w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Equipment preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No image selected
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  title="Upload equipment image"
                  className="mt-2 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#166534] file:text-white
                    hover:file:bg-green-800"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Link
              href="/admin/equipment"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#166534] hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#166534]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 