package com.urbandrives.app.controller;

import com.urbandrives.app.dto.SalesReportDTO;
import com.urbandrives.app.dto.SalesReportSummaryDTO;
import com.urbandrives.app.service.ExcelReportService;
import com.urbandrives.app.service.PdfReportService;
import com.urbandrives.app.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private PdfReportService pdfReportService;

    @Autowired
    private ExcelReportService excelReportService;

    @GetMapping("/sales")
    public ResponseEntity<List<SalesReportDTO>> getSalesReport(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<SalesReportDTO> report = reportService.generateSalesReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/sales/summary")
    public ResponseEntity<SalesReportSummaryDTO> getSalesReportSummary(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        SalesReportSummaryDTO summary = reportService.generateSalesReportSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/sales/pdf")
    public ResponseEntity<byte[]> getSalesReportPdf(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            if (endDate.isBefore(startDate)) {
                return ResponseEntity.badRequest().build();
            }

            List<SalesReportDTO> salesData = reportService.generateSalesReport(startDate, endDate);
            SalesReportSummaryDTO summary = reportService.generateSalesReportSummary(startDate, endDate);

            byte[] pdfBytes = pdfReportService.generateSalesReportPdf(salesData, summary, startDate, endDate);

            String filename = "sales-report-" +
                startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "-to-" +
                endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".pdf";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/sales/excel")
    public ResponseEntity<byte[]> getSalesReportExcel(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            if (endDate.isBefore(startDate)) {
                return ResponseEntity.badRequest().build();
            }

            List<SalesReportDTO> salesData = reportService.generateSalesReport(startDate, endDate);
            SalesReportSummaryDTO summary = reportService.generateSalesReportSummary(startDate, endDate);

            byte[] excelBytes = excelReportService.generateSalesReportExcel(salesData, summary, startDate, endDate);

            String filename = "sales-report-" +
                startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "-to-" +
                endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(excelBytes.length);

            return ResponseEntity.ok()
                .headers(headers)
                .body(excelBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/sales/last-month/pdf")
    public ResponseEntity<byte[]> getLastMonthSalesReportPdf() {
        try {
            LocalDate endDate = LocalDate.now().minusDays(1);
            LocalDate startDate = endDate.minusMonths(1).plusDays(1);

            List<SalesReportDTO> salesData = reportService.generateSalesReport(startDate, endDate);
            SalesReportSummaryDTO summary = reportService.generateSalesReportSummary(startDate, endDate);

            byte[] pdfBytes = pdfReportService.generateSalesReportPdf(salesData, summary, startDate, endDate);

            String filename = "last-month-sales-report-" +
                startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "-to-" +
                endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".pdf";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/sales/last-month/excel")
    public ResponseEntity<byte[]> getLastMonthSalesReportExcel() {
        try {
            LocalDate endDate = LocalDate.now().minusDays(1);
            LocalDate startDate = endDate.minusMonths(1).plusDays(1);

            List<SalesReportDTO> salesData = reportService.generateSalesReport(startDate, endDate);
            SalesReportSummaryDTO summary = reportService.generateSalesReportSummary(startDate, endDate);

            byte[] excelBytes = excelReportService.generateSalesReportExcel(salesData, summary, startDate, endDate);

            String filename = "last-month-sales-report-" +
                startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "-to-" +
                endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(excelBytes.length);

            return ResponseEntity.ok()
                .headers(headers)
                .body(excelBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<List<Object[]>> getMonthlySummary(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<Object[]> summary = reportService.getMonthlySummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/car-performance")
    public ResponseEntity<List<Object[]>> getCarPerformanceReport(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<Object[]> report = reportService.getCarPerformanceReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/customer-analysis")
    public ResponseEntity<List<Object[]>> getCustomerAnalysisReport(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<Object[]> report = reportService.getCustomerAnalysisReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
}
