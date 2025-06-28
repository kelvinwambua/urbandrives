package com.urbandrives.app.service;

import com.urbandrives.app.dto.BookingRequestDTO;
import com.urbandrives.app.dto.BookingResponseDTO;
import com.urbandrives.app.dto.CarDTO;
import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.repository.BookingRepository;
import com.urbandrives.app.repository.CarRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarService carService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PdfService pdfService;

    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
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
        dto.setLocation(car.getLocation());
        return dto;
    }


    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }


        Optional<Car> carOpt = carRepository.findById(request.getCarId());
        if (carOpt.isEmpty()) {
            throw new IllegalArgumentException("Car not found");
        }
        Car car = carOpt.get();


        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getCarId(), request.getStartDate(), request.getEndDate()
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Car is not available for the selected dates");
        }


        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days == 0) days = 1;
        BigDecimal totalAmount = car.getDailyRate().multiply(BigDecimal.valueOf(days));


        Booking booking = new Booking();
        booking.setCar(car);
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalAmount(totalAmount);
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);



        Booking savedBooking = bookingRepository.save(booking);


        try {

            byte[] pdfBytes = pdfService.generateBookingConfirmationPdf(savedBooking);
            String attachmentFileName = "UrbanDrives_BookingConfirmation_" + savedBooking.getId() + ".pdf";
            String attachmentContentType = "application/pdf";


            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMMM yy");
            String formattedStartDate = savedBooking.getStartDate().format(dateFormatter);
            String formattedEndDate = savedBooking.getEndDate().format(dateFormatter);


            emailService.sendBookingConfirmationEmail(
                    savedBooking.getCustomerEmail(),
                    savedBooking.getCustomerName(),
                    savedBooking.getCar().getMake() + " " + savedBooking.getCar().getModel() + " (" + savedBooking.getCar().getLicensePlate() + ")",
                    formattedStartDate,
                    formattedEndDate,
                    savedBooking.getTotalAmount().toPlainString(),
                    savedBooking.getId(),
                    pdfBytes,
                    attachmentFileName,
                    attachmentContentType
            );
        } catch (IOException e) {

            System.err.println("Error generating PDF or sending confirmation email for booking ID " + savedBooking.getId() + ": " + e.getMessage());
            e.printStackTrace();

        } catch (Exception e) {
            System.err.println("An unexpected error occurred during email sending for booking ID " + savedBooking.getId() + ": " + e.getMessage());
            e.printStackTrace();
        }



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
        if (booking.getStatus() != BookingStatus.CANCELLED) {
            booking.setStatus(BookingStatus.CANCELLED);
            Booking savedBooking = bookingRepository.save(booking);

            emailService.sendBookingCancellationEmail(
                    savedBooking.getCustomerEmail(),
                    savedBooking.getCustomerName(),
                    savedBooking.getId()
            );
        }
    }
}