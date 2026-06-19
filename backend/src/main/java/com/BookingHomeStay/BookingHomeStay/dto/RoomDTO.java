package com.BookingHomeStay.BookingHomeStay.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomDTO {
  private Long id;
  private String roomType;
  private String roomLocation;
  private BigDecimal roomPrice;
  private Integer maxCapacity;
  private String roomPhotoUrl;
  private String roomDescription;
  private List<String> additionalImages = new ArrayList<>();
  private List<String> amenities = new ArrayList<>();
  private List<BookingDTO> bookings = new ArrayList<>();
  private Integer bookingCount;
}
