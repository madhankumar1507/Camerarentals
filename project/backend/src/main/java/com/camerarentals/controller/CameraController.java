package com.camerarentals.controller;

import com.camerarentals.dto.request.CameraRequest;
import com.camerarentals.dto.response.ApiResponse;
import com.camerarentals.dto.response.CameraResponse;
import com.camerarentals.model.Camera;
import com.camerarentals.service.CameraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cameras")
@RequiredArgsConstructor
public class CameraController {

    private final CameraService cameraService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CameraResponse>>> getCameras(
            @RequestParam(required = false) Camera.Category category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean availability,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sort) {
        
        Page<CameraResponse> cameras = cameraService.getCameras(
            category, brand, minPrice, maxPrice, availability, search, page, size, sort);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Cameras retrieved successfully", cameras));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CameraResponse>> getCameraById(@PathVariable Long id) {
        CameraResponse camera = cameraService.getCameraById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Camera retrieved successfully", camera));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CameraResponse>> createCamera(@Valid @RequestBody CameraRequest cameraRequest) {
        CameraResponse camera = cameraService.createCamera(cameraRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Camera created successfully", camera));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CameraResponse>> updateCamera(
            @PathVariable Long id, @Valid @RequestBody CameraRequest cameraRequest) {
        CameraResponse camera = cameraService.updateCamera(id, cameraRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Camera updated successfully", camera));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCamera(@PathVariable Long id) {
        cameraService.deleteCamera(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Camera deleted successfully", null));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CameraResponse>>> getFeaturedCameras() {
        List<CameraResponse> cameras = cameraService.getFeaturedCameras();
        return ResponseEntity.ok(new ApiResponse<>(true, "Featured cameras retrieved successfully", cameras));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<CameraResponse>>> getPopularCameras() {
        List<CameraResponse> cameras = cameraService.getPopularCameras();
        return ResponseEntity.ok(new ApiResponse<>(true, "Popular cameras retrieved successfully", cameras));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<CameraResponse>>> getCamerasByCategory(@PathVariable Camera.Category category) {
        List<CameraResponse> cameras = cameraService.getCamerasByCategory(category);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cameras retrieved successfully", cameras));
    }

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<List<String>>> getAllBrands() {
        List<String> brands = cameraService.getAllBrands();
        return ResponseEntity.ok(new ApiResponse<>(true, "Brands retrieved successfully", brands));
    }
}