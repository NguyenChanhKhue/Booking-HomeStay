package com.BookingHomeStay.BookingHomeStay.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingDTO {
  private Long id;
  private LocalDate checkInDate;
  private LocalDate checkOutDate;
  private int numOfAdults;
  private int numOfChildren;
  private int totalNumOfGuest;
  private String bookingConfirmationCode;
  private String status;
  private String paymentStatus;
  private String paymentMethod;
  private UserDTO user;
  private RoomDTO room;
}
