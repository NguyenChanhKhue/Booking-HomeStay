package com.BookingHomeStay.BookingHomeStay.entity;

import jakarta.persistence.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import org.hibernate.annotations.Check;

@Data
@Entity
@Table(
  name = "bookings", 
  indexes = {
    @Index(name = "idx_booking_code", columnList = "bookingConfirmationCode"),
    @Index(name = "idx_booking_status", columnList = "status")
  }
)
@Check(constraints = "status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') AND paymentStatus IN ('UNPAID', 'PAID', 'REFUNDED')")
public class Booking {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull(message = "check in date is required")
  private LocalDate checkInDate;

  @NotNull(message = "check out date is required")
  @Future(message = "check out date must be in the future")
  private LocalDate checkOutDate;

  @Min(value = 1, message = "Number of adults must not be less that 1")
  private int numOfAdults;

  @Min(value = 0, message = "Number of children must not be less that 0")
  private int numOfChildren;

  private int totalNumOfGuest;

  @Column(unique = true)
  private String bookingConfirmationCode;

  private String status = "PENDING";

  private String paymentStatus = "UNPAID";

  private String paymentMethod = "CASH";

  private BigDecimal totalPrice;

  private LocalDateTime createdAt = LocalDateTime.now();

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "room_id")
  private Room room;

  public void calculateTotalNumberOfGuest() {
    this.totalNumOfGuest = this.numOfAdults + this.numOfChildren;
  }

  public void setNumOfAdults(int numOfAdults) {
    this.numOfAdults = numOfAdults;
    calculateTotalNumberOfGuest();
  }

  public void setNumOfChildren(int numOfChildren) {
    this.numOfChildren = numOfChildren;
    calculateTotalNumberOfGuest();
  }

  @Override
  public String toString() {
    return "Booking{" +
        "id=" + id +
        ", checkInDate=" + checkInDate +
        ", checkOutDate=" + checkOutDate +
        ", numOfAdults=" + numOfAdults +
        ", numOfChildren=" + numOfChildren +
        ", totalNumOfGuest=" + totalNumOfGuest +
        ", bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
        '}';
  }
}
