'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Equipment from '@/models/equipment';
import { uploadToCloudinary } from '@/lib/utils/upload';
import { sendEmail } from '@/lib/utils/email';

export async function getEquipment(featured = false, limit?: number) {
  try {
    await dbConnect();
    
    let query = Equipment.find({ isAvailable: true });
    
    if (featured) {
      // Logic for featured equipment (could be based on popularity, etc.)
      query = query.sort({ createdAt: -1 });
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const equipment = await query.lean();
    return JSON.parse(JSON.stringify(equipment));
  } catch (error) {
    console.error('Failed to fetch equipment:', error);
    throw new Error('Failed to fetch equipment');
  }
}

export async function getEquipmentById(id: string) {
  try {
    await dbConnect();
    const equipment = await Equipment.findById(id).lean();
    
    if (!equipment) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(equipment));
  } catch (error) {
    console.error('Failed to fetch equipment by ID:', error);
    throw new Error('Failed to fetch equipment details');
  }
}

export async function uploadEquipment(formData: FormData) {
  try {
    await dbConnect();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const image = formData.get('image') as File;
    
    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(image);
    
    // Create new equipment
    const newEquipment = await Equipment.create({
      name,
      description,
      shortDescription,
      price,
      category,
      imageUrl,
      isAvailable: true,
    });
    
    revalidatePath('/equipment');
    revalidatePath('/admin');
    
    return JSON.parse(JSON.stringify(newEquipment));
  } catch (error) {
    console.error('Failed to upload equipment:', error);
    throw new Error('Failed to upload equipment');
  }
}

export async function updateEquipment(id: string, formData: FormData) {
  try {
    await dbConnect();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const isAvailable = formData.get('isAvailable') === 'true';
    const image = formData.get('image') as File | null;

    // Validate required fields
    if (!name || !description || !shortDescription || !price || !category) {
      throw new Error('Missing required fields');
    }

    // Get existing equipment
    const existingEquipment = await Equipment.findById(id);
    if (!existingEquipment) {
      throw new Error('Equipment not found');
    }

    // Update equipment data
    const updateData: any = {
      name,
      description,
      shortDescription,
      price,
      category,
      isAvailable,
    };

    // Handle image upload if new image is provided
    if (image) {
      const imageUrl = await uploadToCloudinary(image);
      updateData.imageUrl = imageUrl;
    }

    // Update equipment
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    revalidatePath('/equipment');
    revalidatePath('/admin/equipment');
    
    return JSON.parse(JSON.stringify(updatedEquipment));
  } catch (error) {
    console.error('Failed to update equipment:', error);
    throw new Error('Failed to update equipment');
  }
}

export async function updateEquipmentAvailability(id: string, isAvailable: boolean) {
  try {
    await dbConnect();
    
    const equipment = await Equipment.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    ).lean();
    
    revalidatePath('/equipment');
    revalidatePath('/admin');
    
    return JSON.parse(JSON.stringify(equipment));
  } catch (error) {
    console.error('Failed to update equipment availability:', error);
    throw new Error('Failed to update equipment availability');
  }
}

export async function deleteEquipment(id: string) {
  try {
    await dbConnect();
    
    await Equipment.findByIdAndDelete(id);
    
    revalidatePath('/equipment');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete equipment:', error);
    throw new Error('Failed to delete equipment');
  }
}