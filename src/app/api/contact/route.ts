import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getAdminEmailTemplate, getUserAutoReplyTemplate } from '@/templates/email-template';

// Debug logging for environment variables
console.log('Debug - Environment Variables:', {
  EMAIL_USER_SET: typeof process.env.EMAIL_USER === 'string' && process.env.EMAIL_USER.length > 0,
  EMAIL_PASS_SET: typeof process.env.EMAIL_PASS === 'string' && process.env.EMAIL_PASS.length > 0,
  ADMIN_EMAIL_SET: typeof process.env.ADMIN_EMAIL === 'string' && process.env.ADMIN_EMAIL.length > 0,
  EMAIL_USER_LENGTH: process.env.EMAIL_USER?.length || 0,
  EMAIL_PASS_LENGTH: process.env.EMAIL_PASS?.length || 0
});

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true // Enable debug logging
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

export async function POST(request: NextRequest) {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('Environment check:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasAdminEmail: !!process.env.ADMIN_EMAIL
    });

    const { fullName, email, subject, message } = await request.json();

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Log form data (excluding sensitive info)
    console.log('Form submission received:', {
      fullName,
      email,
      subject,
      messageLength: message.length
    });

    // Generate beautiful email HTML using our template
    const adminEmailHtml = getAdminEmailTemplate(fullName, email, subject, message);

    // Email content for admin notification
    const mailOptions = {
      from: `"Thrive Africa Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // Admin's email address
      subject: `New Contact: ${subject}`,
      html: adminEmailHtml
    };

    try {
      // Send email to admin
      console.log('Attempting to send admin notification...');
      await transporter.sendMail(mailOptions);
      console.log('Admin notification sent successfully');

      // Generate auto-reply email HTML
      const userEmailHtml = getUserAutoReplyTemplate(fullName, subject, message);

      // Send auto-reply to user
      const autoReplyOptions = {
        from: `"Thrive Africa Tractor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting Thrive Africa Tractor',
        html: userEmailHtml
      };

      console.log('Attempting to send auto-reply...');
      await transporter.sendMail(autoReplyOptions);
      console.log('Auto-reply sent successfully');

    } catch (emailError: any) {
      console.error('Nodemailer error:', {
        name: emailError?.name,
        message: emailError?.message,
        code: emailError?.code,
        command: emailError?.command
      });
      throw emailError;
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error: any) {
    console.error('Contact form error:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}