import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


export async function sendBookingInvoice(to: string, bookingDetails: any) {
    const bookingDate = bookingDetails.bookingDate 
        ? new Date(bookingDetails.bookingDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
        : new Date(bookingDetails.createdAt).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    
    const bookingTime = bookingDetails.bookingDate 
        ? new Date(bookingDetails.bookingDate).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
        : new Date(bookingDetails.createdAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

    const locationString = bookingDetails.location 
        ? `${bookingDetails.location.address || ''}, ${bookingDetails.location.area || ''}, ${bookingDetails.location.city || ''}, ${bookingDetails.location.district || ''}, ${bookingDetails.location.division || ''}`.replace(/^,\s*|,\s*$/g, '')
        : 'Not specified';

    const invoiceNumber = bookingDetails._id 
        ? (typeof bookingDetails._id === 'string' 
            ? bookingDetails._id.substring(0, 8).toUpperCase() 
            : bookingDetails._id.toString().substring(0, 8).toUpperCase())
        : 'N/A';
    const hourlyRate = bookingDetails.totalCost / bookingDetails.duration;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: `Booking Confirmation #${invoiceNumber} - Care.xyz`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Invoice - Care.xyz</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 20px 0;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Care.xyz
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #e9d5ff; font-size: 16px; font-weight: 400;">
                                Booking Confirmation Invoice
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Invoice Info -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; background-color: #ffffff;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Invoice Number
                                        </p>
                                        <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 18px; font-weight: 700; color: #7c3aed;">
                                            #${invoiceNumber}
                                        </p>
                                    </td>
                                    <td align="right" style="padding-bottom: 15px;">
                                        <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Booking Date
                                        </p>
                                        <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                                            ${bookingDate}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Status Badge -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <span style="display: inline-block; padding: 8px 16px; background-color: ${bookingDetails.status === 'Confirmed' ? '#d1fae5' : bookingDetails.status === 'Pending' ? '#fef3c7' : '#fee2e2'}; color: ${bookingDetails.status === 'Confirmed' ? '#065f46' : bookingDetails.status === 'Pending' ? '#92400e' : '#991b1b'}; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${bookingDetails.status}
                            </span>
                        </td>
                    </tr>

                    <!-- Service Details -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #f9fafb; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 8px;">
                                <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                                    Service Details
                                </h2>
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            Service Name:
                                        </td>
                                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">
                                            ${bookingDetails.serviceName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            Duration:
                                        </td>
                                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">
                                            ${bookingDetails.duration} ${bookingDetails.duration === 1 ? 'hour' : 'hours'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            Scheduled Time:
                                        </td>
                                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">
                                            ${bookingTime}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Location Details -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #f9fafb; border-left: 4px solid #9333ea; padding: 20px; border-radius: 8px;">
                                <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                                    Service Location
                                </h2>
                                <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.8;">
                                    ${locationString}
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Pricing Breakdown -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                                <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                                    Pricing Breakdown
                                </h2>
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">
                                            Hourly Rate
                                        </td>
                                        <td align="right" style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 500;">
                                            $${hourlyRate.toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">
                                            Duration
                                        </td>
                                        <td align="right" style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 500;">
                                            × ${bookingDetails.duration} ${bookingDetails.duration === 1 ? 'hour' : 'hours'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 15px 0 10px 0; border-top: 2px solid #e5e7eb;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 0; color: #1f2937; font-size: 18px; font-weight: 700;">
                                                        Total Amount
                                                    </td>
                                                    <td align="right" style="padding: 0; color: #7c3aed; font-size: 24px; font-weight: 700;">
                                                        $${bookingDetails.totalCost.toFixed(2)}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 8px;">
                                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                                    <strong>📋 Important:</strong> Your booking is currently <strong>${bookingDetails.status}</strong>. You will receive a confirmation email once your booking is approved by our team. Please keep this invoice for your records.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Thank you for choosing <strong style="color: #7c3aed;">Care.xyz</strong> for your care needs.
                            </p>
                            <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                                If you have any questions or need to modify your booking, please contact our support team.
                            </p>
                            <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 11px;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
