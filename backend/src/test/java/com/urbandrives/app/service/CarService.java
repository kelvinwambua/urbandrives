package com.urbandrives.app.service;

import com.urbandrives.app.dto.CarDTO;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.entity.CarStatus;
import com.urbandrives.app.repository.CarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @InjectMocks
    private CarService carService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAvailableCars_ReturnsAvailableCars() {
        Car car = new Car();
        car.setStatus(CarStatus.AVAILABLE);

        when(carRepository.findByStatus(CarStatus.AVAILABLE)).thenReturn(Collections.singletonList(car));

        List<CarDTO> result = carService.getAvailableCars();

        assertFalse(result.isEmpty());
        assertEquals(CarStatus.AVAILABLE, result.get(0).getStatus());
    }

    @Test
    void getCarById_ReturnsCar() {
        Car car = new Car();
        car.setId(1L);
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));

        Optional<CarDTO> result = carService.getCarById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }
}
