package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.BookingHomeStay.BookingHomeStay.dto.BookingDTO;
import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.dto.RoomDTO;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.BookingHomeStay.BookingHomeStay.entity.Room;
import com.BookingHomeStay.BookingHomeStay.exception.BadRequestException;
import com.BookingHomeStay.BookingHomeStay.exception.ResourceNotFoundException;
import com.BookingHomeStay.BookingHomeStay.repository.RoomRepository;
import com.BookingHomeStay.BookingHomeStay.service.CloudinaryService;
import com.BookingHomeStay.BookingHomeStay.service.RoomService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RoomServiceImpl implements RoomService {

  private final RoomRepository roomRepository;
  private final CloudinaryService cloudinaryService;

  @Override
  @Transactional
  public Response addNewRoom(MultipartFile photo, String roomType, BigDecimal roomPrice, String description) {
    validateRoomData(roomType, roomPrice, description);

    Room room = new Room();
    room.setRoomType(roomType.trim());
    room.setRoomPrice(roomPrice);
    room.setRoomDescription(description.trim());
    room.setRoomPhotoUrl(cloudinaryService.uploadImage(photo, "booking-home-stay/rooms"));

    Room savedRoom = roomRepository.save(room);

    Response response = new Response();
    response.setStatusCode(201);
    response.setMessage("Add new room successfully");
    response.setRoom(mapRoomToRoomDto(savedRoom));
    return response;
  }

  @Override
  public List<String> getAllRoomTypes() {
    return roomRepository.findDistinctRoomTypes();
  }

  @Override
  public Response getAllRooms() {
    List<RoomDTO> rooms = roomRepository.findAll()
        .stream()
        .map(this::mapRoomToRoomDto)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get all rooms successfully");
    response.setRoomList(rooms);
    return response;
  }

  @Override
  @Transactional
  public Response deleteRoom(Long roomId) {
    Room room = findRoomById(roomId);
    roomRepository.delete(room);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Delete room successfully");
    return response;
  }

  @Override
  @Transactional
  public Response updateRoom(Long roomId, String description, String roomType, BigDecimal roomPrice, MultipartFile photo) {
    Room room = findRoomById(roomId);

    if (roomType != null && !roomType.isBlank()) {
      room.setRoomType(roomType.trim());
    }

    if (roomPrice != null) {
      if (roomPrice.compareTo(BigDecimal.ZERO) <= 0) {
        throw new BadRequestException("Room price must be greater than 0");
      }
      room.setRoomPrice(roomPrice);
    }

    if (description != null && !description.isBlank()) {
      room.setRoomDescription(description.trim());
    }

    if (photo != null && !photo.isEmpty()) {
      room.setRoomPhotoUrl(cloudinaryService.uploadImage(photo, "booking-home-stay/rooms"));
    }

    Room updatedRoom = roomRepository.save(room);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Update room successfully");
    response.setRoom(mapRoomToRoomDto(updatedRoom));
    return response;
  }

  @Override
  public Response getRoomById(Long roomId) {
    Room room = findRoomById(roomId);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get room successfully");
    response.setRoom(mapRoomToRoomDtoWithBookings(room));
    return response;
  }

  @Override
  public Response getAvailableRoomsByDataAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
    validateDateRange(checkInDate, checkOutDate);

    String normalizedRoomType = roomType == null ? "" : roomType.trim();
    List<RoomDTO> rooms = roomRepository.findAvailableRoomsByDatesAndTypes(checkInDate, checkOutDate, normalizedRoomType)
        .stream()
        .map(this::mapRoomToRoomDto)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get available rooms successfully");
    response.setRoomList(rooms);
    return response;
  }

  @Override
  public Response getAllAvailableRooms() {
    List<RoomDTO> rooms = roomRepository.getAllAvailableRooms()
        .stream()
        .map(this::mapRoomToRoomDto)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get all available rooms successfully");
    response.setRoomList(rooms);
    return response;
  }

  private Room findRoomById(Long roomId) {
    if (roomId == null) {
      throw new BadRequestException("Room id is required");
    }

    return roomRepository.findById(roomId)
        .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
  }

  private void validateRoomData(String roomType, BigDecimal roomPrice, String description) {
    if (roomType == null || roomType.isBlank()) {
      throw new BadRequestException("Room type is required");
    }
    if (roomPrice == null || roomPrice.compareTo(BigDecimal.ZERO) <= 0) {
      throw new BadRequestException("Room price must be greater than 0");
    }
    if (description == null || description.isBlank()) {
      throw new BadRequestException("Room description is required");
    }
  }

  private void validateDateRange(LocalDate checkInDate, LocalDate checkOutDate) {
    if (checkInDate == null || checkOutDate == null) {
      throw new BadRequestException("Check in date and check out date are required");
    }
    if (!checkOutDate.isAfter(checkInDate)) {
      throw new BadRequestException("Check out date must be after check in date");
    }
  }

  private RoomDTO mapRoomToRoomDto(Room room) {
    RoomDTO roomDTO = new RoomDTO();
    roomDTO.setId(room.getId());
    roomDTO.setRoomType(room.getRoomType());
    roomDTO.setRoomPrice(room.getRoomPrice());
    roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
    roomDTO.setRoomDescription(room.getRoomDescription());
    return roomDTO;
  }

  private RoomDTO mapRoomToRoomDtoWithBookings(Room room) {
    RoomDTO roomDTO = mapRoomToRoomDto(room);
    roomDTO.setBookings(room.getBookings().stream().map(this::mapBookingToBookingDto).toList());
    return roomDTO;
  }

  private BookingDTO mapBookingToBookingDto(Booking booking) {
    BookingDTO bookingDTO = new BookingDTO();
    bookingDTO.setId(booking.getId());
    bookingDTO.setCheckInDate(booking.getCheckInDate());
    bookingDTO.setCheckOutDate(booking.getCheckOutDate());
    bookingDTO.setNumOfAdults(booking.getNumOfAdults());
    bookingDTO.setNumOfChildren(booking.getNumOfChildren());
    bookingDTO.setTotalNumOfGuest(booking.getTotalNumOfGuest());
    bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
    return bookingDTO;
  }
}
