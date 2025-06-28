package com.urbandrives.app.dto;

import java.math.BigDecimal;

public class SalesReportSummaryDTO {
    private int totalBookings;
    private BigDecimal totalRevenue;
    private BigDecimal averageBookingValue;
    private int totalRentalDays;
    private String mostPopularCar;
    private String topCustomer;

    public SalesReportSummaryDTO() {}

    public SalesReportSummaryDTO(int totalBookings, BigDecimal totalRevenue,
                                 BigDecimal averageBookingValue, int totalRentalDays,
                                 String mostPopularCar, String topCustomer) {
        this.totalBookings = totalBookings;
        this.totalRevenue = totalRevenue;
        this.averageBookingValue = averageBookingValue;
        this.totalRentalDays = totalRentalDays;
        this.mostPopularCar = mostPopularCar;
        this.topCustomer = topCustomer;
    }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getAverageBookingValue() { return averageBookingValue; }
    public void setAverageBookingValue(BigDecimal averageBookingValue) { this.averageBookingValue = averageBookingValue; }

    public int getTotalRentalDays() { return totalRentalDays; }
    public void setTotalRentalDays(int totalRentalDays) { this.totalRentalDays = totalRentalDays; }

    public String getMostPopularCar() { return mostPopularCar; }
    public void setMostPopularCar(String mostPopularCar) { this.mostPopularCar = mostPopularCar; }

    public String getTopCustomer() { return topCustomer; }
    public void setTopCustomer(String topCustomer) { this.topCustomer = topCustomer; }
}
