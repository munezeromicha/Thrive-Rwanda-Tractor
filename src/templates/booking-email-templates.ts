 // src/templates/booking-email-templates.ts

interface BookingEmailData {
    fullName: string;
    equipmentName: string;
    bookingDate: Date;
    duration: number;
    district: string;
    sector: string;
    cell: string;
    totalAmount: number;
  }
  
  export function getBookingConfirmationTemplate(data: BookingEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - Thrive Africa Tractor</title>
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
        .booking-details {
          background-color: #F7FEF9;
          border: 1px solid #166534;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #166534;
        }
        .value {
          color: #333;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #666666;
          background-color: #F7FEF9;
          border-radius: 0 0 8px 8px;
        }
        .status-badge {
          display: inline-block;
          background-color: #dcfce7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .total-amount {
          font-size: 24px;
          color: #166534;
          text-align: center;
          margin: 20px 0;
        }
        .contact-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
        </div>
        
        <div class="content">
          <div class="status-badge">Confirmed</div>
          
          <p>Dear ${data.fullName},</p>
          
          <p>Great news! Your equipment booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="label">Equipment:</span>
              <span class="value">${data.equipmentName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking Date:</span>
              <span class="value">${data.bookingDate.toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span class="value">${data.duration} day(s)</span>
            </div>
            <div class="detail-row">
              <span class="label">Location:</span>
              <span class="value">${data.district}, ${data.sector}, ${data.cell}</span>
            </div>
          </div>
  
          <div class="total-amount">
            <div class="label">Total Amount:</div>
            <div>${data.totalAmount.toLocaleString()} RWF</div>
          </div>
  
          <div class="contact-info">
            <p><strong>Need help?</strong></p>
            <p>If you have any questions or need to make changes to your booking, please contact us:</p>
            <p>📞 Phone: +250 78 123 4567</p>
            <p>📧 Email: support@thriveafrica.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Thrive Africa Tractor!</p>
          <p>&copy; ${new Date().getFullYear()} Thrive Africa Tractor. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
  
  export function getBookingCancellationTemplate(data: BookingEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Cancellation - Thrive Africa Tractor</title>
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
          background-color: #991b1b;
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
        .booking-details {
          background-color: #fef2f2;
          border: 1px solid #991b1b;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #991b1b;
        }
        .value {
          color: #333;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #666666;
          background-color: #fef2f2;
          border-radius: 0 0 8px 8px;
        }
        .status-badge {
          display: inline-block;
          background-color: #fee2e2;
          color: #991b1b;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .new-booking-btn {
          display: inline-block;
          background-color: #166534;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 500;
          margin-top: 20px;
        }
        .contact-info {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancellation Notice</h1>
        </div>
        
        <div class="content">
          <div class="status-badge">Cancelled</div>
          
          <p>Dear ${data.fullName},</p>
          
          <p>We regret to inform you that your equipment booking has been cancelled. Here are the details of the cancelled booking:</p>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="label">Equipment:</span>
              <span class="value">${data.equipmentName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking Date:</span>
              <span class="value">${data.bookingDate.toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Duration:</span>
              <span class="value">${data.duration} day(s)</span>
            </div>
            <div class="detail-row">
              <span class="label">Location:</span>
              <span class="value">${data.district}, ${data.sector}, ${data.cell}</span>
            </div>
          </div>
  
          <p>If you would like to make a new booking, please visit our website:</p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://thriveafrica.com'}/equipment" class="new-booking-btn">
              Browse Equipment
            </a>
          </div>
  
          <div class="contact-info">
            <p><strong>Questions?</strong></p>
            <p>If you have any questions about this cancellation, please contact our support team:</p>
            <p>📞 Phone: +250 783 692 429</p>
            <p>📧 Email: support@thriveafrica.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p>We hope to serve you again soon!</p>
          <p>&copy; ${new Date().getFullYear()} Thrive Africa Tractor. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }