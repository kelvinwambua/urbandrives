package com.urbandrives.app.service;
import java.awt.Color;
// OpenPDF imports
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import com.urbandrives.app.entity.Booking;
import org.springframework.stereotype.Service; // Note: No @Autowired EmailService needed here if not using HTML

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {




    public byte[] generateBookingConfirmationPdf(Booking booking) throws IOException {
        if (booking == null || booking.getCar() == null) {
            throw new IllegalArgumentException("Booking or Car details are missing for PDF generation.");
        }

        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos); // Get a PdfWriter instance
            document.open(); // Open the document for writing

            // Define Fonts
            Font fontHeader = new Font(Font.HELVETICA, 24, Font.BOLD, Color.BLUE); // You can use com.lowagie.text.Color
            Font fontSubHeader = new Font(Font.HELVETICA, 18, Font.BOLD, Color.DARK_GRAY);
            Font fontBold = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font fontNormal = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Font fontSmall = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.GRAY);
            Font fontTotalAmount = new Font(Font.HELVETICA, 16, Font.BOLD, Color.GREEN);

            // --- Header ---
            Paragraph title = new Paragraph("Urbandrives - Booking Confirmation", fontHeader);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // --- Booking ID ---
            Paragraph bookingIdPara = new Paragraph("Booking ID: #" + booking.getId(), fontSubHeader);
            bookingIdPara.setAlignment(Element.ALIGN_LEFT);
            bookingIdPara.setSpacingAfter(10);
            document.add(bookingIdPara);

            // --- Booking Date ---
            Paragraph bookingDatePara = new Paragraph("Booking Date: " + booking.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm")), fontNormal);
            bookingDatePara.setAlignment(Element.ALIGN_LEFT);
            bookingDatePara.setSpacingAfter(20);
            document.add(bookingDatePara);


            // --- Customer Details Table ---
            document.add(new Paragraph("Customer Details:", fontSubHeader));
            document.add(new Paragraph(" ", fontNormal)); // Small space

            PdfPTable customerTable = new PdfPTable(2); // 2 columns
            customerTable.setWidthPercentage(100);
            customerTable.setSpacingBefore(10f);
            customerTable.setSpacingAfter(20f);
            float[] customerColWidths = {2f, 3f}; // Ratio of column widths
            customerTable.setWidths(customerColWidths);

            addTableCell(customerTable, "Name:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(customerTable, booking.getCustomerName(), fontNormal, Element.ALIGN_RIGHT, 0);
            addTableCell(customerTable, "Email:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(customerTable, booking.getCustomerEmail(), fontNormal, Element.ALIGN_RIGHT, 0);
            addTableCell(customerTable, "Phone:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(customerTable, (booking.getCustomerPhone() != null && !booking.getCustomerPhone().isEmpty() ? booking.getCustomerPhone() : "N/A"), fontNormal, Element.ALIGN_RIGHT, 0);

            document.add(customerTable);


            // --- Car Details Table ---
            document.add(new Paragraph("Car Details:", fontSubHeader));
            document.add(new Paragraph(" ", fontNormal)); // Small space

            PdfPTable carTable = new PdfPTable(2);
            carTable.setWidthPercentage(100);
            carTable.setSpacingBefore(10f);
            carTable.setSpacingAfter(20f);
            float[] carColWidths = {2f, 3f};
            carTable.setWidths(carColWidths);

            addTableCell(carTable, "Make:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(carTable, booking.getCar().getMake(), fontNormal, Element.ALIGN_RIGHT, 0);
            addTableCell(carTable, "Model:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(carTable, booking.getCar().getModel(), fontNormal, Element.ALIGN_RIGHT, 0);
            addTableCell(carTable, "License Plate:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(carTable, booking.getCar().getLicensePlate(), fontNormal, Element.ALIGN_RIGHT, 0);
            addTableCell(carTable, "Daily Rate:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(carTable, "Ksh " + booking.getCar().getDailyRate().toPlainString(), fontNormal, Element.ALIGN_RIGHT, 0);

            document.add(carTable);


            // --- Rental Details Table ---
            document.add(new Paragraph("Rental Details:", fontSubHeader));
            document.add(new Paragraph(" ", fontNormal)); // Small space

            PdfPTable rentalTable = new PdfPTable(2);
            rentalTable.setWidthPercentage(100);
            rentalTable.setSpacingBefore(10f);
            rentalTable.setSpacingAfter(20f);
            float[] rentalColWidths = {2f, 3f};
            rentalTable.setWidths(rentalColWidths);

            addTableCell(rentalTable, "Start Date:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(rentalTable, booking.getStartDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), fontNormal, Element.ALIGN_RIGHT, 0);
            addTableCell(rentalTable, "End Date:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(rentalTable, booking.getEndDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), fontNormal, Element.ALIGN_RIGHT, 0);
            addTableCell(rentalTable, "Current Status:", fontBold, Element.ALIGN_LEFT, 0);
            addTableCell(rentalTable, booking.getStatus().name(), fontNormal, Element.ALIGN_RIGHT, 0);

            document.add(rentalTable);


            // --- Total Amount ---
            Paragraph totalAmountPara = new Paragraph("Total Amount: Ksh " + booking.getTotalAmount().toPlainString(), fontTotalAmount);
            totalAmountPara.setAlignment(Element.ALIGN_RIGHT);
            totalAmountPara.setSpacingBefore(30);
            document.add(totalAmountPara);


            // --- Footer ---
            Paragraph footer = new Paragraph("Thank you for choosing Urbandrives. We look forward to serving you!", fontSmall);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(50);
            document.add(footer);

            Paragraph contact = new Paragraph("Contact us at support@urbandrives.com", fontSmall);
            contact.setAlignment(Element.ALIGN_CENTER);
            document.add(contact);


        } catch (Exception e) {
            System.err.println("Error generating PDF with OpenPDF: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to generate PDF for booking ID: " + booking.getId(), e);
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }
        return baos.toByteArray();
    }

    // Helper method to add a cell to a table
    private void addTableCell(PdfPTable table, String text, Font font, int alignment, int border) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(5);
        cell.setBorder(border); // No border
        table.addCell(cell);
    }
}