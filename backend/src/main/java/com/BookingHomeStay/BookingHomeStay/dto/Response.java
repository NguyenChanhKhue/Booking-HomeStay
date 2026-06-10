package com.BookingHomeStay.BookingHomeStay.dto;

import java.util.List;

import com.BookingHomeStay.BookingHomeStay.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {
  private int statusCode;
  private String message;

  private String token;
  private UserRole role;
  private String expirationTime;
  private String bookingConfirmationCode;
  private String paymentUrl;

  private UserDTO user;
  private RoomDTO room;
  private BookingDTO booking;
  private List<UserDTO> userList;
  private List<RoomDTO> roomList;
  private List<BookingDTO> bookingList;
}
