package com.BookingHomeStay.BookingHomeStay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Response> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  @GetMapping("/me")
  public ResponseEntity<Response> getMyInfo(Authentication authentication) {
    return ResponseEntity.ok(userService.getMyInfo(authentication.getName()));
  }

  @org.springframework.web.bind.annotation.PutMapping("/profile")
  public ResponseEntity<Response> updateProfile(
      Authentication authentication,
      @org.springframework.web.bind.annotation.RequestParam(required = false) String name,
      @org.springframework.web.bind.annotation.RequestParam(required = false) String phoneNumber,
      @org.springframework.web.bind.annotation.RequestParam(required = false) org.springframework.web.multipart.MultipartFile avatar) {
    return ResponseEntity.ok(userService.updateProfile(authentication.getName(), name, phoneNumber, avatar));
  }

  @GetMapping("/{userId}")
  public ResponseEntity<Response> getUserById(@PathVariable String userId) {
    return ResponseEntity.ok(userService.getUserById(userId));
  }

  @GetMapping("/{userId}/bookings")
  public ResponseEntity<Response> getUserBookingHistory(@PathVariable String userId) {
    return ResponseEntity.ok(userService.getUserBookingHistory(userId));
  }

  @DeleteMapping("/{userId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Response> deleteUser(@PathVariable String userId) {
    return ResponseEntity.ok(userService.deleteUser(userId));
  }

  @org.springframework.web.bind.annotation.PutMapping("/{userId}/toggle-status")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Response> toggleUserStatus(@PathVariable String userId) {
    return ResponseEntity.ok(userService.toggleUserStatus(userId));
  }

  @org.springframework.web.bind.annotation.PutMapping("/{userId}/role")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Response> changeUserRole(@PathVariable String userId) {
    return ResponseEntity.ok(userService.changeUserRole(userId));
  }
}
