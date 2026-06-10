package com.BookingHomeStay.BookingHomeStay.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

  private final PaymentService paymentService;

  @GetMapping("/create-url/{bookingId}")
  public ResponseEntity<Response> createPaymentUrl(@PathVariable Long bookingId, HttpServletRequest request) {
    return ResponseEntity.ok(paymentService.createPayment(bookingId, request));
  }

  @GetMapping("/vnpay-return")
  public ResponseEntity<Response> paymentCallback(@RequestParam Map<String, String> params) {
    return ResponseEntity.ok(paymentService.handlePaymentCallback(params));
  }
}
