package com.BookingHomeStay.BookingHomeStay.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "rooms")
public class Room {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String roomType;
  private String roomLocation;
  
  @Column(precision = 18, scale = 2)
  private BigDecimal roomPrice;
  
  private String roomPhotoUrl;
  private String roomDescription;
  
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "room_images", joinColumns = @JoinColumn(name = "room_id"))
  @Column(name = "image_url")
  private List<String> additionalImages = new ArrayList<>();

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
  @Column(name = "amenity")
  private List<String> amenities = new ArrayList<>();

  @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
  private List<Booking> bookings = new ArrayList<>();

  @Override
  public String toString() {
    return "Room{" +
        "id=" + id +
        ", roomType='" + roomType + '\'' +
        ", roomLocation='" + roomLocation + '\'' +
        ", roomPrice=" + roomPrice +
        ", roomPhotoUrl='" + roomPhotoUrl + '\'' +
        ", roomDescription='" + roomDescription + '\'' +
        '}';
  }
}
