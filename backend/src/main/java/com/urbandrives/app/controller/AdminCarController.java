package com.urbandrives.app.controller;

import com.urbandrives.app.dto.CarDTO;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.service.CarService;
import com.urbandrives.app.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/cars")
@CrossOrigin(origins = "*")
public class AdminCarController {

    @Autowired
    private CarService carService;

    @Qualifier("imageUploadServiceImpl")
    @Autowired
    private UploadService uploadService;

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
