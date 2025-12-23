import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

export async function sendBookingInvoice(to: string, bookingDetails: any) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Booking Confirmation - Care.xyz',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Booking Invoice</h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
          <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
          <p><strong>Duration:</strong> ${bookingDetails.duration} hours</p>
          <p><strong>Total Cost:</strong> $${bookingDetails.totalCost}</p>
          <p><strong>Status:</strong> ${bookingDetails.status}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">Thank you for choosing Care.xyz!</p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
