package com.camerarentals.repository;

import com.camerarentals.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByCameraIdOrderByCreatedAtDesc(Long cameraId);
    
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Page<Review> findByCameraId(Long cameraId, Pageable pageable);
    
    Optional<Review> findByUserIdAndBookingId(Long userId, Long bookingId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.camera.id = :cameraId")
    Double getAverageRatingByCameraId(@Param("cameraId") Long cameraId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.camera.id = :cameraId")
    long countByCameraId(@Param("cameraId") Long cameraId);
}