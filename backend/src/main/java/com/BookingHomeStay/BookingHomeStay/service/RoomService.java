package com.BookingHomeStay.BookingHomeStay.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.BookingHomeStay.BookingHomeStay.dto.Response;

public interface RoomService {
  Response addNewRoom(MultipartFile photo, List<MultipartFile> additionalPhotos, String roomType, String roomLocation, BigDecimal roomPrice,
      String description, List<String> amenities, Integer maxCapacity);

  List<String> getAllRoomTypes();

  Response getAllRooms();

  Response deleteRoom(Long roomId);

  Response updateRoom(Long roomId, String description, String roomType, String roomLocation, BigDecimal roomPrice,
      MultipartFile photo, List<MultipartFile> additionalPhotos, List<String> amenities, Integer maxCapacity);

  Response getRoomById(Long roomId);

  Response getAvailableRoomsByDataAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType);

  Response getAllAvailableRooms();

  Response searchRooms(String keyword, String location, String roomType, BigDecimal minPrice, BigDecimal maxPrice,
      LocalDate checkInDate, LocalDate checkOutDate, List<String> amenities);
}
