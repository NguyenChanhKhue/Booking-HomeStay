package com.BookingHomeStay.BookingHomeStay.service;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;

public interface BookingService {
  Response saveBooking(Long roomId, Long userId, Booking bookingRequest);

  Response findBookingByConfirmationCode(String confirmationCode);

  Response getAllBookings();

  Response cancelBooking(Long bookingId);

  Response updateBookingStatus(Long bookingId, String status);
}
