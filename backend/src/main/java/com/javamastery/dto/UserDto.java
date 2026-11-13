package com.javamastery.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDto {
    private UUID id;
    private String email;
    private String fullName;
    private String profileImageUrl;
    private String role;
    private String paymentStatus;
    private boolean courseAccess;
    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(UUID id, String email, String fullName, String profileImageUrl,
                   String role, String paymentStatus, boolean courseAccess, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.profileImageUrl = profileImageUrl;
        this.role = role;
        this.paymentStatus = paymentStatus;
        this.courseAccess = courseAccess;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public boolean isCourseAccess() { return courseAccess; }
    public void setCourseAccess(boolean courseAccess) { this.courseAccess = courseAccess; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
