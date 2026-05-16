package com.BookingHomeStay.BookingHomeStay.service;

import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.ForgotPasswordRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.LoginRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.RegisterRequest;
import com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.ResetPasswordRequest;

public interface AuthService {
  Response register(RegisterRequest request);

  Response login(LoginRequest request);

  Response forgotPassword(ForgotPasswordRequest request);

  Response resetPassword(ResetPasswordRequest request);
}
