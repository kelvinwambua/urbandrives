package com.urbandrives.app.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.urbandrives.app.dto.SalesReportDTO;
import com.urbandrives.app.dto.SalesReportSummaryDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfReportService {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generateSalesReportPdf(List<SalesReportDTO> salesData,
                                         SalesReportSummaryDTO summary,
                                         LocalDate startDate,
                                         LocalDate endDate) throws DocumentException, IOException {

        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        addTitle(document, "Sales Report", startDate, endDate);
        addSummarySection(document, summary);
        addDetailedTable(document, salesData);

        document.close();
        return out.toByteArray();
    }

    private void addTitle(Document document, String title, LocalDate startDate, LocalDate endDate) throws DocumentException {
        Paragraph titleParagraph = new Paragraph(title, TITLE_FONT);
        titleParagraph.setAlignment(Element.ALIGN_CENTER);
        titleParagraph.setSpacingAfter(10);
        document.add(titleParagraph);

        Paragraph dateParagraph = new Paragraph(
            "Period: " + startDate.format(DATE_FORMATTER) + " to " + endDate.format(DATE_FORMATTER), HEADER_FONT);
        dateParagraph.setAlignment(Element.ALIGN_CENTER);
        dateParagraph.setSpacingAfter(20);
        document.add(dateParagraph);
    }

    private void addSummarySection(Document document, SalesReportSummaryDTO summary) throws DocumentException {
        Paragraph summaryTitle = new Paragraph("Summary", HEADER_FONT);
        summaryTitle.setSpacingAfter(10);
        document.add(summaryTitle);

        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(50);
        summaryTable.setHorizontalAlignment(Element.ALIGN_LEFT);

        addSummaryRow(summaryTable, "Total Bookings:", String.valueOf(summary.getTotalBookings()));
        addSummaryRow(summaryTable, "Total Revenue:", "$" + summary.getTotalRevenue().toString());
        addSummaryRow(summaryTable, "Average Booking Value:", "$" + summary.getAverageBookingValue().toString());
        addSummaryRow(summaryTable, "Total Rental Days:", String.valueOf(summary.getTotalRentalDays()));
        addSummaryRow(summaryTable, "Most Popular Car:", summary.getMostPopularCar());
        addSummaryRow(summaryTable, "Top Customer:", summary.getTopCustomer());

        document.add(summaryTable);
        document.add(new Paragraph(" ", NORMAL_FONT));
    }

    private void addSummaryRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, HEADER_FONT));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, NORMAL_FONT));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }

    private void addDetailedTable(Document document, List<SalesReportDTO> salesData) throws DocumentException {
        Paragraph detailTitle = new Paragraph("Detailed Bookings", HEADER_FONT);
        detailTitle.setSpacingAfter(10);
        document.add(detailTitle);

        PdfPTable table = new PdfPTable(9);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.5f, 1.5f, 1.5f, 2f, 2.5f, 1.5f, 1.5f, 1.5f, 1.2f});

        addTableHeader(table, "Date", "Make", "Model", "Customer", "Email", "Start Date", "End Date", "Amount", "Status");

        for (SalesReportDTO data : salesData) {
            addTableRow(table,
                data.getDate().format(DATE_FORMATTER),
                data.getCarMake(),
                data.getCarModel(),
                data.getCustomerName(),
                data.getCustomerEmail(),
                data.getStartDate().format(DATE_FORMATTER),
                data.getEndDate().format(DATE_FORMATTER),
                "$" + data.getTotalAmount().toString(),
                data.getStatus()
            );
        }

        document.add(table);
    }

    private void addTableHeader(PdfPTable table, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, HEADER_FONT));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    private void addTableRow(PdfPTable table, String... values) {
        for (String value : values) {
            PdfPCell cell = new PdfPCell(new Phrase(value, NORMAL_FONT));
            cell.setPadding(5);
            table.addCell(cell);
        }
    }
}
