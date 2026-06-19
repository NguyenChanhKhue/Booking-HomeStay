package com.BookingHomeStay.BookingHomeStay.service;

import com.BookingHomeStay.BookingHomeStay.dto.Response;

public interface UserService {
  Response getAllUsers();

  Response getUserBookingHistory(String userId);

  Response deleteUser(String userId);

  Response getUserById(String userId);

  Response getMyInfo(String email);

  Response toggleUserStatus(String userId);

  Response changeUserRole(String userId);

  Response updateProfile(String email, String name, String phoneNumber, org.springframework.web.multipart.MultipartFile avatar);

  Response changePassword(String email, com.BookingHomeStay.BookingHomeStay.dto.AuthDTO.ChangePasswordRequest request);
}
