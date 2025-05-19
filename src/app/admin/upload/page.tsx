// src/app/admin/upload/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadEquipment } from '@/actions/equipment';

export default function UploadEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    
    // Price validation
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    // Image validation
    if (!image) {
      newErrors.image = 'Please upload an image';
    } else if (image.size > 5 * 1024 * 1024) { // 5MB limit
      newErrors.image = 'Image size cannot exceed 5MB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (image) {
        formDataToSend.append('image', image);
      }
      
      await uploadEquipment(formDataToSend);
      
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ form: 'Failed to upload equipment. Please try again.' });
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-[#F7FEF9] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#166534] py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Upload New Equipment</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {errors.form && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {errors.form}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                      ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="shortDescription" className="block text-gray-700 font-medium mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                      ${errors.shortDescription ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Brief description for cards (max 100 chars)"
                    maxLength={100}
                  />
                  {errors.shortDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                    Price (RWF)
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                      ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., 50000"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                      ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    <option value="tractor">Tractor</option>
                    <option value="plough">Plough</option>
                    <option value="harvester">Harvester</option>
                    <option value="seeder">Seeder</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="mb-6">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Full Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#166534] 
                      ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Detailed description of the equipment"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Equipment Image
                  </label>
                  <div className="relative">
                    <div className={`border-2 border-dashed rounded-md p-4 text-center 
                      ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
                      {imagePreview ? (
                        <div className="mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-48 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="py-8">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="mt-1 text-sm text-gray-500">
                            Click or drag to upload an image
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      title="Upload Equipment Image"
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Max file size: 5MB. Recommended dimensions: 1200 x 800 pixels.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md transition duration-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-[#166534] hover:bg-green-800 text-white font-medium py-3 px-8 rounded-md transition duration-300 disabled:opacity-70"
              >
                {loading ? 'Uploading...' : 'Upload Equipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}