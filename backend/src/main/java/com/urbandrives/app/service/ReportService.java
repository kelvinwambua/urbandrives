package com.urbandrives.app.service;

import com.urbandrives.app.dto.SalesReportDTO;
import com.urbandrives.app.dto.SalesReportSummaryDTO;
import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import com.urbandrives.app.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<SalesReportDTO> generateSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        List<BookingStatus> includedStatuses = Arrays.asList(
            BookingStatus.CONFIRMED,
            BookingStatus.ACTIVE,
            BookingStatus.COMPLETED
        );

        List<Booking> bookings = bookingRepository.findBookingsByDateRangeAndStatus(
            startDateTime, endDateTime, includedStatuses);

        return bookings.stream().map(this::convertToSalesReportDTO).collect(Collectors.toList());
    }

    public SalesReportSummaryDTO generateSalesReportSummary(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        List<BookingStatus> includedStatuses = Arrays.asList(
            BookingStatus.CONFIRMED,
            BookingStatus.ACTIVE,
            BookingStatus.COMPLETED
        );

        List<Booking> bookings = bookingRepository.findBookingsByDateRangeAndStatus(
            startDateTime, endDateTime, includedStatuses);

        int totalBookings = bookings.size();
        BigDecimal totalRevenue = bookings.stream()
            .map(Booking::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageBookingValue = totalBookings > 0
            ? totalRevenue.divide(BigDecimal.valueOf(totalBookings), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        int totalRentalDays = bookings.stream()
            .mapToInt(b -> (int) ChronoUnit.DAYS.between(b.getStartDate(), b.getEndDate()) + 1)
            .sum();

        String mostPopularCar = getMostPopularCar(startDateTime, endDateTime);
        String topCustomer = getTopCustomer(startDateTime, endDateTime);

        return new SalesReportSummaryDTO(totalBookings, totalRevenue, averageBookingValue,
            totalRentalDays, mostPopularCar, topCustomer);
    }

    public List<Object[]> getMonthlySummary(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        return bookingRepository.getMonthlySummary(startDateTime, endDateTime);
    }

    public List<Object[]> getCarPerformanceReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        return bookingRepository.getCarPerformanceReport(startDateTime, endDateTime);
    }

    public List<Object[]> getCustomerAnalysisReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay();

        return bookingRepository.getCustomerAnalysisReport(startDateTime, endDateTime);
    }

    private SalesReportDTO convertToSalesReportDTO(Booking booking) {
        int rentalDays = (int) ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;

        return new SalesReportDTO(
            booking.getCreatedAt().toLocalDate(),
            booking.getCar().getMake(),
            booking.getCar().getModel(),
            booking.getCustomerName(),
            booking.getCustomerEmail(),
            booking.getStartDate(),
            booking.getEndDate(),
            booking.getTotalAmount(),
            booking.getStatus().toString(),
            rentalDays
        );
    }

    private String getMostPopularCar(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = bookingRepository.findMostPopularCarsByDateRange(startDate, endDate);
        return results.isEmpty() ? "N/A" : (String) results.get(0)[0];
    }

    private String getTopCustomer(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = bookingRepository.findTopCustomersByDateRange(startDate, endDate);
        return results.isEmpty() ? "N/A" : (String) results.get(0)[0];
    }
}
