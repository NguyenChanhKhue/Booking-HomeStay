package com.BookingHomeStay.BookingHomeStay.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.ForgotPasswordRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.LoginRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.RegisterRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.ResetPasswordRequest;
import com.BookingHomeStay.BookingHomeStay.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<Response> register(@Validated @RequestBody RegisterRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<Response> login(@Validated @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<Response> forgotPassword(@Validated @RequestBody ForgotPasswordRequest request) {
    return ResponseEntity.ok(authService.forgotPassword(request));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<Response> resetPassword(@Validated @RequestBody ResetPasswordRequest request) {
    return ResponseEntity.ok(authService.resetPassword(request));
  }
}
