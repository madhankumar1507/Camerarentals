package com.camerarentals.dto.response;

import com.camerarentals.model.Booking;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingResponse {
    private Long id;
    private UserResponse user;
    private CameraResponse camera;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalCost;
    private Booking.Status status;
    private String notes;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long durationInDays;
    private boolean active;
}