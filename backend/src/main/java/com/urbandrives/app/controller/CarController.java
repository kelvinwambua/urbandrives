package com.urbandrives.app.controller;

import com.urbandrives.app.dto.CarDTO;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.service.CarService;
import com.urbandrives.app.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @Qualifier("imageUploadServiceImpl")
    @Autowired
    private UploadService uploadService;

    // Protected endpoints (require authentication)
    @GetMapping("/api/cars")
    public ResponseEntity<List<CarDTO>> getAllCars(@RequestParam(required = false) String location) {
        List<CarDTO> cars;
        if (location != null && !location.trim().isEmpty()) {
            cars = carService.searchCarsByLocation(location);
        } else {
            cars = carService.getAllCars();
        }
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/api/cars/available")
    public ResponseEntity<List<CarDTO>> getAvailableCars(@RequestParam(required = false) String location) {
        List<CarDTO> cars;
        if (location != null && !location.trim().isEmpty()) {
            cars = carService.getAvailableCarsByLocation(location);
        } else {
            cars = carService.getAvailableCars();
        }
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/api/cars/available/dates")
    public ResponseEntity<List<CarDTO>> getAvailableCarsForDates(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false) String location) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<CarDTO> cars;
        if (location != null && !location.trim().isEmpty()) {
            cars = carService.getAvailableCarsForDatesAndLocation(startDate, endDate, location);
        } else {
            cars = carService.getAvailableCarsForDates(startDate, endDate);
        }
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/api/cars/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        Optional<CarDTO> car = carService.getCarById(id);
        return car.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/cars/search")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestParam String query) {
        List<CarDTO> cars = carService.searchCars(query);
        return ResponseEntity.ok(cars);
    }

    @PostMapping("/api/cars")
    public ResponseEntity<CarDTO> createCar(@RequestBody CarDTO carDTO) {
        try {
            Car car = convertToEntity(carDTO);
            CarDTO createdCar = carService.saveCar(car);
            return ResponseEntity.ok(createdCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/api/cars/{id}/image")
    public ResponseEntity<CarDTO> updateCarImage(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file) {

        try {
            Optional<CarDTO> existingCar = carService.getCarById(id);
            if (existingCar.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String imageUrl = uploadService.upload(file);

            Car car = convertToEntity(existingCar.get());
            car.setId(id);
            car.setImageUrl(imageUrl);

            CarDTO updatedCar = carService.saveCar(car);
            return ResponseEntity.ok(updatedCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Public endpoints (no authentication required)
    @GetMapping("/public/api/cars")
    public ResponseEntity<List<CarDTO>> getAllCarsPublic(@RequestParam(required = false) String location) {
        List<CarDTO> cars;
        if (location != null && !location.trim().isEmpty()) {
            cars = carService.searchCarsByLocation(location);
        } else {
            cars = carService.getAllCars();
        }
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/public/api/cars/available")
    public ResponseEntity<List<CarDTO>> getAvailableCarsPublic(@RequestParam(required = false) String location) {
        List<CarDTO> cars;
        if (location != null && !location.trim().isEmpty()) {
            cars = carService.getAvailableCarsByLocation(location);
        } else {
            cars = carService.getAvailableCars();
        }
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/public/api/cars/available/dates")
    public ResponseEntity<List<CarDTO>> getAvailableCarsForDatesPublic(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false) String location) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<CarDTO> cars;
        if (location != null && !location.trim().isEmpty()) {
            cars = carService.getAvailableCarsForDatesAndLocation(startDate, endDate, location);
        } else {
            cars = carService.getAvailableCarsForDates(startDate, endDate);
        }
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/public/api/cars/{id}")
    public ResponseEntity<CarDTO> getCarByIdPublic(@PathVariable Long id) {
        Optional<CarDTO> car = carService.getCarById(id);
        return car.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/api/cars/search")
    public ResponseEntity<List<CarDTO>> searchCarsPublic(@RequestParam String query) {
        List<CarDTO> cars = carService.searchCars(query);
        return ResponseEntity.ok(cars);
    }

    @PostMapping("/public/api/cars")
    public ResponseEntity<CarDTO> createCarPublic(@RequestBody CarDTO carDTO) {
        try {
            Car car = convertToEntity(carDTO);
            CarDTO createdCar = carService.saveCar(car);
            return ResponseEntity.ok(createdCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/public/api/cars/{id}/image")
    public ResponseEntity<CarDTO> updateCarImagePublic(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file) {

        try {
            Optional<CarDTO> existingCar = carService.getCarById(id);
            if (existingCar.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String imageUrl = uploadService.upload(file);

            Car car = convertToEntity(existingCar.get());
            car.setId(id);
            car.setImageUrl(imageUrl);

            CarDTO updatedCar = carService.saveCar(car);
            return ResponseEntity.ok(updatedCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Car convertToEntity(CarDTO dto) {
        Car car = new Car();
        car.setMake(dto.getMake());
        car.setModel(dto.getModel());
        car.setYear(dto.getYear());
        car.setColor(dto.getColor());
        car.setLicensePlate(dto.getLicensePlate());
        car.setDailyRate(dto.getDailyRate());
        car.setDescription(dto.getDescription());
        car.setImageUrl(dto.getImageUrl());

        if (dto.getStatus() != null) {
            car.setStatus(dto.getStatus());
        }

        return car;
    }
}
