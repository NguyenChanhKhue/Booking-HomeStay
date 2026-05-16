package com.BookingHomeStay.BookingHomeStay.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BookingHomeStay.BookingHomeStay.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
  Optional<Booking> findByBookingConfirmationCode(String confirmationCode);
}
