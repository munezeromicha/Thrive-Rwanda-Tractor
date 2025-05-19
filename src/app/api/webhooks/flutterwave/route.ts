// src/app/api/webhooks/flutterwave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/booking';
import { IBooking } from '@/models/booking';
import { sendEmail } from '@/lib/utils/email';

// Verify webhook signature
function verifyWebhookSignature(
  secretHash: string,
  signature: string,
  requestBody: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secretHash)
    .update(requestBody)
    .digest('hex');
  
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('verif-hash') || '';
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || '';
    
    // Verify the webhook signature
    const isValid = verifyWebhookSignature(
      secretHash,
      signature,
      JSON.stringify(body)
    );
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    // Process the webhook event
    const { event, data } = body;
    
    // Check if it's a successful charge
    if (event === 'charge.completed' && data.status === 'successful') {
      await dbConnect();
      
      // Extract transaction reference and payment details
      const txRef = data.tx_ref;
      const transactionId = data.id;
      const amount = data.amount;
      const currency = data.currency;
      
      // Extract booking ID from the transaction reference
      // Assuming the format is "thrive-africa-timestamp-bookingId"
      const bookingId = txRef.split('-').pop();
      
      if (!bookingId) {
        return NextResponse.json(
          { error: 'Invalid transaction reference' },
          { status: 400 }
        );
      }
      
      // Update booking status
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          status: 'paid',
          paymentId: transactionId.toString(),
        },
        { new: true }
      )
      .populate('equipmentId')
      .lean() as IBooking;
      
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
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
            <li><strong>Amount:</strong> ${amount} ${currency}</li>
            <li><strong>Customer:</strong> ${booking.fullName}</li>
            <li><strong>Equipment:</strong> ${(booking.equipmentId as any).name}</li>
          </ul>
          <p>Please log in to the admin dashboard to manage this booking.</p>
        `,
      });
      
      return NextResponse.json({ success: true });
    }
    
    // For other events, just acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}