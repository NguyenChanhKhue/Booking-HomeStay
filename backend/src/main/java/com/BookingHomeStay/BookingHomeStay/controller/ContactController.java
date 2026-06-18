package com.BookingHomeStay.BookingHomeStay.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.BookingHomeStay.BookingHomeStay.dto.ContactRequest;
import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.service.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<Response> submitContactForm(@Valid @RequestBody ContactRequest request) {
        emailService.sendContactEmail(
            request.getName(), 
            request.getEmail(), 
            request.getSubject(), 
            request.getMessage()
        );

        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Contact form submitted successfully");
        return ResponseEntity.ok(response);
    }
}
