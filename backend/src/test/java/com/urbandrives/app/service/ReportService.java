
package com.urbandrives.app.service;

import com.urbandrives.app.dto.SalesReportDTO;
import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

class ReportServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private ReportService reportService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateSalesReport_ReturnsReportData() {
        Car car = new Car();
        car.setMake("Test Make");
        car.setModel("Test Model");

        Booking booking = new Booking();
        booking.setCar(car);
        booking.setCustomerName("Test Customer");
        booking.setCustomerEmail("test@example.com");
        booking.setStartDate(LocalDate.now());
        booking.setEndDate(LocalDate.now().plusDays(1));
        booking.setTotalAmount(new BigDecimal("100"));
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setCreatedAt(LocalDateTime.now());

        when(bookingRepository.findBookingsByDateRangeAndStatus(any(), any(), anyList()))
            .thenReturn(Collections.singletonList(booking));

        List<SalesReportDTO> report = reportService.generateSalesReport(LocalDate.now().minusDays(1), LocalDate.now());

        assertFalse(report.isEmpty());
    }
}
