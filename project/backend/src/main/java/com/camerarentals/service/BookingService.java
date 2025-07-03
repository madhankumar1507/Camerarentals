package com.camerarentals.service;

import com.camerarentals.dto.request.BookingRequest;
import com.camerarentals.dto.response.BookingResponse;
import com.camerarentals.exception.BadRequestException;
import com.camerarentals.exception.ResourceNotFoundException;
import com.camerarentals.model.Booking;
import com.camerarentals.model.Camera;
import com.camerarentals.model.User;
import com.camerarentals.repository.BookingRepository;
import com.camerarentals.repository.CameraRepository;
import com.camerarentals.repository.UserRepository;
import com.camerarentals.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CameraRepository cameraRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public BookingResponse createBooking(BookingRequest bookingRequest) {
        UserPrincipal userPrincipal = getCurrentUser();
        User user = userRepository.findById(userPrincipal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Camera camera = cameraRepository.findById(bookingRequest.getCameraId())
            .orElseThrow(() -> new ResourceNotFoundException("Camera not found"));

        // Validate booking dates
        validateBookingDates(bookingRequest.getStartDate(), bookingRequest.getEndDate());

        // Check camera availability
        if (!camera.getAvailability()) {
            throw new BadRequestException("Camera is not available for rental");
        }

        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
            camera.getId(), bookingRequest.getStartDate(), bookingRequest.getEndDate());
        
        if (!conflictingBookings.isEmpty()) {
            throw new BadRequestException("Camera is already booked for the selected dates");
        }

        // Calculate total cost
        long durationInDays = bookingRequest.getStartDate().until(bookingRequest.getEndDate()).getDays() + 1;
        BigDecimal totalCost = camera.getRentPerDay().multiply(BigDecimal.valueOf(durationInDays));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCamera(camera);
        booking.setStartDate(bookingRequest.getStartDate());
        booking.setEndDate(bookingRequest.getEndDate());
        booking.setTotalCost(totalCost);
        booking.setNotes(bookingRequest.getNotes());
        booking.setStatus(Booking.Status.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        return mapToBookingResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getUserBookings(Booking.Status status, int page, int size) {
        UserPrincipal userPrincipal = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<Booking> bookings = bookingRepository.findUserBookings(userPrincipal.getId(), status, pageable);
        return bookings.map(this::mapToBookingResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookings(Booking.Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<Booking> bookings;
        if (status != null) {
            bookings = bookingRepository.findAll(
                (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status),
                pageable);
        } else {
            bookings = bookingRepository.findAll(pageable);
        }
        
        return bookings.map(this::mapToBookingResponse);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        // Check if user has permission to view this booking
        UserPrincipal userPrincipal = getCurrentUser();
        if (!userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")) &&
            !booking.getUser().getId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Access denied");
        }
        
        return mapToBookingResponse(booking);
    }

    public BookingResponse updateBookingStatus(Long id, Booking.Status status, String adminNotes) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(status);
        booking.setAdminNotes(adminNotes);

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToBookingResponse(updatedBooking);
    }

    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        UserPrincipal userPrincipal = getCurrentUser();
        
        // Check if user has permission to cancel this booking
        if (!userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")) &&
            !booking.getUser().getId().equals(userPrincipal.getId())) {
            throw new BadRequestException("Access denied");
        }

        // Only allow cancellation of pending or approved bookings
        if (booking.getStatus() != Booking.Status.PENDING && booking.getStatus() != Booking.Status.APPROVED) {
            throw new BadRequestException("Cannot cancel booking in current status");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToBookingResponse(updatedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getPendingBookings() {
        List<Booking> bookings = bookingRepository.findPendingBookings();
        return bookings.stream()
            .map(this::mapToBookingResponse)
            .collect(Collectors.toList());
    }

    private void validateBookingDates(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();
        
        if (startDate.isBefore(today)) {
            throw new BadRequestException("Start date cannot be in the past");
        }
        
        if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
            throw new BadRequestException("End date must be after start date");
        }
        
        long durationInDays = startDate.until(endDate).getDays() + 1;
        if (durationInDays > 30) {
            throw new BadRequestException("Maximum rental period is 30 days");
        }
    }

    private UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        BookingResponse response = modelMapper.map(booking, BookingResponse.class);
        response.setDurationInDays(booking.getDurationInDays());
        response.setActive(booking.isActive());
        return response;
    }
}