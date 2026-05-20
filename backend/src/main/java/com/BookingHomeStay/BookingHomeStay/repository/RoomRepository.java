package com.BookingHomeStay.BookingHomeStay.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.BookingHomeStay.BookingHomeStay.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
  @Query("SELECT DISTINCT r.roomType FROM Room r")
  List<String> findDistinctRoomTypes();

  @Query("SELECT r FROM Room r WHERE r.roomType LIKE %:roomType% AND r.id NOT IN (SELECT bk.room.id FROM Booking bk WHERE"
      +
      "(bk.checkInDate <= :checkOutDate) AND (bk.checkOutDate >= :checkInDate))")
  List<Room> findAvailableRoomsByDatesAndTypes(LocalDate checkInDate, LocalDate checkOutDate, String roomType);

  @Query("SELECT r FROM Room r WHERE r.id NOT IN (SELECT b.room.id FROM Booking b)")
  List<Room> getAllAvailableRooms();

  @Query("""
      SELECT r
      FROM Room r
      WHERE (:roomType IS NULL OR LOWER(r.roomType) LIKE LOWER(CONCAT('%', :roomType, '%')))
      AND (:keyword IS NULL
          OR LOWER(r.roomType) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR LOWER(r.roomLocation) LIKE LOWER(CONCAT('%', :keyword, '%'))
          OR LOWER(r.roomDescription) LIKE LOWER(CONCAT('%', :keyword, '%')))
      AND (:minPrice IS NULL OR r.roomPrice >= :minPrice)
      AND (:maxPrice IS NULL OR r.roomPrice <= :maxPrice)
      AND ((:checkInDate IS NULL AND :checkOutDate IS NULL)
          OR NOT EXISTS (
              SELECT 1
              FROM Booking bk
              WHERE bk.room = r
              AND bk.checkInDate <= :checkOutDate
              AND bk.checkOutDate >= :checkInDate
          ))
      """)
  List<Room> searchRooms(String keyword, String roomType, BigDecimal minPrice, BigDecimal maxPrice, LocalDate checkInDate,
      LocalDate checkOutDate);
}
