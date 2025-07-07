
package com.urbandrives.app.service;

import com.urbandrives.app.dto.BookingRequestDTO;
import com.urbandrives.app.dto.BookingResponseDTO;
import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.repository.BookingRepository;
import com.urbandrives.app.repository.CarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private CarRepository carRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PdfService pdfService;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createBooking_Success() throws Exception {
        BookingRequestDTO request = new BookingRequestDTO();
        request.setCarId(1L);
        request.setCustomerName("John Doe");
        request.setCustomerEmail("john.doe@example.com");
        request.setStartDate(LocalDate.now().plusDays(1));
        request.setEndDate(LocalDate.now().plusDays(3));

        Car car = new Car();
        car.setId(1L);
        car.setDailyRate(new BigDecimal("50.00"));

        Booking savedBooking = new Booking();
        savedBooking.setId(1L);
        savedBooking.setCar(car);
        savedBooking.setCustomerName(request.getCustomerName());
        savedBooking.setCustomerEmail(request.getCustomerEmail());
        savedBooking.setStartDate(request.getStartDate());
        savedBooking.setEndDate(request.getEndDate());
        savedBooking.setTotalAmount(new BigDecimal("100.00"));
        savedBooking.setStatus(BookingStatus.PENDING);

        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(bookingRepository.findConflictingBookings(any(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
        when(pdfService.generateBookingConfirmationPdf(any(Booking.class))).thenReturn(new byte[0]);

        BookingResponseDTO response = bookingService.createBooking(request);

        assertNotNull(response);
        assertEquals(savedBooking.getId(), response.getId());
        verify(emailService, times(1)).sendBookingConfirmationEmail(any(), any(), any(), any(), any(), any(), any(), any(), any(), any());
    }

    @Test
    void createBooking_CarNotFound() {
        BookingRequestDTO request = new BookingRequestDTO();
        request.setCarId(1L);
        request.setStartDate(LocalDate.now().plusDays(1));
        request.setEndDate(LocalDate.now().plusDays(2));

        when(carRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(request);
        });
    }

    @Test
    void createBooking_DateConflict() {
        BookingRequestDTO request = new BookingRequestDTO();
        request.setCarId(1L);
        request.setStartDate(LocalDate.now().plusDays(1));
        request.setEndDate(LocalDate.now().plusDays(3));

        Car car = new Car();
        car.setId(1L);

        when(carRepository.findById(1L)).thenReturn(Optional.of(car));
        when(bookingRepository.findConflictingBookings(any(), any(), any())).thenReturn(Collections.singletonList(new Booking()));

        assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(request);
        });
    }
}
