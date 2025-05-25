package com.urbandrives.app.service;

import com.urbandrives.app.dto.CarDTO;
import com.urbandrives.app.entity.Car;
import com.urbandrives.app.entity.CarStatus;
import com.urbandrives.app.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<CarDTO> getAvailableCars() {
        return carRepository.findByStatus(CarStatus.AVAILABLE).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<CarDTO> getAvailableCarsForDates(LocalDate startDate, LocalDate endDate) {
        return carRepository.findAvailableCars(startDate, endDate).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Optional<CarDTO> getCarById(Long id) {
        return carRepository.findById(id)
            .map(this::convertToDTO);
    }

    public List<CarDTO> searchCars(String query) {
        List<Car> cars = carRepository.findByMakeContainingIgnoreCase(query);
        cars.addAll(carRepository.findByModelContainingIgnoreCase(query));

        return cars.stream()
            .distinct()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public CarDTO saveCar(Car car) {
        Car savedCar = carRepository.save(car);
        return convertToDTO(savedCar);
    }

    public boolean deleteCar(Long id) {
        if (carRepository.existsById(id)) {
            carRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean existsByLicensePlate(String licensePlate) {
        return carRepository.existsByLicensePlate(licensePlate);
    }

    public boolean existsByLicensePlateAndNotId(String licensePlate, Long id) {
        return carRepository.existsByLicensePlateAndIdNot(licensePlate, id);
    }

    private CarDTO convertToDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setMake(car.getMake());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setColor(car.getColor());
        dto.setLicensePlate(car.getLicensePlate());
        dto.setDailyRate(car.getDailyRate());
        dto.setStatus(car.getStatus());
        dto.setDescription(car.getDescription());
        dto.setCreatedAt(car.getCreatedAt());
        dto.setUpdatedAt(car.getUpdatedAt());
        dto.setImageUrl(car.getImageUrl());
        return dto;
    }
}
