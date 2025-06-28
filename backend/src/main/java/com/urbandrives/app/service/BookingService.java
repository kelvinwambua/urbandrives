package com.urbandrives.app.service;

import com.urbandrives.app.dto.BookingRequestDTO;
import com.urbandrives.app.dto.BookingResponseDTO;
import com.urbandrives.app.dto.CarDTO; // Needed for convertCarToDTO
import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.repository.BookingRepository;
import com.urbandrives.app.repository.CarRepository;
import org.springframework.beans.BeanUtils; // Keep if using BeanUtils.copyProperties in convertToResponseDTO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional; // Ensure this import is present
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter; // For formatting dates for email
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
// No longer need jakarta.mail.MessagingException here, as EmailService handles it internally

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarService carService; // Injected but not used in createBooking or current methods shown.

    @Autowired
    private EmailService emailService; // Your updated EmailService

    // @Autowired
    // private ReceiptService receiptService; // No longer needed, as EmailService generates HTML

    // Helper method to convert Booking entity to BookingResponseDTO for API responses
    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        // Assuming you might use BeanUtils.copyProperties or manually map
        // If BeanUtils.copyProperties is used, ensure fields match or map manually.
        dto.setId(booking.getId());
        dto.setCar(convertCarToDTO(booking.getCar()));
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCustomerPhone(booking.getCustomerPhone());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setNotes(booking.getNotes());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }

    // Helper method to convert Car entity to CarDTO
    private CarDTO convertCarToDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setMake(car.getMake());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setColor(car.getColor());
        dto.setImageUrl(car.getImageUrl());
        dto.setLicensePlate(car.getLicensePlate());
        dto.setDailyRate(car.getDailyRate());
        dto.setStatus(car.getStatus());
        dto.setDescription(car.getDescription());
        dto.setCreatedAt(car.getCreatedAt());
        dto.setUpdatedAt(car.getUpdatedAt());
        dto.setLocation(car.getLocation()); // Ensure location is also mapped
        return dto;
    }


    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        // 1. Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }

        // 2. Check if car exists
        Optional<Car> carOpt = carRepository.findById(request.getCarId());
        if (carOpt.isEmpty()) {
            throw new IllegalArgumentException("Car not found");
        }
        Car car = carOpt.get();

        // 3. Check for conflicting bookings (assuming findConflictingBookings is implemented in repo)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getCarId(), request.getStartDate(), request.getEndDate()
        );

        if (!conflicts.isEmpty()) {
            // Further refine this: if ALL conflicts are CANCELLED/REJECTED, then it's available.
            // Assuming your findConflictingBookings only returns active conflicts,
            // or you add a filter here like:
            // boolean hasActiveConflicts = conflicts.stream()
            //     .anyMatch(b -> b.getStatus() != BookingStatus.CANCELLED && b.getStatus() != BookingStatus.REJECTED);
            // if (hasActiveConflicts) {
            //     throw new IllegalArgumentException("Car is not available for the selected dates");
            // }

            // If findConflictingBookings needs to be robust, ensure it only counts active bookings.
            // The @Query on CarRepository for findAvailableCars has similar logic.
            throw new IllegalArgumentException("Car is not available for the selected dates");
        }


        // 4. Calculate total amount
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days == 0) days = 1; // Minimum 1 day for same-day pickup/return
        BigDecimal totalAmount = car.getDailyRate().multiply(BigDecimal.valueOf(days));

        // 5. Create Booking Entity
        Booking booking = new Booking();
        booking.setCar(car);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalAmount(totalAmount);
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING); // New bookings start as PENDING

        // 6. Save the Booking
        Booking savedBooking = bookingRepository.save(booking);

        // --- NEW: Call specific EmailService method with HTML content ---
        // Format dates for the email content
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy"); // Adjust format as needed
        String formattedStartDate = savedBooking.getStartDate().format(dateFormatter);
        String formattedEndDate = savedBooking.getEndDate().format(dateFormatter);

        emailService.sendBookingConfirmationEmail(
                savedBooking.getCustomerEmail(),
                savedBooking.getCustomerName(),
                savedBooking.getCar().getMake() + " " + savedBooking.getCar().getModel() + " (" + savedBooking.getCar().getLicensePlate() + ")",
                formattedStartDate, // Pass formatted dates
                formattedEndDate,   // Pass formatted dates
                savedBooking.getTotalAmount().toPlainString(), // Convert BigDecimal to String for email
                savedBooking.getId()
        );
        // --- END NEW ---

        // 7. Convert and return the saved booking as a Response DTO
        return convertToResponseDTO(savedBooking);
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getBookingsByEmail(String email) {
        return bookingRepository.findByCustomerEmail(email).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<BookingResponseDTO> getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            throw new IllegalArgumentException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        BookingStatus oldStatus = booking.getStatus();
        booking.setStatus(status);
        Booking savedBooking = bookingRepository.save(booking);

        // This part sends a *text-based* cancellation email. Keep it if needed.
        if (oldStatus != BookingStatus.CANCELLED && status == BookingStatus.CANCELLED) {
            emailService.sendBookingCancellationEmail(
                    savedBooking.getCustomerEmail(),
                    savedBooking.getCustomerName(),
                    savedBooking.getId()
            );
        }
        return convertToResponseDTO(savedBooking);
    }

    @Transactional
    public void cancelBooking(Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            throw new IllegalArgumentException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        if (booking.getStatus() != BookingStatus.CANCELLED) { // Only send email if status changes to CANCELLED
            booking.setStatus(BookingStatus.CANCELLED);
            Booking savedBooking = bookingRepository.save(booking); // Save the status change

            emailService.sendBookingCancellationEmail(
                    savedBooking.getCustomerEmail(),
                    savedBooking.getCustomerName(),
                    savedBooking.getId()
            );
        }
        // No need for a second booking.setStatus(BookingStatus.CANCELLED); or save(booking); here.
    }
}