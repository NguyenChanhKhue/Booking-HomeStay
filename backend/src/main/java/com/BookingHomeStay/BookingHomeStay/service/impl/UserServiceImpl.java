package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.util.List;

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
import com.BookingHomeStay.BookingHomeStay.repository.UserRepository;
import com.BookingHomeStay.BookingHomeStay.service.UserService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  @Override
  public Response getAllUsers() {
    List<UserDTO> users = userRepository.findAll()
        .stream()
        .map(this::mapUserToUserDtoWithoutBookings)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get all users successfully");
    response.setUserList(users);
    return response;
  }

  @Override
  public Response getUserBookingHistory(String userId) {
    User user = findUserById(userId);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get user booking history successfully");
    response.setUser(mapUserToUserDtoWithBookings(user));
    response.setBookingList(user.getBookings().stream().map(this::mapBookingToBookingDto).toList());
    return response;
  }

  @Override
  @Transactional
  public Response deleteUser(String userId) {
    User user = findUserById(userId);
    userRepository.delete(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Delete user successfully");
    return response;
  }

  @Override
  public Response getUserById(String userId) {
    User user = findUserById(userId);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get user successfully");
    response.setUser(mapUserToUserDtoWithBookings(user));
    return response;
  }

  @Override
  public Response getMyInfo(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get my info successfully");
    response.setUser(mapUserToUserDtoWithBookings(user));
    return response;
  }

  private User findUserById(String userId) {
    Long parsedUserId;
    try {
      parsedUserId = Long.parseLong(userId);
    } catch (NumberFormatException ex) {
      throw new BadRequestException("Invalid user id");
    }

    return userRepository.findById(parsedUserId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  private UserDTO mapUserToUserDtoWithoutBookings(User user) {
    UserDTO userDTO = new UserDTO();
    userDTO.setId(user.getId());
    userDTO.setEmail(user.getEmail());
    userDTO.setName(user.getName());
    userDTO.setPhoneNumber(user.getPhoneNumber());
    userDTO.setRole(user.getRole());
    return userDTO;
  }

  private UserDTO mapUserToUserDtoWithBookings(User user) {
    UserDTO userDTO = mapUserToUserDtoWithoutBookings(user);
    userDTO.setBookings(user.getBookings().stream().map(this::mapBookingToBookingDto).toList());
    return userDTO;
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
    bookingDTO.setStatus(booking.getStatus());
    bookingDTO.setRoom(mapRoomToRoomDto(booking.getRoom()));
    return bookingDTO;
  }

  private RoomDTO mapRoomToRoomDto(Room room) {
    if (room == null) {
      return null;
    }

    RoomDTO roomDTO = new RoomDTO();
    roomDTO.setId(room.getId());
    roomDTO.setRoomType(room.getRoomType());
    roomDTO.setRoomLocation(room.getRoomLocation());
    roomDTO.setRoomPrice(room.getRoomPrice());
    roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
    roomDTO.setRoomDescription(room.getRoomDescription());
    return roomDTO;
  }
}
