package com.BookingHomeStay.BookingHomeStay.service;

import java.util.Map;

import com.BookingHomeStay.BookingHomeStay.dto.Response;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
  Response createPayment(Long bookingId, HttpServletRequest request);
  Response handlePaymentCallback(Map<String, String> params);
}
