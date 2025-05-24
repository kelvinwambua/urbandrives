package com.urbandrives.app.repository;

import com.urbandrives.app.entity.Booking;
import com.urbandrives.app.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerEmail(String customerEmail);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByCarId(Long carId);

    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId AND b.status IN ('CONFIRMED', 'ACTIVE') " +
        "AND ((:startDate BETWEEN b.startDate AND b.endDate) OR " +
        "(:endDate BETWEEN b.startDate AND b.endDate) OR " +
        "(b.startDate BETWEEN :startDate AND :endDate))")
    List<Booking> findConflictingBookings(@Param("carId") Long carId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);
}
