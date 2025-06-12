// src/actions/booking.ts
'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb/index';
import Booking from '@/models/booking';
import Equipment from '@/models/equipment';
import { IEquipment } from '@/models/equipment';
import { sendEmail } from '@/lib/utils/email';
import { IBooking } from '@/models/booking';
import { getBookingConfirmationTemplate, getBookingCancellationTemplate } from '@/templates/booking-email-templates';

export async function createBooking(data: {
  fullName: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  cell: string;
  idNumber: string;
  bookingDate: string;
  equipmentId: string;
  duration: number;
}) {
  try {
    await dbConnect();
    
    // Check if equipment exists and is available
    const equipment = await Equipment.findById(data.equipmentId).lean() as IEquipment;
    
    if (!equipment || !equipment.isAvailable) {
      throw new Error('Equipment is not available for booking');
    }
    
    // Calculate total amount
    const totalAmount = equipment.price * data.duration;
    
    // Create booking
    const newBooking = await Booking.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      district: data.district,
      sector: data.sector,
      cell: data.cell,
      idNumber: data.idNumber,
      bookingDate: new Date(data.bookingDate),
      equipmentId: data.equipmentId,
      duration: data.duration,
      totalAmount,
      status: 'pending',
    });
    
    revalidatePath('/admin/bookings');
    
    return JSON.parse(JSON.stringify(newBooking));
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw new Error('Failed to create booking');
  }
}

export async function getBookingById(id: string) {
  try {
    await dbConnect();
    const booking = await Booking.findById(id).lean();
    
    if (!booking) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(booking));
  } catch (error) {
    console.error('Failed to fetch booking by ID:', error);
    throw new Error('Failed to fetch booking details');
  }
}

export async function getBookings(status?: string) {
  try {
    await dbConnect();
    
    let query = Booking.find();
    
    if (status) {
      query = query.find({ status });
    }
    
    const bookings = await query
      .sort({ createdAt: -1 })
      .populate('equipmentId')
      .lean();
    
    // Force a fresh copy of the data
    const freshBookings = JSON.parse(JSON.stringify(bookings));
    
    // Add cache control headers
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Surrogate-Control', 'no-store');
    
    return freshBookings;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    throw new Error('Failed to fetch bookings');
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    // Check email configuration first
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration is missing:', {
        host: !!process.env.EMAIL_HOST,
        user: !!process.env.EMAIL_USER,
        password: !!process.env.EMAIL_PASS
      });
      throw new Error('Email configuration is not properly set up');
    }

    await dbConnect();
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('equipmentId').lean() as IBooking & { equipmentId: { name: string } };

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if email exists before sending
    if (!booking.email) {
      console.error('No email found for booking:', id);
      throw new Error('Booking email is required for notifications');
    }

    const emailData = {
      fullName: booking.fullName,
      equipmentName: booking.equipmentId.name,
      bookingDate: new Date(booking.bookingDate),
      duration: booking.duration,
      district: booking.district,
      sector: booking.sector,
      cell: booking.cell,
      totalAmount: booking.totalAmount
    };

    try {
      if (status === 'confirmed') {
        // Send confirmation email to customer
        await sendEmail({
          to: booking.email,
          subject: 'Booking Confirmed - Thrive Africa Tractor',
          html: getBookingConfirmationTemplate(emailData),
        });
      } else if (status === 'cancelled') {
        // Send cancellation email to customer
        await sendEmail({
          to: booking.email,
          subject: 'Booking Cancelled - Thrive Africa Tractor',
          html: getBookingCancellationTemplate(emailData),
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't throw here, we still want to update the booking status
      // Just log the error and continue
    }
    
    revalidatePath('/admin/bookings');
    
    return JSON.parse(JSON.stringify(booking));
  } catch (error) {
    console.error('Failed to update booking status:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update booking status');
  }
}