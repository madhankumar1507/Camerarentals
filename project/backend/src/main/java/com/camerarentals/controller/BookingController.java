package com.camerarentals.controller;

import com.camerarentals.dto.request.BookingRequest;
import com.camerarentals.dto.response.ApiResponse;
import com.camerarentals.dto.response.BookingResponse;
import com.camerarentals.model.Booking;
import com.camerarentals.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest bookingRequest) {
        BookingResponse booking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking created successfully", booking));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getUserBookings(
            @RequestParam(required = false) Booking.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<BookingResponse> bookings = bookingService.getUserBookings(status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "User bookings retrieved successfully", bookings));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) Booking.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<BookingResponse> bookings = bookingService.getAllBookings(status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "All bookings retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking retrieved successfully", booking));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam Booking.Status status,
            @RequestParam(required = false) String adminNotes) {
        
        BookingResponse booking = bookingService.updateBookingStatus(id, status, adminNotes);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking status updated successfully", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id) {
        BookingResponse booking = bookingService.cancelBooking(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking cancelled successfully", booking));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getPendingBookings() {
        List<BookingResponse> bookings = bookingService.getPendingBookings();
        return ResponseEntity.ok(new ApiResponse<>(true, "Pending bookings retrieved successfully", bookings));
    }
}