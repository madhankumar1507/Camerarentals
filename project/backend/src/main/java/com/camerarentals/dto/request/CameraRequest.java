package com.camerarentals.dto.request;

import com.camerarentals.model.Camera;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CameraRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotNull
    private Camera.Category category;

    private String description;

    private List<String> features;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal rentPerDay;

    private List<String> images;

    @NotNull
    private Boolean availability = true;

    @NotNull
    @Min(0)
    private Integer stockQuantity = 1;
}