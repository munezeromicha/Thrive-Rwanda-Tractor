// src/lib/utils/payment.ts
import axios from 'axios';
import crypto from 'crypto';

// Flutterwave API base URL
const API_BASE_URL = 'https://api.flutterwave.com/v3';

// Generate a unique transaction reference
export function generateTransactionRef(prefix = 'thriveafrica'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// Initialize payment
export async function initializePayment(data: {
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  tx_ref: string;
  redirect_url: string;
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to initialize payment:', error);
    throw new Error('Failed to initialize payment');
  }
}

// Verify payment
export async function verifyPayment(transactionId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to verify payment:', error);
    throw new Error('Failed to verify payment');
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  signature: string,
  payload: string,
  secretHash: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secretHash)
    .update(payload)
    .digest('hex');
  
  return hash === signature;
}

// Get payment status
export function getPaymentStatus(status: string): 'success' | 'failed' | 'pending' {
  // Map Flutterwave status to application status
  switch (status.toLowerCase()) {
    case 'successful':
      return 'success';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}

// Format amount with currency
export function formatAmount(amount: number, currency = 'RWF'): string {
  return `${amount.toLocaleString()} ${currency}`;
}