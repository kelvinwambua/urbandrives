package com.urbandrives.app.service;

import com.urbandrives.app.dto.SalesReportDTO;
import com.urbandrives.app.dto.SalesReportSummaryDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelReportService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generateSalesReportExcel(List<SalesReportDTO> salesData,
                                           SalesReportSummaryDTO summary,
                                           LocalDate startDate,
                                           LocalDate endDate) throws IOException {

        Workbook workbook = new XSSFWorkbook();

        createSummarySheet(workbook, summary, startDate, endDate);
        createDetailSheet(workbook, salesData);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }

    private void createSummarySheet(Workbook workbook, SalesReportSummaryDTO summary,
                                    LocalDate startDate, LocalDate endDate) {
        Sheet sheet = workbook.createSheet("Summary");

        CellStyle titleStyle = createTitleStyle(workbook);
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);

        int rowNum = 0;

        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Sales Report Summary");
        titleCell.setCellStyle(titleStyle);

        Row dateRow = sheet.createRow(rowNum++);
        Cell dateCell = dateRow.createCell(0);
        dateCell.setCellValue("Period: " + startDate.format(DATE_FORMATTER) + " to " + endDate.format(DATE_FORMATTER));
        dateCell.setCellStyle(headerStyle);

        rowNum++;

        addSummaryRow(sheet, rowNum++, "Total Bookings", String.valueOf(summary.getTotalBookings()), headerStyle, dataStyle);
        addSummaryRow(sheet, rowNum++, "Total Revenue", "$" + summary.getTotalRevenue().toString(), headerStyle, dataStyle);
        addSummaryRow(sheet, rowNum++, "Average Booking Value", "$" + summary.getAverageBookingValue().toString(), headerStyle, dataStyle);
        addSummaryRow(sheet, rowNum++, "Total Rental Days", String.valueOf(summary.getTotalRentalDays()), headerStyle, dataStyle);
        addSummaryRow(sheet, rowNum++, "Most Popular Car", summary.getMostPopularCar(), headerStyle, dataStyle);
        addSummaryRow(sheet, rowNum++, "Top Customer", summary.getTopCustomer(), headerStyle, dataStyle);

        for (int i = 0; i < 2; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void createDetailSheet(Workbook workbook, List<SalesReportDTO> salesData) {
        Sheet sheet = workbook.createSheet("Detailed Bookings");

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);
        CellStyle dateStyle = createDateStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        int rowNum = 0;

        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Date", "Make", "Model", "Customer Name", "Customer Email",
            "Start Date", "End Date", "Rental Days", "Total Amount", "Status"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        for (SalesReportDTO data : salesData) {
            Row row = sheet.createRow(rowNum++);
            int colNum = 0;

            Cell dateCell = row.createCell(colNum++);
            dateCell.setCellValue(data.getDate().format(DATE_FORMATTER));
            dateCell.setCellStyle(dateStyle);

            Cell makeCell = row.createCell(colNum++);
            makeCell.setCellValue(data.getCarMake());
            makeCell.setCellStyle(dataStyle);

            Cell modelCell = row.createCell(colNum++);
            modelCell.setCellValue(data.getCarModel());
            modelCell.setCellStyle(dataStyle);

            Cell customerCell = row.createCell(colNum++);
            customerCell.setCellValue(data.getCustomerName());
            customerCell.setCellStyle(dataStyle);

            Cell emailCell = row.createCell(colNum++);
            emailCell.setCellValue(data.getCustomerEmail());
            emailCell.setCellStyle(dataStyle);

            Cell startDateCell = row.createCell(colNum++);
            startDateCell.setCellValue(data.getStartDate().format(DATE_FORMATTER));
            startDateCell.setCellStyle(dateStyle);

            Cell endDateCell = row.createCell(colNum++);
            endDateCell.setCellValue(data.getEndDate().format(DATE_FORMATTER));
            endDateCell.setCellStyle(dateStyle);

            Cell daysCell = row.createCell(colNum++);
            daysCell.setCellValue(data.getRentalDays());
            daysCell.setCellStyle(dataStyle);

            Cell amountCell = row.createCell(colNum++);
            amountCell.setCellValue(data.getTotalAmount().doubleValue());
            amountCell.setCellStyle(currencyStyle);

            Cell statusCell = row.createCell(colNum++);
            statusCell.setCellValue(data.getStatus());
            statusCell.setCellStyle(dataStyle);
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void addSummaryRow(Sheet sheet, int rowNum, String label, String value,
                               CellStyle labelStyle, CellStyle valueStyle) {
        Row row = sheet.createRow(rowNum);

        Cell labelCell = row.createCell(0);
        labelCell.setCellValue(label);
        labelCell.setCellStyle(labelStyle);

        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value);
        valueCell.setCellStyle(valueStyle);
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        style.setFont(font);
        return style;
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDateStyle(Workbook workbook) {
        CellStyle style = createDataStyle(workbook);
        CreationHelper createHelper = workbook.getCreationHelper();
        style.setDataFormat(createHelper.createDataFormat().getFormat("dd/mm/yyyy"));
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = createDataStyle(workbook);
        CreationHelper createHelper = workbook.getCreationHelper();
        style.setDataFormat(createHelper.createDataFormat().getFormat("$#,##0.00"));
        return style;
    }
}
