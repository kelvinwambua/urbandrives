package com.urbandrives.app.repository;

import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByCustomerEmail(String customerEmail);

    @Query("SELECT b FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate ORDER BY b.createdAt DESC")
    List<Booking> findBookingsByDateRange(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate AND b.status IN :statuses ORDER BY b.createdAt DESC")
    List<Booking> findBookingsByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate,
                                                   @Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT CONCAT(c.make, ' ', c.model) as carName, COUNT(b) as bookingCount " +
        "FROM Booking b JOIN b.car c WHERE b.createdAt BETWEEN :startDate AND :endDate " +
        "GROUP BY c.id, c.make, c.model ORDER BY COUNT(b) DESC")
    List<Object[]> findMostPopularCarsByDateRange(@Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b.customerName, COUNT(b) as bookingCount, SUM(b.totalAmount) as totalSpent " +
        "FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate " +
        "GROUP BY b.customerName ORDER BY SUM(b.totalAmount) DESC")
    List<Object[]> findTopCustomersByDateRange(@Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT YEAR(b.createdAt) as year, MONTH(b.createdAt) as month, COUNT(b) as totalBookings, SUM(b.totalAmount) as totalRevenue " +
        "FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate AND b.status IN ('CONFIRMED', 'ACTIVE', 'COMPLETED') " +
        "GROUP BY YEAR(b.createdAt), MONTH(b.createdAt) ORDER BY YEAR(b.createdAt), MONTH(b.createdAt)")
    List<Object[]> getMonthlySummary(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

    @Query("SELECT CONCAT(c.make, ' ', c.model) as carName, COUNT(b) as totalBookings, " +
        "SUM(b.totalAmount) as totalRevenue, AVG(b.totalAmount) as averageBookingValue, " +
        "SUM(DATEDIFF(b.endDate, b.startDate) + 1) as totalRentalDays " +
        "FROM Booking b JOIN b.car c WHERE b.createdAt BETWEEN :startDate AND :endDate " +
        "AND b.status IN ('CONFIRMED', 'ACTIVE', 'COMPLETED') " +
        "GROUP BY c.id, c.make, c.model ORDER BY SUM(b.totalAmount) DESC")
    List<Object[]> getCarPerformanceReport(@Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b.customerName, b.customerEmail, COUNT(b) as totalBookings, " +
        "SUM(b.totalAmount) as totalSpent, AVG(b.totalAmount) as averageBookingValue, " +
        "MIN(b.createdAt) as firstBooking, MAX(b.createdAt) as lastBooking " +
        "FROM Booking b WHERE b.createdAt BETWEEN :startDate AND :endDate " +
        "AND b.status IN ('CONFIRMED', 'ACTIVE', 'COMPLETED') " +
        "GROUP BY b.customerName, b.customerEmail ORDER BY SUM(b.totalAmount) DESC")
    List<Object[]> getCustomerAnalysisReport(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);
    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId AND b.status IN ('CONFIRMED', 'ACTIVE') " +
        "AND ((:startDate BETWEEN b.startDate AND b.endDate) OR " +
        "(:endDate BETWEEN b.startDate AND b.endDate) OR " +
        "(b.startDate BETWEEN :startDate AND :endDate))")

        //validating car availability before authorising a new booking
    List<Booking> findConflictingBookings(@Param("carId") Long carId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}
