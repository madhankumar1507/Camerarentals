package com.camerarentals.repository;

import com.camerarentals.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // ✅ Added
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> { // ✅ Extended here

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByStatus(Booking.Status status);

    Page<Booking> findByUserIdAndStatus(Long userId, Booking.Status status, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND " +
           "(:status IS NULL OR b.status = :status) " +
           "ORDER BY b.createdAt DESC")
    Page<Booking> findUserBookings(
            @Param("userId") Long userId,
            @Param("status") Booking.Status status,
            Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE " +
           "b.camera.id = :cameraId AND " +
           "b.status IN ('PENDING', 'APPROVED', 'ACTIVE') AND " +
           "((b.startDate <= :endDate) AND (b.endDate >= :startDate))")
    List<Booking> findConflictingBookings(
            @Param("cameraId") Long cameraId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(Booking.Status status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :since")
    long countBookingsSince(LocalDateTime since);

    @Query("SELECT SUM(b.totalCost) FROM Booking b WHERE b.status = 'COMPLETED'")
    Double getTotalRevenue();

    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' ORDER BY b.createdAt ASC")
    List<Booking> findPendingBookings();

    @Query("SELECT b FROM Booking b WHERE b.status IN ('APPROVED', 'ACTIVE') AND b.user.id = :userId")
    List<Booking> findActiveBookingsByUser(@Param("userId") Long userId);
}
