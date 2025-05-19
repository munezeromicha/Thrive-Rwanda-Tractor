// src/models/booking.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  equipmentId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  cell: string;
  status: 'pending' | 'paid' | 'confirmed' | 'completed' | 'cancelled';
  paymentId?: string;
  bookingDate: Date;
  duration: number;
  message?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    sector: { type: String, required: true },
    cell: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'confirmed', 'completed', 'cancelled'], 
      default: 'pending' 
    },
    paymentId: { type: String },
    bookingDate: { type: Date, required: true },
    duration: { type: Number, required: true, min: 1 },
    message: { type: String },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);