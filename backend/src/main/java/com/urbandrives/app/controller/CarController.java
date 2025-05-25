package com.urbandrives.app.controller;

import com.urbandrives.app.dto.CarDTO;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.service.CarService;
import com.urbandrives.app.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @Autowired
    private UploadService uploadService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/available")
    public ResponseEntity<List<CarDTO>> getAvailableCars() {
        List<CarDTO> cars = carService.getAvailableCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/available/dates")
    public ResponseEntity<List<CarDTO>> getAvailableCarsForDates(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<CarDTO> cars = carService.getAvailableCarsForDates(startDate, endDate);
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        Optional<CarDTO> car = carService.getCarById(id);
        return car.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestParam String query) {
        List<CarDTO> cars = carService.searchCars(query);
        return ResponseEntity.ok(cars);
    }

    @PostMapping
    public ResponseEntity<CarDTO> createCar(@RequestBody CarDTO carDTO) {
        try {

            Car car = convertToEntity(carDTO);


            CarDTO createdCar = carService.saveCar(car);

            return ResponseEntity.ok(createdCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/with-image")
    public ResponseEntity<CarDTO> createCarWithImage(
        @RequestParam("make") String make,
        @RequestParam("model") String model,
        @RequestParam("year") Integer year,
        @RequestParam("color") String color,
        @RequestParam("licensePlate") String licensePlate,
        @RequestParam("dailyRate") BigDecimal dailyRate,
        @RequestParam(value = "description", required = false) String description,
        @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            // Detailed logging
            System.out.println("=== Received Parameters ===");
            System.out.println("make: " + make);
            System.out.println("model: " + model);
            System.out.println("year: " + year);
            System.out.println("color: " + color);
            System.out.println("licensePlate: " + licensePlate);
            System.out.println("dailyRate: " + dailyRate);
            System.out.println("description: " + description);
            System.out.println("file: " + (file != null ? file.getOriginalFilename() + " (" + file.getSize() + " bytes)" : "null"));
            System.out.println("============================");

            String imageUrl = null;
            if (file != null && !file.isEmpty()) {
                imageUrl = uploadService.upload(file);
            }

            Car car = new Car(make, model, year, color, licensePlate, dailyRate, imageUrl);
            if (description != null) {
                car.setDescription(description);
            }

            CarDTO createdCar = carService.saveCar(car);
            return ResponseEntity.ok(createdCar);

        } catch (Exception e) {
            System.out.println("=== ERROR ===");
            e.printStackTrace();
            System.out.println("=============");
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDTO> updateCar(@PathVariable Long id, @RequestBody CarDTO carDTO) {
        try {

            Optional<CarDTO> existingCar = carService.getCarById(id);
            if (existingCar.isEmpty()) {
                return ResponseEntity.notFound().build();
            }


            Car car = convertToEntity(carDTO);
            car.setId(id);


            CarDTO updatedCar = carService.saveCar(car);

            return ResponseEntity.ok(updatedCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/image")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        try {
            boolean deleted = carService.deleteCar(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
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
