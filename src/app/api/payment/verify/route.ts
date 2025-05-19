// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/booking';
import { verifyPayment } from '@/lib/utils/payment';
import { sendEmail } from '@/lib/utils/email';

interface BookingDocument {
  _id: string;
  status: string;
  fullName: string;
  equipmentId: {
    name: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { transactionId, transactionRef } = await request.json();
    
    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    
    // Verify payment
    const verificationResponse = await verifyPayment(transactionId);
    
    if (verificationResponse.status !== 'success') {
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed',
        data: verificationResponse,
      });
    }
    
    // Extract booking ID from transaction reference
    // Assuming the format is "txRef-bookingId"
    const bookingId = verificationResponse.data.tx_ref.split('-').pop();
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction reference' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: 'paid',
        paymentId: transactionId,
      },
      { new: true }
    )
    .populate('equipmentId')
    .lean() as BookingDocument;
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thriveafrica.com';
    
    await sendEmail({
      to: adminEmail,
      subject: 'New Payment Received',
      html: `
        <h1>New Payment Received</h1>
        <p>A new payment has been received for booking ID: ${booking._id}</p>
        <h2>Payment Details</h2>
        <ul>
          <li><strong>Transaction ID:</strong> ${transactionId}</li>
          <li><strong>Amount:</strong> ${verificationResponse.data.amount} ${verificationResponse.data.currency}</li>
          <li><strong>Customer:</strong> ${booking.fullName}</li>
          <li><strong>Equipment:</strong> ${(booking.equipmentId as any).name}</li>
        </ul>
        <p>Please log in to the admin dashboard to manage this booking.</p>
      `,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        status: 'paid',
        booking: {
          id: booking._id,
          status: booking.status,
        },
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}