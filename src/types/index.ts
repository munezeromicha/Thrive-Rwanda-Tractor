// src/types/index.ts
import { NextRequest } from 'next/server';
import { IUser } from '@/models/user';
import { IEquipment } from '@/models/equipment';
import { IBooking } from '@/models/booking';

// Server response type
export interface ServerResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

// Equipment types
export interface EquipmentInput {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface EquipmentResponse extends IEquipment {}

export interface EquipmentListResponse {
  equipment: EquipmentResponse[];
  totalCount: number;
  page: number;
  limit: number;
}

// Booking types
export interface BookingInput {
  equipmentId: string;
  fullName: string;
  district: string;
  sector: string;
  village: string;
  idNumber: string;
  bookingDate: Date | string;
}

export interface BookingResponse extends Omit<IBooking, 'equipmentId'> {
  equipmentId: EquipmentResponse;
}

export interface BookingListResponse {
  bookings: BookingResponse[];
  totalCount: number;
  page: number;
  limit: number;
}

// Payment types
export interface PaymentInput {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  redirectUrl: string;
}

export interface PaymentResponse {
  status: 'success' | 'failed' | 'pending';
  message: string;
  data?: {
    link?: string;
    transactionId?: string;
    reference?: string;
  };
}

export interface WebhookEvent {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: string;
    payment_type: string;
    created_at: string;
    customer: {
      id: number;
      name: string;
      email: string;
      phone_number: string;
    };
  };
}

// Middleware context
export interface MiddlewareContext {
  req: NextRequest;
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Search params
export interface SearchParams extends PaginationParams {
  q?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}