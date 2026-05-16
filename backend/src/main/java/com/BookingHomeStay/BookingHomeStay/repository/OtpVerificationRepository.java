package com.BookingHomeStay.BookingHomeStay.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.BookingHomeStay.BookingHomeStay.entity.OtpVerification;
import com.BookingHomeStay.BookingHomeStay.enums.OtpPurpose;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
  Optional<OtpVerification> findTopByEmailAndPurposeOrderByCreatedAtDesc(String email, OtpPurpose purpose);

  Optional<OtpVerification> findTopByEmailAndOtpCodeAndPurposeOrderByCreatedAtDesc(
      String email,
      String otpCode,
      OtpPurpose purpose);

  @Transactional
  void deleteByEmailAndPurpose(String email, OtpPurpose purpose);
}
