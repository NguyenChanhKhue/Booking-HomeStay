package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
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
  public Response addNewRoom(MultipartFile photo, List<MultipartFile> additionalPhotos, String roomType, String roomLocation, BigDecimal roomPrice,
      String description, List<String> amenities, Integer maxCapacity) {
    validateRoomData(roomType, roomLocation, roomPrice, description);

    Room room = new Room();
    room.setRoomType(roomType.trim());
    room.setRoomLocation(roomLocation.trim());
    room.setRoomPrice(roomPrice);
    room.setRoomDescription(description.trim());
    if (maxCapacity != null && maxCapacity > 0) {
      room.setMaxCapacity(maxCapacity);
    }
    room.setRoomPhotoUrl(cloudinaryService.uploadImage(photo, "booking-home-stay/rooms"));
    
    if (amenities != null && !(amenities.size() == 1 && amenities.get(0).trim().isEmpty())) {
      room.setAmenities(new ArrayList<>(amenities));
    }
    
    if (additionalPhotos != null && !additionalPhotos.isEmpty()) {
      List<String> additionalImages = new ArrayList<>();
      for (MultipartFile additionalPhoto : additionalPhotos) {
        if (additionalPhoto != null && !additionalPhoto.isEmpty()) {
          additionalImages.add(cloudinaryService.uploadImage(additionalPhoto, "booking-home-stay/rooms/additional"));
        }
      }
      room.setAdditionalImages(additionalImages);
    }

    Room savedRoom = roomRepository.save(room);

    Response response = new Response();
    response.setStatusCode(201);
    response.setMessage("Add new room successfully");
    response.setRoom(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapRoomToDto(savedRoom));
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
        .map(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper::mapRoomToDto)
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
  public Response updateRoom(Long roomId, String description, String roomType, String roomLocation, BigDecimal roomPrice, MultipartFile photo,
      List<MultipartFile> additionalPhotos, List<String> amenities, Integer maxCapacity) {
    Room room = findRoomById(roomId);

    if (roomType != null && !roomType.isBlank()) {
      room.setRoomType(roomType.trim());
    }

    if (roomLocation != null && !roomLocation.isBlank()) {
      room.setRoomLocation(roomLocation.trim());
    }

    if (roomPrice != null && roomPrice.compareTo(BigDecimal.ZERO) >= 0) {
      room.setRoomPrice(roomPrice);
    }

    if (maxCapacity != null && maxCapacity > 0) {
      room.setMaxCapacity(maxCapacity);
    }

    if (description != null && !description.isBlank()) {
      room.setRoomDescription(description.trim());
    }
    
    if (amenities != null) {
      room.getAmenities().clear();
      if (!(amenities.size() == 1 && amenities.get(0).trim().isEmpty())) {
        room.getAmenities().addAll(amenities);
      }
    }

    if (photo != null && !photo.isEmpty()) {
      room.setRoomPhotoUrl(cloudinaryService.uploadImage(photo, "booking-home-stay/rooms"));
    }

    if (additionalPhotos != null && !additionalPhotos.isEmpty()) {
      List<String> newAdditionalImages = new ArrayList<>();
      for (MultipartFile additionalPhoto : additionalPhotos) {
        if (additionalPhoto != null && !additionalPhoto.isEmpty()) {
          newAdditionalImages.add(cloudinaryService.uploadImage(additionalPhoto, "booking-home-stay/rooms/additional"));
        }
      }
      if (!newAdditionalImages.isEmpty()) {
        room.setAdditionalImages(newAdditionalImages); // overwrite existing for simplicity
      }
    }

    Room updatedRoom = roomRepository.save(room);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Update room successfully");
    response.setRoom(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapRoomToDto(updatedRoom));
    return response;
  }

  @Override
  public Response getRoomById(Long roomId) {
    Room room = findRoomById(roomId);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get room successfully");
    response.setRoom(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapRoomToDtoWithBookings(room));
    return response;
  }

  @Override
  public Response getAvailableRoomsByDataAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
    validateDateRange(checkInDate, checkOutDate);

    String normalizedRoomType = roomType == null ? "" : roomType.trim();
    List<RoomDTO> rooms = roomRepository.findAvailableRoomsByDatesAndTypes(checkInDate, checkOutDate, normalizedRoomType)
        .stream()
        .map(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper::mapRoomToDto)
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
        .map(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper::mapRoomToDto)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get all available rooms successfully");
    response.setRoomList(rooms);
    return response;
  }

  @Override
  public Response searchRooms(String keyword, String location, String roomType, BigDecimal minPrice, BigDecimal maxPrice,
      LocalDate checkInDate, LocalDate checkOutDate, List<String> amenities) {
    validateSearchFilters(minPrice, maxPrice, checkInDate, checkOutDate);

    List<RoomDTO> rooms = roomRepository.searchRooms(
        normalizeText(keyword),
        normalizeText(location),
        normalizeText(roomType),
        minPrice,
        maxPrice,
        checkInDate,
        checkOutDate)
        .stream()
        .filter(r -> {
            if (amenities == null || amenities.isEmpty()) return true;
            // Check if room has ALL requested amenities
            return r.getAmenities() != null && r.getAmenities().containsAll(amenities);
        })
        .map(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper::mapRoomToDto)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Search rooms successfully");
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

  private void validateRoomData(String roomType, String roomLocation, BigDecimal roomPrice, String description) {
    if (roomType == null || roomType.isBlank()) {
      throw new BadRequestException("Room type is required");
    }
    if (roomLocation == null || roomLocation.isBlank()) {
      throw new BadRequestException("Room location is required");
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

  private void validateSearchFilters(BigDecimal minPrice, BigDecimal maxPrice, LocalDate checkInDate,
      LocalDate checkOutDate) {
    if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) < 0) {
      throw new BadRequestException("Minimum price must be greater than or equal to 0");
    }
    if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) <= 0) {
      throw new BadRequestException("Maximum price must be greater than 0");
    }
    if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
      throw new BadRequestException("Minimum price must be less than or equal to maximum price");
    }

    boolean hasCheckInDate = checkInDate != null;
    boolean hasCheckOutDate = checkOutDate != null;
    if (hasCheckInDate != hasCheckOutDate) {
      throw new BadRequestException("Check in date and check out date must be provided together");
    }
    if (hasCheckInDate) {
      validateDateRange(checkInDate, checkOutDate);
    }
  }

  private String normalizeText(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }
    return value.trim();
  }

}
