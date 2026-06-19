package com.BookingHomeStay.BookingHomeStay.entity;

import java.time.LocalDateTime;

import com.BookingHomeStay.BookingHomeStay.enums.OtpPurpose;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import jakarta.persistence.Index;

@Data
@Entity
@Table(
  name = "otp_verifications",
  indexes = {
    @Index(name = "idx_otp_email_purpose", columnList = "email, purpose")
  }
)
public class OtpVerification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Email is required")
  @Column(nullable = false)
  private String email;

  @NotBlank(message = "OTP code is required")
  @Column(nullable = false, length = 10)
  private String otpCode;

  @NotNull(message = "OTP purpose is required")
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private OtpPurpose purpose;

  @NotNull(message = "OTP expiration time is required")
  @Column(nullable = false)
  private LocalDateTime expiresAt;

  @Column(nullable = false)
  private boolean verified;

  @Column(nullable = false)
  private boolean used;

  @Column(nullable = false)
  private int attempts = 0;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @PrePersist
  public void prePersist() {
    if (createdAt == null) {
      createdAt = LocalDateTime.now();
    }
  }

  public boolean isExpired() {
    return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
  }
}
