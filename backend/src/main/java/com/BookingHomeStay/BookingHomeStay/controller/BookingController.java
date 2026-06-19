package com.BookingHomeStay.BookingHomeStay.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.BookingHomeStay.BookingHomeStay.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
  private final BookingService bookingService;

  @PostMapping("/room/{roomId}/user/{userId}")
  @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
  public ResponseEntity<Response> saveBooking(
      @PathVariable Long roomId,
      @PathVariable Long userId,
      @Validated @RequestBody Booking bookingRequest) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(bookingService.saveBooking(roomId, userId, bookingRequest));
  }

  @GetMapping
  @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Response> getAllBookings() {
    return ResponseEntity.ok(bookingService.getAllBookings());
  }

  @GetMapping("/{confirmationCode}")
  public ResponseEntity<Response> findBookingByConfirmationCode(@PathVariable String confirmationCode) {
    return ResponseEntity.ok(bookingService.findBookingByConfirmationCode(confirmationCode));
  }

  @DeleteMapping("/{bookingId}")
  @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
  public ResponseEntity<Response> cancelBooking(@PathVariable Long bookingId) {
    return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
  }

  @org.springframework.web.bind.annotation.PatchMapping("/{bookingId}/status")
  @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Response> updateBookingStatus(
      @PathVariable Long bookingId,
      @RequestBody java.util.Map<String, String> requestBody) {
    String status = requestBody.get("status");
    return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status));
  }
}
