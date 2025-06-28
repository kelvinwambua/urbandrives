package com.urbandrives.app.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import com.urbandrives.app.entity.Booking;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, BaseColor.BLUE);
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
    private static final Font SMALL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
    private static final Font TOTAL_AMOUNT_FONT = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.GREEN);

    public byte[] generateBookingConfirmationPdf(Booking booking) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();


            Paragraph title = new Paragraph("Urbandrives - Booking Confirmation", TITLE_FONT);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);


            Paragraph bookingIdPara = new Paragraph("Booking ID: #" + booking.getId(), SUBTITLE_FONT);
            bookingIdPara.setAlignment(Element.ALIGN_LEFT);
            bookingIdPara.setSpacingAfter(10);
            document.add(bookingIdPara);


            Paragraph bookingDatePara = new Paragraph("Booking Date: " +
                booking.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm")), NORMAL_FONT);
            bookingDatePara.setAlignment(Element.ALIGN_LEFT);
            bookingDatePara.setSpacingAfter(20);
            document.add(bookingDatePara);


            document.add(new Paragraph("Customer Details:", SUBTITLE_FONT));
            document.add(new Paragraph(" ", NORMAL_FONT));

            PdfPTable customerTable = new PdfPTable(2);
            customerTable.setWidthPercentage(100);
            customerTable.setSpacingBefore(10f);
            customerTable.setSpacingAfter(20f);
            float[] customerColWidths = {2f, 3f};
            customerTable.setWidths(customerColWidths);

            addTableCell(customerTable, "Name:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(customerTable, booking.getCustomerName(), NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);
            addTableCell(customerTable, "Email:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(customerTable, booking.getCustomerEmail(), NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);
            addTableCell(customerTable, "Phone:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(customerTable,
                (booking.getCustomerPhone() != null && !booking.getCustomerPhone().isEmpty()
                    ? booking.getCustomerPhone() : "N/A"),
                NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);

            document.add(customerTable);


            document.add(new Paragraph("Car Details:", SUBTITLE_FONT));
            document.add(new Paragraph(" ", NORMAL_FONT));

            PdfPTable carTable = new PdfPTable(2);
            carTable.setWidthPercentage(100);
            carTable.setSpacingBefore(10f);
            carTable.setSpacingAfter(20f);
            float[] carColWidths = {2f, 3f};
            carTable.setWidths(carColWidths);

            addTableCell(carTable, "Make:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(carTable, booking.getCar().getMake(), NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);
            addTableCell(carTable, "Model:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(carTable, booking.getCar().getModel(), NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);
            addTableCell(carTable, "License Plate:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(carTable, booking.getCar().getLicensePlate(), NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);
            addTableCell(carTable, "Daily Rate:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(carTable, "Ksh " + booking.getCar().getDailyRate().toPlainString(), NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);

            document.add(carTable);


            document.add(new Paragraph("Rental Details:", SUBTITLE_FONT));
            document.add(new Paragraph(" ", NORMAL_FONT));

            PdfPTable rentalTable = new PdfPTable(2);
            rentalTable.setWidthPercentage(100);
            rentalTable.setSpacingBefore(10f);
            rentalTable.setSpacingAfter(20f);
            float[] rentalColWidths = {2f, 3f};
            rentalTable.setWidths(rentalColWidths);

            addTableCell(rentalTable, "Start Date:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(rentalTable, booking.getStartDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")),
                NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);
            addTableCell(rentalTable, "End Date:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(rentalTable, booking.getEndDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")),
                NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);
            addTableCell(rentalTable, "Current Status:", HEADER_FONT, Element.ALIGN_LEFT, Rectangle.NO_BORDER);
            addTableCell(rentalTable, booking.getStatus().name(), NORMAL_FONT, Element.ALIGN_RIGHT, Rectangle.NO_BORDER);

            document.add(rentalTable);


            Paragraph totalAmountPara = new Paragraph("Total Amount: Ksh " + booking.getTotalAmount().toPlainString(), TOTAL_AMOUNT_FONT);
            totalAmountPara.setAlignment(Element.ALIGN_RIGHT);
            totalAmountPara.setSpacingBefore(30);
            document.add(totalAmountPara);


            Paragraph footer = new Paragraph("Thank you for choosing Urbandrives. We look forward to serving you!", SMALL_FONT);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(50);
            document.add(footer);

            Paragraph contact = new Paragraph("Contact us at support@urbandrives.com", SMALL_FONT);
            contact.setAlignment(Element.ALIGN_CENTER);
            document.add(contact);

        } catch (Exception e) {
            System.err.println("Error generating receipt : " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to generate receipt for booking ID: " + booking.getId(), e);
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }
        return baos.toByteArray();
    }

    private void addTableCell(PdfPTable table, String text, Font font, int alignment, int border) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(5);
        cell.setBorder(border);
        table.addCell(cell);
    }
}
