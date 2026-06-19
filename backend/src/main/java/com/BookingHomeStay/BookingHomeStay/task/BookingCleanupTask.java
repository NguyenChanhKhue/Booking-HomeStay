package com.BookingHomeStay.BookingHomeStay.task;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.BookingHomeStay.BookingHomeStay.repository.BookingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupTask {

  private final BookingRepository bookingRepository;

  // Run every hour
  @Scheduled(fixedRate = 3600000)
  public void cancelUnpaidBookings() {
    log.info("Running scheduled task: Cancel unpaid bookings older than 24 hours...");
    LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);
    
    List<Booking> expiredBookings = bookingRepository.findUnpaidBookingsBefore(cutoffTime);
    
    if (!expiredBookings.isEmpty()) {
      for (Booking booking : expiredBookings) {
        booking.setStatus("CANCELLED");
        log.info("Cancelled booking ID: " + booking.getId() + " due to non-payment within 24 hours.");
      }
      bookingRepository.saveAll(expiredBookings);
      log.info("Successfully cancelled " + expiredBookings.size() + " unpaid bookings.");
    } else {
      log.info("No unpaid bookings to cancel.");
    }
  }
}
