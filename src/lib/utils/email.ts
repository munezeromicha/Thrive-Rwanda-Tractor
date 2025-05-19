// src/lib/utils/email.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Validate email configuration
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration is missing:', {
      host: !!process.env.EMAIL_HOST,
      user: !!process.env.EMAIL_USER,
      password: !!process.env.EMAIL_PASS
    });
    throw new Error('Email configuration is not properly set up');
  }

  // Configure transport options
  const transportOptions = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  console.log('Initializing email transport with options:', {
    host: transportOptions.host,
    port: transportOptions.port,
    secure: transportOptions.secure,
    authUser: transportOptions.auth.user ? '✓ Set' : '✗ Missing',
    authPass: transportOptions.auth.pass ? '✓ Set' : '✗ Missing'
  });
  
  // Create transporter
  const transporter = nodemailer.createTransport(transportOptions);
  
  // Verify transporter configuration
  try {
    await transporter.verify();
    console.log('Email transporter verified successfully');
  } catch (verifyError) {
    console.error('Email transporter verification failed:', verifyError);
    throw new Error('Failed to verify email configuration');
  }
  
  // Send email
  try {
    console.log('Attempting to send email to:', to);
    const info = await transporter.sendMail({
      from: `"Thrive Africa Tractor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });
    
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw new Error('Failed to send email notification');
  }
}