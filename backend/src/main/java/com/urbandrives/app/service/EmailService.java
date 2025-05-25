package com.urbandrives.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public boolean sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("your_email@gmail.com");  // Must be your Gmail address
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
            return true;
        } catch (MailException e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
            return false;
        }
    }



    public void sendBookingConfirmationEmail(String recipientEmail, String customerName,
                                             String carDetails, String startDate, String endDate,
                                             String totalAmount, Long bookingId) {
        String subject = "UrbanDrives: Your Booking #" + bookingId + " is Confirmed!";
        String body = String.format(
                "Dear %s,\n\n" +
                        "Thank you for booking with UrbanDrives!\n\n" +
                        "Your booking details are as follows:\n" +
                        "Car: %s\n" +
                        "Pickup Date: %s\n" +
                        "Return Date: %s\n" +
                        "Total Amount: KES %s\n" +
                        "Booking ID: %d\n\n" +
                        "We look forward to serving you!\n\n" +
                        "Best regards,\n" +
                        "The UrbanDrives Team",
                customerName, carDetails, startDate, endDate, totalAmount, bookingId
        );
        sendSimpleEmail(recipientEmail, subject, body);
    }

    public void sendBookingCancellationEmail(String recipientEmail, String customerName, Long bookingId) {
        String subject = "UrbanDrives: Your Booking #" + bookingId + " Has Been Cancelled";
        String body = String.format(
                "Dear %s,\n\n" +
                        "This is to inform you that your booking with UrbanDrives (Booking ID: %d) has been cancelled.\n" +
                        "If you did not initiate this cancellation or have any questions, please contact us immediately.\n\n" +
                        "Thank you,\n" +
                        "The UrbanDrives Team",
                customerName, bookingId
        );
        sendSimpleEmail(recipientEmail, subject, body);
    }
}
