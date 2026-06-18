package com.BookingHomeStay.BookingHomeStay.service;

public interface EmailService {
  void sendForgotPasswordOtp(String toEmail, String otpCode);
  void sendContactEmail(String name, String email, String subject, String message);
}
