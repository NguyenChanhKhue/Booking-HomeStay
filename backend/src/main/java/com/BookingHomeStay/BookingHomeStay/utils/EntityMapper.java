package com.BookingHomeStay.BookingHomeStay.utils;

import java.util.ArrayList;

import com.BookingHomeStay.BookingHomeStay.dto.BookingDTO;
import com.BookingHomeStay.BookingHomeStay.dto.RoomDTO;
import com.BookingHomeStay.BookingHomeStay.dto.UserDTO;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.BookingHomeStay.BookingHomeStay.entity.Room;
import com.BookingHomeStay.BookingHomeStay.entity.User;

public class EntityMapper {
    public static UserDTO mapUserToDto(User user) {
        if (user == null) return null;
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setName(user.getName());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setAvatarUrl(user.getAvatarUrl());
        userDTO.setRole(user.getRole());
        userDTO.setIsActive(user.isActive());
        return userDTO;
    }

    public static RoomDTO mapRoomToDto(Room room) {
        if (room == null) return null;
        RoomDTO roomDTO = new RoomDTO();
        roomDTO.setId(room.getId());
        roomDTO.setRoomType(room.getRoomType());
        roomDTO.setRoomLocation(room.getRoomLocation());
        roomDTO.setRoomPrice(room.getRoomPrice());
        roomDTO.setRoomPhotoUrl(room.getRoomPhotoUrl());
        roomDTO.setAdditionalImages(room.getAdditionalImages() != null ? room.getAdditionalImages() : new ArrayList<>());
        roomDTO.setAmenities(room.getAmenities() != null ? room.getAmenities() : new ArrayList<>());
        roomDTO.setRoomDescription(room.getRoomDescription());
        roomDTO.setBookingCount(room.getBookings() != null ? room.getBookings().size() : 0);
        return roomDTO;
    }

    public static BookingDTO mapBookingToDto(Booking booking) {
        if (booking == null) return null;
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumOfGuest(booking.getTotalNumOfGuest());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setPaymentStatus(booking.getPaymentStatus());
        bookingDTO.setPaymentMethod(booking.getPaymentMethod());
        bookingDTO.setTotalPrice(booking.getTotalPrice());
        bookingDTO.setCreatedAt(booking.getCreatedAt());
        return bookingDTO;
    }

    public static UserDTO mapUserToDtoWithBookings(User user) {
        if (user == null) return null;
        UserDTO userDTO = mapUserToDto(user);
        if (user.getBookings() != null) {
            userDTO.setBookings(user.getBookings().stream()
                .map(b -> {
                    BookingDTO dto = mapBookingToDto(b);
                    dto.setRoom(mapRoomToDto(b.getRoom()));
                    return dto;
                })
                .toList());
        }
        return userDTO;
    }

    public static RoomDTO mapRoomToDtoWithBookings(Room room) {
        if (room == null) return null;
        RoomDTO roomDTO = mapRoomToDto(room);
        if (room.getBookings() != null) {
            roomDTO.setBookings(room.getBookings().stream()
                .map(b -> {
                    BookingDTO dto = mapBookingToDto(b);
                    dto.setUser(mapUserToDto(b.getUser()));
                    return dto;
                })
                .toList());
        }
        return roomDTO;
    }

    public static BookingDTO mapBookingToDtoWithRelations(Booking booking) {
        if (booking == null) return null;
        BookingDTO dto = mapBookingToDto(booking);
        dto.setUser(mapUserToDto(booking.getUser()));
        dto.setRoom(mapRoomToDto(booking.getRoom()));
        return dto;
    }
}
