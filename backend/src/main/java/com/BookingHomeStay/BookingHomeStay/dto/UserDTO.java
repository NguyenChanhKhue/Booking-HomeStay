package com.BookingHomeStay.BookingHomeStay.dto;

import java.util.ArrayList;
import java.util.List;

import com.BookingHomeStay.BookingHomeStay.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
  private Long id;
  private String email;
  private String name;
  private String phoneNumber;
  private UserRole role;
  private List<BookingDTO> bookings = new ArrayList<>();
}
