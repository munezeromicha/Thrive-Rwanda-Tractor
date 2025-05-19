// src/templates/email-template.ts

/**
 * Admin Notification Email Template
 * Email sent to admin when a contact form is submitted
 */
export function getAdminEmailTemplate(fullName: string, email: string, subject: string, message: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #F7FEF9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #166534;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .message-box {
          background-color: #F7FEF9;
          border-left: 4px solid #166534;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 4px 4px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #666666;
          background-color: #F7FEF9;
          border-radius: 0 0 8px 8px;
        }
        .label {
          font-weight: 600;
          color: #166534;
        }
        .divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 25px 0;
        }
        .btn {
          display: inline-block;
          background-color: #166534;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          margin-top: 15px;
        }
        .info-box {
          background-color: #f3f3f3;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .priority-tag {
          display: inline-block;
          background-color: #fff2cc;
          color: #856404;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        
        <div class="content">
          <div class="priority-tag">New Message</div>
          
          <div class="info-box">
            <p><span class="label">From:</span> ${fullName} (${email})</p>
            <p><span class="label">Subject:</span> ${subject}</p>
            <p><span class="label">Date:</span> ${new Date().toLocaleString()}</p>
          </div>
          
          <p><span class="label">Message Content:</span></p>
          <div class="message-box">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div class="divider"></div>
          
          <p>You can respond directly to this email to get in touch with the sender.</p>
          
          <a href="mailto:${email}" class="btn">Reply to ${fullName}</a>
        </div>
        
        <div class="footer">
          <p>This message was sent from the contact form on Thrive Africa Tractor Platform.</p>
          <p>&copy; ${new Date().getFullYear()} Thrive Africa Tractor. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
  
  /**
   * Auto-Reply Email Template
   * Email sent to the user when they submit the contact form
   */
  export function getUserAutoReplyTemplate(fullName: string, subject: string, message: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting Thrive Africa Tractor</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #F7FEF9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #166534;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .logo {
          margin-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .message-box {
          background-color: #F7FEF9;
          border-left: 4px solid #166534;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 4px 4px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #666666;
          background-color: #F7FEF9;
          border-radius: 0 0 8px 8px;
        }
        .label {
          font-weight: 600;
          color: #166534;
        }
        .divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 25px 0;
        }
        .btn {
          display: inline-block;
          background-color: #166534;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
        }
        .info-section {
          margin-top: 30px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-top: 20px;
        }
        .contact-item {
          flex-basis: 48%;
          margin-bottom: 15px;
        }
        .social-links {
          margin-top: 20px;
          text-align: center;
        }
        .social-icon {
          display: inline-block;
          margin: 0 10px;
          color: #166534;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <!-- Logo can be added here -->
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 2C12.318 2 2 12.318 2 25C2 37.682 12.318 48 25 48C37.682 48 48 37.682 48 25C48 12.318 37.682 2 25 2Z" fill="#F7FEF9"/>
              <path d="M18 15C18 13.343 19.343 12 21 12H29C30.657 12 32 13.343 32 15V35C32 36.657 30.657 38 29 38H21C19.343 38 18 36.657 18 35V15Z" fill="#166534"/>
              <path d="M18 22H32" stroke="#F7FEF9" stroke-width="2" stroke-linecap="round"/>
              <path d="M18 28H32" stroke="#F7FEF9" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h1>Thank You for Contacting Us!</h1>
        </div>
        
        <div class="content">
          <p>Dear ${fullName},</p>
          
          <p>Thank you for reaching out to Thrive Africa Tractor. We have received your message and appreciate your interest in our platform.</p>
          
          <p>A member of our team will review your inquiry and get back to you as soon as possible.</p>
          
          <p>Here's a copy of your message:</p>
          
          <p><span class="label">Subject:</span> ${subject}</p>
          
          <div class="message-box">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div class="divider"></div>
          
          <p>While you wait for our response, feel free to explore our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://thriveafrica.com'}/equipment" style="color: #166534; text-decoration: underline;">equipment catalog</a> or check out our frequently asked questions.</p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://thriveafrica.com'}/faqs" class="btn">View FAQs</a>
          </div>
          
          <div class="info-section">
            <p><strong>Our Contact Information:</strong></p>
            
            <div class="contact-info">
              <div class="contact-item">
                <p><span class="label">Phone:</span></p>
                <p>+250 78 123 4567</p>
              </div>
              
              <div class="contact-item">
                <p><span class="label">Email:</span></p>
                <p>info@thriveafrica.com</p>
              </div>
              
              <div class="contact-item">
                <p><span class="label">Address:</span></p>
                <p>KG 123 Street, Kacyiru, Kigali, Rwanda</p>
              </div>
              
              <div class="contact-item">
                <p><span class="label">Working Hours:</span></p>
                <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>Best regards,</p>
          <p><strong>Thrive Africa Tractor Team</strong></p>
          
          <div class="social-links">
            <a href="#" class="social-icon">Facebook</a> |
            <a href="#" class="social-icon">Twitter</a> |
            <a href="#" class="social-icon">Instagram</a>
          </div>
          
          <p>&copy; ${new Date().getFullYear()} Thrive Africa Tractor. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }