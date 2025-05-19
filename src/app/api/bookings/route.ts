// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/booking';
import Equipment from '@/models/equipment';
import { getCurrentUser } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();
    
    // If not admin, return unauthorized
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    await dbConnect();
    
    // Build query
    let query = {};
    
    if (status) {
      query = { status };
    }
    
    // Get total count
    const totalCount = await Booking.countDocuments(query);
    
    // Get bookings
    const bookings = await Booking.find(query)
      .populate('equipmentId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return NextResponse.json({
      success: true,
      data: {
        bookings: JSON.parse(JSON.stringify(bookings)),
        totalCount,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting booking creation...');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const {
      equipmentId,
      fullName,
      email,
      phone,
      district,
      sector,
      cell,
      bookingDate,
      duration,
      message,
    } = body;
    
    // Validate required fields
    if (!equipmentId || !fullName || !email || !phone || !district || !sector || !cell || !bookingDate || !duration) {
      console.log('Validation failed. Missing fields:', {
        equipmentId: !equipmentId,
        fullName: !fullName,
        email: !email,
        phone: !phone,
        district: !district,
        sector: !sector,
        cell: !cell,
        bookingDate: !bookingDate,
        duration: !duration,
      });
      
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }
    
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    // Check if equipment exists and is available
    console.log('Finding equipment with ID:', equipmentId);
    const equipment = await Equipment.findById(equipmentId);
    
    if (!equipment) {
      console.log('Equipment not found');
      return NextResponse.json(
        { success: false, error: 'Equipment not found' },
        { status: 400 }
      );
    }
    
    console.log('Equipment found:', equipment);
    
    // Create booking
    console.log('Creating booking...');
    const bookingData = {
      equipmentId,
      fullName,
      email,
      phone,
      district,
      sector,
      cell,
      bookingDate: new Date(bookingDate),
      duration: parseInt(duration),
      message: message || '',
      status: 'pending',
      totalAmount: equipment.price * parseInt(duration),
    };
    console.log('Booking data:', bookingData);
    
    const booking = await Booking.create(bookingData);
    console.log('Booking created:', booking);
    
    return NextResponse.json({
      success: true,
      data: {
        booking: JSON.parse(JSON.stringify(booking)),
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}