package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.BookingHomeStay.BookingHomeStay.dto.BookingDTO;
import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.dto.RoomDTO;
import com.BookingHomeStay.BookingHomeStay.dto.UserDTO;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.BookingHomeStay.BookingHomeStay.entity.Room;
import com.BookingHomeStay.BookingHomeStay.entity.User;
import com.BookingHomeStay.BookingHomeStay.exception.BadRequestException;
import com.BookingHomeStay.BookingHomeStay.exception.ResourceNotFoundException;
import com.BookingHomeStay.BookingHomeStay.repository.BookingRepository;
import com.BookingHomeStay.BookingHomeStay.repository.RoomRepository;
import com.BookingHomeStay.BookingHomeStay.repository.UserRepository;
import com.BookingHomeStay.BookingHomeStay.service.BookingService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BookingServiceImpl implements BookingService {

  private final BookingRepository bookingRepository;
  private final RoomRepository roomRepository;
  private final UserRepository userRepository;

  @Override
  @Transactional
  public Response saveBooking(Long roomId, Long userId, Booking bookingRequest) {
    validateBookingRequest(bookingRequest);

    Room room = roomRepository.findById(roomId)
        .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!roomIsAvailable(bookingRequest.getCheckInDate(), bookingRequest.getCheckOutDate(), room.getBookings())) {
      throw new BadRequestException("Room is not available for the selected date range");
    }

    bookingRequest.setRoom(room);
    bookingRequest.setUser(user);
    bookingRequest.calculateTotalNumberOfGuest();
    bookingRequest.setBookingConfirmationCode(generateBookingConfirmationCode());

    long days = Math.max(1, java.time.temporal.ChronoUnit.DAYS.between(bookingRequest.getCheckInDate(), bookingRequest.getCheckOutDate()));
    bookingRequest.setTotalPrice(room.getRoomPrice().multiply(java.math.BigDecimal.valueOf(days)));

    Booking savedBooking = bookingRepository.save(bookingRequest);

    Response response = new Response();
    response.setStatusCode(201);
    response.setMessage("Save booking successfully");
    response.setBookingConfirmationCode(savedBooking.getBookingConfirmationCode());
    response.setBooking(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapBookingToDtoWithRelations(savedBooking));
    return response;
  }

  @Override
  public Response findBookingByConfirmationCode(String confirmationCode) {
    if (confirmationCode == null || confirmationCode.isBlank()) {
      throw new BadRequestException("Confirmation code is required");
    }

    Booking booking = bookingRepository.findByBookingConfirmationCode(confirmationCode.trim())
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get booking successfully");
    response.setBooking(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapBookingToDtoWithRelations(booking));
    return response;
  }

  @Override
  public Response getAllBookings() {
    List<BookingDTO> bookings = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
        .stream()
        .map(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper::mapBookingToDtoWithRelations)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get all bookings successfully");
    response.setBookingList(bookings);
    return response;
  }

  @Override
  @Transactional
  public Response cancelBooking(Long bookingId) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    booking.setStatus("CANCELLED");
    bookingRepository.save(booking);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Cancel booking successfully");
    return response;
  }

  @Override
  @Transactional
  public Response updateBookingStatus(Long bookingId, String status) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    if (!java.util.List.of("PENDING", "CONFIRMED", "CANCELLED", "COMPLETED").contains(status)) {
      throw new BadRequestException("Invalid status. Allowed values are: PENDING, CONFIRMED, CANCELLED, COMPLETED");
    }

    booking.setStatus(status);
    Booking savedBooking = bookingRepository.save(booking);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Update booking status successfully");
    response.setBooking(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapBookingToDtoWithRelations(savedBooking));
    return response;
  }

  private void validateBookingRequest(Booking bookingRequest) {
    if (bookingRequest == null) {
      throw new BadRequestException("Booking request is required");
    }
    if (bookingRequest.getCheckInDate() == null || bookingRequest.getCheckOutDate() == null) {
      throw new BadRequestException("Check in date and check out date are required");
    }
    if (!bookingRequest.getCheckOutDate().isAfter(bookingRequest.getCheckInDate())) {
      throw new BadRequestException("Check out date must be after check in date");
    }
    if (!bookingRequest.getCheckInDate().isAfter(LocalDate.now().minusDays(1))) {
      throw new BadRequestException("Check in date must be today or in the future");
    }
    if (bookingRequest.getNumOfAdults() < 1) {
      throw new BadRequestException("Number of adults must be at least 1");
    }
    if (bookingRequest.getNumOfChildren() < 0) {
      throw new BadRequestException("Number of children must not be negative");
    }
  }

  private boolean roomIsAvailable(LocalDate checkInDate, LocalDate checkOutDate, List<Booking> existingBookings) {
    return existingBookings.stream()
        .filter(b -> !"CANCELLED".equals(b.getStatus()))
        .noneMatch(existingBooking -> checkInDate.isBefore(existingBooking.getCheckOutDate())
            && checkOutDate.isAfter(existingBooking.getCheckInDate()));
  }

  private String generateBookingConfirmationCode() {
    return UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
  }
}
