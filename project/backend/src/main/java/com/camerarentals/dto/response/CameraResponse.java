package com.camerarentals.dto.response;

import com.camerarentals.model.Camera;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CameraResponse {
    private Long id;
    private String name;
    private String brand;
    private String model;
    private Camera.Category category;
    private String description;
    private List<String> features;
    private BigDecimal rentPerDay;
    private List<String> images;
    private Boolean availability;
    private Integer stockQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private double averageRating;
    private int totalReviews;
}