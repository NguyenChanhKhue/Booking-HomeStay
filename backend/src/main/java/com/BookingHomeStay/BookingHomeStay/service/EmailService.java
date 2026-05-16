package com.BookingHomeStay.BookingHomeStay.service;

public interface EmailService {
  void sendForgotPasswordOtp(String toEmail, String otpCode);
}
