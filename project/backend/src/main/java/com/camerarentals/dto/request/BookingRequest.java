package com.camerarentals.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull
    private Long cameraId;

    @NotNull
    @Future
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private String notes;
}