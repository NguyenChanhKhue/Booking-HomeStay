package com.BookingHomeStay.BookingHomeStay.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.BookingHomeStay.BookingHomeStay.service.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
  private final JavaMailSender mailSender;

  @Value("${app.mail.from}")
  private String fromEmail;

  @Value("${app.otp.expiration-minutes}")
  private long otpExpirationMinutes;

  @Override
  public void sendForgotPasswordOtp(String toEmail, String otpCode) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject("BookingHomeStay password reset OTP");
    message.setText("""
        Your BookingHomeStay OTP is: %s

        This OTP will expire in %d minutes.
        If you did not request a password reset, you can ignore this email.
        """.formatted(otpCode, otpExpirationMinutes));
    mailSender.send(message);
  }

  @Override
  public void sendContactEmail(String name, String email, String subject, String messageContent) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(fromEmail); // Send to homestay email
    message.setReplyTo(email); // Reply to customer
    message.setSubject("Tin nhắn từ khách hàng: " + subject);
    message.setText("""
        Bạn nhận được tin nhắn từ khách hàng qua trang Liên hệ:
        
        Họ tên: %s
        Email: %s
        Tiêu đề: %s
        
        Nội dung:
        %s
        """.formatted(name, email, subject, messageContent));
    mailSender.send(message);
  }
}
