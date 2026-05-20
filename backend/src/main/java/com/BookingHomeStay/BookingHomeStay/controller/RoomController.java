package com.BookingHomeStay.BookingHomeStay.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
  private final RoomService roomService;

  @PostMapping
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<Response> addNewRoom(
      @RequestParam("photo") MultipartFile photo,
      @RequestParam("roomType") String roomType,
      @RequestParam("roomPrice") BigDecimal roomPrice,
      @RequestParam("description") String description) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(roomService.addNewRoom(photo, roomType, roomPrice, description));
  }

  @GetMapping("/types")
  public ResponseEntity<List<String>> getAllRoomTypes() {
    return ResponseEntity.ok(roomService.getAllRoomTypes());
  }

  @GetMapping
  public ResponseEntity<Response> getAllRooms() {
    return ResponseEntity.ok(roomService.getAllRooms());
  }

  @GetMapping("/search")
  public ResponseEntity<Response> searchRooms(
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) String roomType,
      @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {
    return ResponseEntity.ok(
        roomService.searchRooms(keyword, roomType, minPrice, maxPrice, checkInDate, checkOutDate));
  }

  @GetMapping("/available")
  public ResponseEntity<Response> getAvailableRoomsByDateAndType(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
      @RequestParam(required = false) String roomType) {
    return ResponseEntity.ok(roomService.getAvailableRoomsByDataAndType(checkInDate, checkOutDate, roomType));
  }

  @GetMapping("/available/all")
  public ResponseEntity<Response> getAllAvailableRooms() {
    return ResponseEntity.ok(roomService.getAllAvailableRooms());
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<Response> getRoomById(@PathVariable Long roomId) {
    return ResponseEntity.ok(roomService.getRoomById(roomId));
  }

  @PutMapping("/{roomId}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<Response> updateRoom(
      @PathVariable Long roomId,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) String roomType,
      @RequestParam(required = false) BigDecimal roomPrice,
      @RequestParam(required = false) MultipartFile photo) {
    return ResponseEntity.ok(roomService.updateRoom(roomId, description, roomType, roomPrice, photo));
  }

  @DeleteMapping("/{roomId}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<Response> deleteRoom(@PathVariable Long roomId) {
    return ResponseEntity.ok(roomService.deleteRoom(roomId));
  }
}
