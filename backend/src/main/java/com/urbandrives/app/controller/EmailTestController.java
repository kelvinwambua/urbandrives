package com.urbandrives.app.controller;

import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.entity.CarStatus;
import com.urbandrives.app.service.EmailService;
import com.urbandrives.app.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/test/receipts")
public class EmailTestController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private EmailService emailService;

    private Booking createDummyBooking() {
        Car dummyCar = new Car();
        dummyCar.setId(999L);
        dummyCar.setMake("Test Make");
        dummyCar.setModel("Test Model");
        dummyCar.setLicensePlate("TEST-123");
        dummyCar.setDailyRate(BigDecimal.valueOf(50.00));
        dummyCar.setLocation("Nairobi");
        dummyCar.setYear(2023);
        dummyCar.setColor("Red");
        dummyCar.setImageUrl("https://example.com/test_car.jpg");
        dummyCar.setStatus(CarStatus.AVAILABLE);

        Booking dummyBooking = new Booking();
        dummyBooking.setId(12345L);
        dummyBooking.setCar(dummyCar);
        dummyBooking.setCustomerName("Test User");
        dummyBooking.setCustomerEmail("test email.com");
        dummyBooking.setCustomerPhone("+254700123456");
        dummyBooking.setStartDate(LocalDateTime.now().plusDays(1).toLocalDate());
        dummyBooking.setEndDate(LocalDateTime.now().plusDays(3).toLocalDate());
        dummyBooking.setTotalAmount(BigDecimal.valueOf(150.00));
        dummyBooking.setStatus(BookingStatus.CONFIRMED);
        dummyBooking.setNotes("This is a dummy test booking.");
        dummyBooking.setCreatedAt(LocalDateTime.now());
        dummyBooking.setUpdatedAt(LocalDateTime.now());

        return dummyBooking;
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadPdfReceipt() {
        Booking dummyBooking = createDummyBooking();
        byte[] pdfBytes;
        try {
            pdfBytes = pdfService.generateBookingConfirmationPdf(dummyBooking);
        } catch (IOException e) {
            e.printStackTrace();

            String errorMessage = "Failed to generate PDF receipt: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorMessage.getBytes(StandardCharsets.UTF_8));

        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String filename = "test_receipt_" + dummyBooking.getId() + ".pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendPdfReceiptEmail(@RequestParam String recipientEmail) {
        Booking dummyBooking = createDummyBooking();
        dummyBooking.setCustomerEmail(recipientEmail);

        try {
            byte[] pdfBytes = pdfService.generateBookingConfirmationPdf(dummyBooking);

            emailService.sendBookingConfirmationEmail(
                    dummyBooking.getCustomerEmail(),
                    dummyBooking.getCustomerName(),
                    dummyBooking.getCar().getMake() + " " + dummyBooking.getCar().getModel() + " (" + dummyBooking.getCar().getLicensePlate() + ")",
                    dummyBooking.getStartDate().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yy HH:mm")),
                    dummyBooking.getEndDate().format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yy HH:mm")),
                    dummyBooking.getTotalAmount().toPlainString(),
                    dummyBooking.getId(),
                    pdfBytes,
                    "UrbanDrives_TestReceipt_" + dummyBooking.getId() + ".pdf",
                    "application/pdf"
            );

            return ResponseEntity.ok("Test PDF receipt email sent successfully to " + recipientEmail);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send test PDF receipt email: " + e.getMessage());
        }
    }
}