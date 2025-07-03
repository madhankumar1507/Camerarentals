package com.camerarentals.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "cameras")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Camera {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(length = 100)
    private String name;

    @NotBlank
    @Column(length = 50)
    private String brand;

    @NotBlank
    @Column(length = 100)
    private String model;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Category category;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "camera_features", joinColumns = @JoinColumn(name = "camera_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal rentPerDay;

    @ElementCollection
    @CollectionTable(name = "camera_images", joinColumns = @JoinColumn(name = "camera_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @NotNull
    private Boolean availability = true;

    @NotNull
    @Min(0)
    private Integer stockQuantity = 1;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "camera", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "camera", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Review> reviews = new HashSet<>();

    public enum Category {
        DSLR, MIRRORLESS, GOPRO, DRONE, FILM, INSTANT, LENS, ACCESSORY
    }

    public double getAverageRating() {
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    public int getTotalReviews() {
        return reviews.size();
    }
}