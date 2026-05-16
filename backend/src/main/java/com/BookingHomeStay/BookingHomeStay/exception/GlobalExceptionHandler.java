package com.BookingHomeStay.BookingHomeStay.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.BookingHomeStay.BookingHomeStay.dto.Response;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
    Map<String, Object> body = new HashMap<>();
    Map<String, String> errors = new HashMap<>();

    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      errors.put(error.getField(), error.getDefaultMessage());
    }

    body.put("statusCode", HttpStatus.BAD_REQUEST.value());
    body.put("message", "Validation failed");
    body.put("errors", errors);
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<Response> handleBadRequestException(BadRequestException ex) {
    Response response = new Response();
    response.setStatusCode(HttpStatus.BAD_REQUEST.value());
    response.setMessage(ex.getMessage());
    return ResponseEntity.badRequest().body(response);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Response> handleResourceNotFoundException(ResourceNotFoundException ex) {
    Response response = new Response();
    response.setStatusCode(HttpStatus.NOT_FOUND.value());
    response.setMessage(ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<Response> handleBadCredentialsException(BadCredentialsException ex) {
    Response response = new Response();
    response.setStatusCode(HttpStatus.UNAUTHORIZED.value());
    response.setMessage("Email or password is incorrect");
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Response> handleException(Exception ex) {
    Response response = new Response();
    response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
    response.setMessage(ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }
}
