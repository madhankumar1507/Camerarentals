package com.camerarentals.repository;

import com.camerarentals.model.Camera;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CameraRepository extends JpaRepository<Camera, Long> {
    
    List<Camera> findByCategory(Camera.Category category);
    
    List<Camera> findByBrandIgnoreCase(String brand);
    
    List<Camera> findByAvailabilityTrue();
    
    @Query("SELECT c FROM Camera c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:minPrice IS NULL OR c.rentPerDay >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.rentPerDay <= :maxPrice) AND " +
           "(:availability IS NULL OR c.availability = :availability) AND " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.model) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Camera> findCamerasWithFilters(
            @Param("category") Camera.Category category,
            @Param("brand") String brand,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("availability") Boolean availability,
            @Param("search") String search,
            Pageable pageable);
    
    @Query("SELECT DISTINCT c.brand FROM Camera c ORDER BY c.brand")
    List<String> findAllBrands();
    
    @Query("SELECT c FROM Camera c WHERE c.availability = true ORDER BY c.createdAt DESC")
    List<Camera> findFeaturedCameras(Pageable pageable);
    
    @Query("SELECT c FROM Camera c WHERE c.availability = true ORDER BY c.rentPerDay DESC")
    List<Camera> findPopularCameras(Pageable pageable);
}