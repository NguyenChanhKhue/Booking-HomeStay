package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.ForgotPasswordRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.LoginRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.RegisterRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.ResetPasswordRequest;
import com.BookingHomeStay.BookingHomeStay.entity.OtpVerification;
import com.BookingHomeStay.BookingHomeStay.entity.User;
import com.BookingHomeStay.BookingHomeStay.enums.OtpPurpose;
import com.BookingHomeStay.BookingHomeStay.enums.UserRole;
import com.BookingHomeStay.BookingHomeStay.exception.BadRequestException;
import com.BookingHomeStay.BookingHomeStay.repository.OtpVerificationRepository;
import com.BookingHomeStay.BookingHomeStay.repository.UserRepository;
import com.BookingHomeStay.BookingHomeStay.security.JwtService;
import com.BookingHomeStay.BookingHomeStay.service.AuthService;
import com.BookingHomeStay.BookingHomeStay.service.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final OtpVerificationRepository otpVerificationRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final EmailService emailService;

  @Value("${app.otp.expiration-minutes}")
  private long otpExpirationMinutes;

  @Override
  public Response register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new BadRequestException("Email already exists");
    }

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPhoneNumber(request.getPhoneNumber());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(UserRole.CUSTOMER);

    User savedUser = userRepository.save(user);
    String token = jwtService.generateToken(savedUser);

    Response response = new Response();
    response.setStatusCode(201);
    response.setMessage("Register successfully");
    response.setToken(token);
    response.setRole(savedUser.getRole());
    response.setExpirationTime(String.valueOf(jwtService.getExpirationTime()));
    return response;
  }

  @Override
  public Response login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new BadRequestException("User not found"));

    String token = jwtService.generateToken(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Login successfully");
    response.setToken(token);
    response.setRole(user.getRole());
    response.setExpirationTime(String.valueOf(jwtService.getExpirationTime()));
    return response;
  }

  @Override
  public Response forgotPassword(ForgotPasswordRequest request) {
    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

    if (userOptional.isPresent()) {
      otpVerificationRepository.deleteByEmailAndPurpose(request.getEmail(), OtpPurpose.RESET_PASSWORD);

      String otpCode = generateOtp();

      OtpVerification otpVerification = new OtpVerification();
      otpVerification.setEmail(request.getEmail());
      otpVerification.setOtpCode(otpCode);
      otpVerification.setPurpose(OtpPurpose.RESET_PASSWORD);
      otpVerification.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpirationMinutes));
      otpVerification.setVerified(false);
      otpVerification.setUsed(false);
      otpVerificationRepository.save(otpVerification);

      emailService.sendForgotPasswordOtp(request.getEmail(), otpCode);
    }

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("If the email exists, an OTP has been sent");
    return response;
  }

  @Override
  public Response resetPassword(ResetPasswordRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new BadRequestException("Invalid email or OTP"));

    OtpVerification otpVerification = otpVerificationRepository
        .findTopByEmailAndOtpCodeAndPurposeOrderByCreatedAtDesc(
            request.getEmail(),
            request.getOtp(),
            OtpPurpose.RESET_PASSWORD)
        .orElseThrow(() -> new BadRequestException("Invalid email or OTP"));

    if (otpVerification.isUsed()) {
      throw new BadRequestException("OTP has already been used");
    }

    if (otpVerification.isExpired()) {
      throw new BadRequestException("OTP has expired");
    }

    otpVerification.setVerified(true);
    otpVerification.setUsed(true);
    otpVerificationRepository.save(otpVerification);

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Password reset successfully");
    return response;
  }

  private String generateOtp() {
    return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
  }
}
