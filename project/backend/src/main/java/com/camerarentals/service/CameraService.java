package com.camerarentals.service;

import com.camerarentals.dto.request.CameraRequest;
import com.camerarentals.dto.response.CameraResponse;
import com.camerarentals.exception.ResourceNotFoundException;
import com.camerarentals.model.Camera;
import com.camerarentals.repository.CameraRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CameraService {

    private final CameraRepository cameraRepository;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public Page<CameraResponse> getCameras(Camera.Category category, String brand, 
                                         BigDecimal minPrice, BigDecimal maxPrice, 
                                         Boolean availability, String search, 
                                         int page, int size, String sort) {
        
        Sort.Direction direction = Sort.Direction.ASC;
        String sortField = "name";
        
        if (sort != null) {
            switch (sort) {
                case "price-low" -> {
                    sortField = "rentPerDay";
                    direction = Sort.Direction.ASC;
                }
                case "price-high" -> {
                    sortField = "rentPerDay";
                    direction = Sort.Direction.DESC;
                }
                case "newest" -> {
                    sortField = "createdAt";
                    direction = Sort.Direction.DESC;
                }
                case "name" -> {
                    sortField = "name";
                    direction = Sort.Direction.ASC;
                }
            }
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        
        Page<Camera> cameras = cameraRepository.findCamerasWithFilters(
            category, brand, minPrice, maxPrice, availability, search, pageable);
        
        return cameras.map(this::mapToCameraResponse);
    }

    @Transactional(readOnly = true)
    public CameraResponse getCameraById(Long id) {
        Camera camera = cameraRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Camera not found with id: " + id));
        return mapToCameraResponse(camera);
    }

    public CameraResponse createCamera(CameraRequest cameraRequest) {
        Camera camera = modelMapper.map(cameraRequest, Camera.class);
        Camera savedCamera = cameraRepository.save(camera);
        return mapToCameraResponse(savedCamera);
    }

    public CameraResponse updateCamera(Long id, CameraRequest cameraRequest) {
        Camera camera = cameraRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Camera not found with id: " + id));

        modelMapper.map(cameraRequest, camera);
        Camera updatedCamera = cameraRepository.save(camera);
        return mapToCameraResponse(updatedCamera);
    }

    public void deleteCamera(Long id) {
        Camera camera = cameraRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Camera not found with id: " + id));
        cameraRepository.delete(camera);
    }

    @Transactional(readOnly = true)
    public List<CameraResponse> getFeaturedCameras() {
        Pageable pageable = PageRequest.of(0, 8);
        List<Camera> cameras = cameraRepository.findFeaturedCameras(pageable);
        return cameras.stream()
            .map(this::mapToCameraResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CameraResponse> getPopularCameras() {
        Pageable pageable = PageRequest.of(0, 6);
        List<Camera> cameras = cameraRepository.findPopularCameras(pageable);
        return cameras.stream()
            .map(this::mapToCameraResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CameraResponse> getCamerasByCategory(Camera.Category category) {
        List<Camera> cameras = cameraRepository.findByCategory(category);
        return cameras.stream()
            .map(this::mapToCameraResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getAllBrands() {
        return cameraRepository.findAllBrands();
    }

    private CameraResponse mapToCameraResponse(Camera camera) {
        CameraResponse response = modelMapper.map(camera, CameraResponse.class);
        response.setAverageRating(camera.getAverageRating());
        response.setTotalReviews(camera.getTotalReviews());
        return response;
    }
}