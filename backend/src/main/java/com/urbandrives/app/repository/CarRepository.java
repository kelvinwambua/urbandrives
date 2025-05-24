package com.urbandrives.app.repository;

import com.urbandrives.app.entity.Car;
import com.urbandrives.app.entity.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(CarStatus status);
    //for finding cars based on availabilty
    List<Car> findByMakeContainingIgnoreCase(String make);
    //finding cars based on their make
    List<Car> findByModelContainingIgnoreCase(String model);
    //finfing cars based on their models
    @Query("SELECT c FROM Car c WHERE c.status = 'AVAILABLE' AND c.id NOT IN " +
        "(SELECT b.car.id FROM Booking b WHERE b.status IN ('CONFIRMED', 'ACTIVE') " +
        "AND ((:startDate BETWEEN b.startDate AND b.endDate) OR " +
        "(:endDate BETWEEN b.startDate AND b.endDate) OR " +
        "(b.startDate BETWEEN :startDate AND :endDate)))")
    //finding cars for a specific time window
    List<Car> findAvailableCars(@Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate);
}
