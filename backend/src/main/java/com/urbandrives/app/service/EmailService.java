package com.urbandrives.app.service;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${urbandrives.email.from}")
    private String fromEmail;

    // This method is now adjusted to accept attachment parameters
    public boolean sendHtmlEmail(String to, String subject, String htmlContent,
                                 byte[] attachmentBytes, String attachmentFileName, String attachmentContentType) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true indicates multipart message (for attachment), StandardCharsets.UTF_8 for encoding
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            // Add the PDF attachment if bytes are provided
            if (attachmentBytes != null && attachmentBytes.length > 0) {
                ByteArrayDataSource dataSource = new ByteArrayDataSource(attachmentBytes, attachmentContentType);
                helper.addAttachment(attachmentFileName, dataSource);
            }

            mailSender.send(message);
            System.out.println("HTML email with attachment (if any) sent successfully to: " + to);
            return true;
        } catch (Exception e) {
            System.err.println("Error sending HTML email to " + to + ": " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }


    public void sendBookingConfirmationEmail(String recipientEmail, String customerName,
                                             String carDetails, String startDate, String endDate,
                                             String totalAmount, Long bookingId,
                                             byte[] attachmentBytes, // NEW: PDF bytes
                                             String attachmentFileName, // NEW: PDF filename
                                             String attachmentContentType // NEW: PDF content type
    ) {
        String subject = "UrbanDrives: Your Booking #" + bookingId + " is Confirmed!";
        String htmlBody = createBookingConfirmationHtml(customerName, carDetails, startDate, endDate, totalAmount, bookingId);


        sendHtmlEmail(recipientEmail, subject, htmlBody,
                attachmentBytes, attachmentFileName, attachmentContentType);
    }


    public void sendBookingCancellationEmail(String recipientEmail, String customerName, Long bookingId) {
        String subject = "UrbanDrives: Your Booking #" + bookingId + " Has Been Cancelled";
        String htmlBody = createBookingCancellationHtml(customerName, bookingId);

        sendHtmlEmail(recipientEmail, subject, htmlBody, null, null, null); // No attachment for cancellation by default
    }


    public String createBookingConfirmationHtml(String customerName, String carDetails,
                                                String startDate, String endDate,
                                                String totalAmount, Long bookingId) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation - UrbanDrives</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f8fafc;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                        padding: 30px;
                        text-align: center;
                        color: white;
                    }
                    .logo {
                        width: 150px;
                        height: auto;
                        margin-bottom: 15px;
                    }
                    .header h1 {
                        font-size: 24px;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #1f2937;
                        margin-bottom: 20px;
                    }
                    .booking-card {
                        background-color: #f8fafc;
                        border-radius: 8px;
                        padding: 25px;
                        margin: 25px 0;
                        border-left: 4px solid #3b82f6;
                    }
                    .booking-id {
                        background-color: #3b82f6;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: 600;
                        display: inline-block;
                        margin-bottom: 20px;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #374151;
                    }
                    .detail-value {
                        color: #1f2937;
                        text-align: right;
                    }
                    .total-amount {
                        background-color: #10b981;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 6px;
                        font-size: 18px;
                        font-weight: 700;
                        text-align: center;
                        margin: 20px 0;
                    }
                    .footer {
                        background-color: #1f2937;
                        color: #9ca3af;
                        padding: 25px 30px;
                        text-align: center;
                        font-size: 14px;
                    }
                    .footer-logo {
                        width: 100px;
                        height: auto;
                        margin-bottom: 15px;
                        filter: brightness(0) invert(1);
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <img src="https://pid5zlmxou.ufs.sh/f/JyQemEOsK8SFAxsGw3aLT5u6yKjrMWohw1i84pv72fNIbgse" alt="UrbanDrives Logo" class="logo">
                        <h1>Booking Confirmed! 🎉</h1>
                        <p>Your car rental is all set</p>
                    </div>

                    <div class="content">
                        <div class="greeting">
                            Hello %s! 
                        </div>

                        <p>Thank you for choosing UrbanDrives! We're excited to serve you. Here are your booking details:</p>

                        <div class="booking-card">
                            <div class="booking-id">Booking #%d</div>

                            <div class="detail-row">
                                <span class="detail-label">Vehicle:</span>
                                <span class="detail-value">%s</span>
                            </div>

                            <div class="detail-row">
                                <span class="detail-label"> Pickup Date:</span>
                                <span class="detail-value">%s</span>
                            </div>

                            <div class="detail-row">
                                <span class="detail-label"> Return Date:</span>
                                <span class="detail-value">%s</span>
                            </div>
                        </div>

                        <div class="total-amount">
                            Total Amount: KES %s
                        </div>

                        <p style="color: #6b7280; margin-top: 20px;">
                            Please keep this email for your records. If you have any questions or need to make changes to your booking,
                            don't hesitate to contact us.
                        </p>

                        <p style="margin-top: 20px; font-weight: 600;">
                            We look forward to providing you with an excellent driving experience! 🚙
                        </p>
                    </div>

                    <div class="footer">
                        <img src="https://pid5zlmxou.ufs.sh/f/JyQemEOsK8SFAxsGw3aLT5u6yKjrMWohw1i84pv72fNIbgse" alt="UrbanDrives" class="footer-logo">
                        <p><strong>UrbanDrives</strong> - Find, book and rent a car easily</p>
                        <p style="margin-top: 5px;">Need help? Contact us anytime</p>
                    </div>
                </div>
            </body>
            </html>
            """, customerName, bookingId, carDetails, startDate, endDate, totalAmount);
    }

    public String createBookingCancellationHtml(String customerName, Long bookingId) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Cancelled - UrbanDrives</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f8fafc;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #ef4444, #dc2626);
                        padding: 30px;
                        text-align: center;
                        color: white;
                    }
                    .logo {
                        width: 150px;
                        height: auto;
                        margin-bottom: 15px;
                        filter: brightness(0) invert(1);
                    }
                    .header h1 {
                        font-size: 24px;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #1f2937;
                        margin-bottom: 20px;
                    }
                    .cancellation-card {
                        background-color: #fef2f2;
                        border-radius: 8px;
                        padding: 25px;
                        margin: 25px 0;
                        border-left: 4px solid #ef4444;
                        text-align: center;
                    }
                    .booking-id {
                        background-color: #ef4444;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 16px;
                        font-weight: 600;
                        display: inline-block;
                        margin-bottom: 15px;
                    }
                    .footer {
                        background-color: #1f2937;
                        color: #9ca3af;
                        padding: 25px 30px;
                        text-align: center;
                        font-size: 14px;
                    }
                    .footer-logo {
                        width: 100px;
                        height: auto;
                        margin-bottom: 15px;
                        filter: brightness(0) invert(1);
                    }
                    .warning-box {
                        background-color: #fef3c7;
                        border: 1px solid #f59e0b;
                        border-radius: 6px;
                        padding: 15px;
                        margin: 20px 0;
                        color: #92400e;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <img src="https://pid5zlmxou.ufs.sh/f/JyQemEOsK8SFAxsGw3aLT5u6yKjrMWohw1i84pv72fNIbgse" alt="UrbanDrives Logo" class="logo">
                        <h1>Booking Cancelled</h1>
                        <p>Your reservation has been cancelled</p>
                    </div>

                    <div class="content">
                        <div class="greeting">
                            Hello %s,
                        </div>

                        <p>This is to inform you that your booking with UrbanDrives has been cancelled.</p>

                        <div class="cancellation-card">
                            <div class="booking-id">Booking #%d</div>
                            <p style="font-size: 18px; color: #7f1d1d;">
                                 <strong>Cancelled</strong>
                            </p>
                        </div>

                        <div class="warning-box">
                            <strong>⚠ Important:</strong> If you did not initiate this cancellation or have any questions about this cancellation,
                            please contact us immediately.
                        </div>

                        <p style="margin-top: 20px;">
                            If you need to make a new booking, you can easily do so through our website.
                            We're always here to help you find the perfect car for your needs.
                        </p>

                        <p style="margin-top: 20px; font-weight: 600;">
                            Thank you for choosing UrbanDrives.
                        </p>
                    </div>

                    <div class="footer">
                        <img src="https://pid5zlmxou.ufs.sh/f/JyQemEOsK8SFAxsGw3aLT5u6yKjrMWohw1i84pv72fNIbgse" alt="UrbanDrives" class="footer-logo">
                        <p><strong>UrbanDrives</strong> - Find, book and rent a car easily</p>
                        <p style="margin-top: 5px;">Need help? Contact us anytime</p>
                    </div>
                </div>
            </body>
            </html>
            """, customerName, bookingId);
    }
}