import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/utils/upload';
import dbConnect from '@/lib/mongodb';
import Equipment from '@/models/equipment';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const isAvailable = formData.get('isAvailable') === 'true';
    const image = formData.get('image') as File | null;

    // Validate required fields
    if (!name || !description || !shortDescription || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing equipment
    const existingEquipment = await Equipment.findById(params.id);
    if (!existingEquipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
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
      params.id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updatedEquipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json(
      { error: 'Failed to update equipment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const equipment = await Equipment.findByIdAndDelete(params.id);
    
    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json(
      { error: 'Failed to delete equipment' },
      { status: 500 }
    );
  }
} 