package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.BookingHomeStay.BookingHomeStay.dto.BookingDTO;
import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.dto.RoomDTO;
import com.BookingHomeStay.BookingHomeStay.dto.UserDTO;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.BookingHomeStay.BookingHomeStay.entity.Room;
import com.BookingHomeStay.BookingHomeStay.entity.User;
import com.BookingHomeStay.BookingHomeStay.exception.BadRequestException;
import com.BookingHomeStay.BookingHomeStay.exception.ResourceNotFoundException;
import com.BookingHomeStay.BookingHomeStay.repository.UserRepository;
import com.BookingHomeStay.BookingHomeStay.service.CloudinaryService;
import com.BookingHomeStay.BookingHomeStay.service.UserService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final CloudinaryService cloudinaryService;

  @Override
  public Response getAllUsers() {
    List<UserDTO> users = userRepository.findAll()
        .stream()
        .map(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper::mapUserToDtoWithBookings)
        .toList();

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get all users successfully");
    response.setUserList(users);
    return response;
  }

  @Override
  public Response getUserBookingHistory(String userId) {
    User user = findUserById(userId);
    verifyAccessPermission(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get user booking history successfully");
    response.setUser(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapUserToDtoWithBookings(user));
    response.setBookingList(user.getBookings().stream().map(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper::mapBookingToDtoWithRelations).toList());
    return response;
  }

  @Override
  @Transactional
  public Response deleteUser(String userId) {
    User user = findUserById(userId);
    userRepository.delete(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Delete user successfully");
    return response;
  }

  @Override
  public Response getUserById(String userId) {
    User user = findUserById(userId);
    verifyAccessPermission(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get user successfully");
    response.setUser(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapUserToDtoWithBookings(user));
    return response;
  }

  @Override
  public Response getMyInfo(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Get my info successfully");
    response.setUser(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapUserToDtoWithBookings(user));
    return response;
  }

  @Override
  @Transactional
  public Response toggleUserStatus(String userId) {
    User user = findUserById(userId);
    user.setActive(!user.isActive());
    userRepository.save(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage(user.isActive() ? "User unlocked successfully" : "User locked successfully");
    response.setUser(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapUserToDto(user));
    return response;
  }

  @Override
  @Transactional
  public Response changeUserRole(String userId) {
    User user = findUserById(userId);
    if (user.getRole() == com.BookingHomeStay.BookingHomeStay.enums.UserRole.ADMIN) {
      user.setRole(com.BookingHomeStay.BookingHomeStay.enums.UserRole.CUSTOMER);
    } else {
      user.setRole(com.BookingHomeStay.BookingHomeStay.enums.UserRole.ADMIN);
    }
    userRepository.save(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("User role updated successfully");
    response.setUser(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapUserToDto(user));
    return response;
  }

  @Override
  @Transactional
  public Response updateProfile(String email, String name, String phoneNumber, org.springframework.web.multipart.MultipartFile avatar) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (name != null && !name.isBlank()) {
      user.setName(name.trim());
    }
    if (phoneNumber != null && !phoneNumber.isBlank()) {
      user.setPhoneNumber(phoneNumber.trim());
    }
    if (avatar != null && !avatar.isEmpty()) {
      user.setAvatarUrl(cloudinaryService.uploadImage(avatar, "booking-home-stay/avatars"));
    }

    userRepository.save(user);

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("Profile updated successfully");
    response.setUser(com.BookingHomeStay.BookingHomeStay.utils.EntityMapper.mapUserToDto(user));
    return response;
  }

  private User findUserById(String userId) {
    Long parsedUserId;
    try {
      parsedUserId = Long.parseLong(userId);
    } catch (NumberFormatException ex) {
      throw new BadRequestException("Invalid user id");
    }

    return userRepository.findById(parsedUserId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  private void verifyAccessPermission(User targetUser) {
    org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      throw new org.springframework.security.access.AccessDeniedException("You are not authenticated");
    }
    boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    if (!isAdmin && !targetUser.getEmail().equals(auth.getName())) {
      throw new org.springframework.security.access.AccessDeniedException("You do not have permission to access this resource");
    }
  }
}
