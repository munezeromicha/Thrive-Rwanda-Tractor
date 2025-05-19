// src/app/api/payment/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/booking';
import Equipment from '@/models/equipment';
import { generateTransactionRef, initializePayment } from '@/lib/utils/payment';
import { BookingResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, returnUrl } = await request.json();
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Get booking details
    const booking = await Booking.findById(bookingId).populate('equipmentId').lean() as BookingResponse;
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if booking is already paid
    if (booking.status === 'paid' || booking.status === 'confirmed' || booking.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Booking is already paid' },
        { status: 400 }
      );
    }
    
    // Get equipment details
    const equipment = booking.equipmentId as any;
    
    // Generate transaction reference
    const txRef = generateTransactionRef();
    
    // Build redirect URL
    const redirectUrl = returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`;
    
    // Initialize payment
    const response = await initializePayment({
      amount: equipment.price,
      currency: 'RWF',
      tx_ref: `${txRef}-${bookingId}`,
      redirect_url: redirectUrl,
      customer: {
        email: 'customer@thriveafrica.com', // Use actual customer email if available
        name: booking.fullName,
      },
      customizations: {
        title: 'Thrive Africa Tractor Platform',
        description: `Payment for ${equipment.name}`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
      },
    });
    
    // Return payment link
    return NextResponse.json({
      success: true,
      data: {
        paymentLink: response.data.link,
        reference: txRef,
      },
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}