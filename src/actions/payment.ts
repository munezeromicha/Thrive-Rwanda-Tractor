// src/actions/payment.ts
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb/index';
import Booking from '@/models/booking';
import { IBooking } from '@/models/booking';
import Equipment from '@/models/equipment';
import { sendEmail } from '@/lib/utils/email';

export async function initiatePayment(data: {
  bookingId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
}) {
  try {
    await dbConnect();
    
    // Update booking with payment info
    const booking = await Booking.findByIdAndUpdate(
      data.bookingId,
      {
        status: data.status,
        paymentId: data.paymentId,
      },
      { new: true }
    ).populate('equipmentId').lean() as IBooking;
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    // Get admin email from environment variable
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thriveafrica.com';
    
    // Send email notification to admin
    await sendEmail({
      to: adminEmail,
      subject: 'New Equipment Booking',
      html: `
        <h1>New Equipment Booking</h1>
        <p>A new booking has been made and payment has been completed.</p>
        <h2>Booking Details</h2>
        <ul>
          <li><strong>Equipment:</strong> ${(booking.equipmentId as any).name}</li>
          <li><strong>Customer:</strong> ${booking.fullName}</li>
          <li><strong>Location:</strong> ${booking.district}, ${booking.sector}, ${booking.cell}</li>
          <li><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</li>
          <li><strong>Payment Amount:</strong> ${data.amount} ${data.currency}</li>
          <li><strong>Payment ID:</strong> ${data.paymentId}</li>
        </ul>
        <p>Please log in to the admin dashboard to manage this booking.</p>
      `,
    });
    
    revalidatePath('/admin/bookings');
    
    return JSON.parse(JSON.stringify(booking));
  } catch (error) {
    console.error('Failed to process payment:', error);
    throw new Error('Failed to process payment');
  }
}

export async function getPaymentsByBookingId(bookingId: string) {
  try {
    await dbConnect();
    
    const booking = await Booking.findById(bookingId).lean() as IBooking;
    
    if (!booking || !booking.paymentId) {
      return null;
    }
    
    // In a real application, you might have a separate Payment model
    // This is a simplified approach
    return {
      id: booking.paymentId,
      bookingId: booking._id,
      status: booking.status,
      createdAt: booking.updatedAt,
    };
  } catch (error) {
    console.error('Failed to fetch payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}