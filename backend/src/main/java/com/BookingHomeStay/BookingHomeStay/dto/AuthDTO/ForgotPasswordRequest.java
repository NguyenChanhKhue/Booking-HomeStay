package com.BookingHomeStay.BookingHomeStay.dto.AuthDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordRequest {
  @NotBlank(message = "email is required")
  @Email(message = "email is invalid")
  private String email;
}
