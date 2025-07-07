package com.urbandrives.app.controller;

import com.urbandrives.app.dto.BookingRequestDTO;
import com.urbandrives.app.dto.BookingResponseDTO;
import com.urbandrives.app.entity.BookingStatus;
import com.urbandrives.app.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;


    @PostMapping("/api/bookings")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        try {
            BookingResponseDTO booking = bookingService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred while creating the booking"));
        }
    }

    @GetMapping("/api/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/api/bookings/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        Optional<BookingResponseDTO> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/bookings/customer/{email}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByEmail(@PathVariable String email) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/api/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> statusUpdate) {
        try {
            BookingStatus status = BookingStatus.valueOf(statusUpdate.get("status").toUpperCase());
            BookingResponseDTO booking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid status or booking not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred while updating the booking"));
        }
    }

    @DeleteMapping("/api/bookings/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred while cancelling the booking"));
        }
    }

    // Public endpoints (no authentication required)
    @PostMapping("/public/api/bookings")
    public ResponseEntity<?> createBookingPublic(@Valid @RequestBody BookingRequestDTO request) {
        try {
            BookingResponseDTO booking = bookingService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred while creating the booking"));
        }
    }

    @GetMapping("/public/api/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookingsPublic() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/public/api/bookings/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingByIdPublic(@PathVariable Long id) {
        Optional<BookingResponseDTO> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/api/bookings/customer/{email}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByEmailPublic(@PathVariable String email) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/public/api/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatusPublic(
        @PathVariable Long id,
        @RequestBody Map<String, String> statusUpdate) {
        try {
            BookingStatus status = BookingStatus.valueOf(statusUpdate.get("status").toUpperCase());
            BookingResponseDTO booking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid status or booking not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred while updating the booking"));
        }
    }

    @DeleteMapping("/public/api/bookings/{id}")
    public ResponseEntity<?> cancelBookingPublic(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An error occurred while cancelling the booking"));
        }
    }
}
