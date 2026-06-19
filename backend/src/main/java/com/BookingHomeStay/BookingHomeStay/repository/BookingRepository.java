package com.BookingHomeStay.BookingHomeStay.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BookingHomeStay.BookingHomeStay.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
  Optional<Booking> findByBookingConfirmationCode(String confirmationCode);
  java.util.List<Booking> findByBookingConfirmationCodeStartingWith(String prefix);

  @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.paymentStatus = 'UNPAID' AND b.status = 'PENDING' AND b.createdAt < :cutoffTime")
  java.util.List<Booking> findUnpaidBookingsBefore(@org.springframework.data.repository.query.Param("cutoffTime") java.time.LocalDateTime cutoffTime);
}
