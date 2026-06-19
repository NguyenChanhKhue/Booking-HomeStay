package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.BookingHomeStay.BookingHomeStay.config.VNPayConfig;
import com.BookingHomeStay.BookingHomeStay.dto.Response;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.BookingHomeStay.BookingHomeStay.exception.ResourceNotFoundException;
import com.BookingHomeStay.BookingHomeStay.repository.BookingRepository;
import com.BookingHomeStay.BookingHomeStay.service.PaymentService;
import com.BookingHomeStay.BookingHomeStay.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class PaymentServiceImpl implements PaymentService {

  private final BookingRepository bookingRepository;
  private final VNPayConfig vnPayConfig;
  private final EmailService emailService;

  @Override
  public Response createPayment(Long bookingId, HttpServletRequest request) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

    long amount = calculateAmount(booking) * 100L; // VNPay requires amount to be multiplied by 100
    
    String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
    String vnp_IpAddr = VNPayConfig.getIpAddress(request);
    String vnp_TmnCode = vnPayConfig.vnp_TmnCode;

    Map<String, String> vnp_Params = new HashMap<>();
    vnp_Params.put("vnp_Version", "2.1.0");
    vnp_Params.put("vnp_Command", "pay");
    vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
    vnp_Params.put("vnp_Amount", String.valueOf(amount));
    vnp_Params.put("vnp_CurrCode", "VND");
    vnp_Params.put("vnp_BankCode", "NCB"); // For testing Sandbox
    vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
    vnp_Params.put("vnp_OrderInfo", "Thanh toan don dat phong: " + booking.getBookingConfirmationCode());
    vnp_Params.put("vnp_OrderType", "other");
    vnp_Params.put("vnp_Locale", "vn");
    vnp_Params.put("vnp_ReturnUrl", vnPayConfig.vnp_ReturnUrl);
    vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

    Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
    formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
    String vnp_CreateDate = formatter.format(cld.getTime());
    vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

    cld.add(Calendar.MINUTE, 15);
    String vnp_ExpireDate = formatter.format(cld.getTime());
    vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

    // Build URL
    List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
    Collections.sort(fieldNames);
    StringBuilder hashData = new StringBuilder();
    StringBuilder query = new StringBuilder();
    Iterator<String> itr = fieldNames.iterator();
    while (itr.hasNext()) {
      String fieldName = (String) itr.next();
      String fieldValue = (String) vnp_Params.get(fieldName);
      if ((fieldValue != null) && (fieldValue.length() > 0)) {
        try {
          hashData.append(fieldName);
          hashData.append('=');
          hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
          query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
          query.append('=');
          query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
        } catch (UnsupportedEncodingException e) {
          e.printStackTrace();
        }
        if (itr.hasNext()) {
          query.append('&');
          hashData.append('&');
        }
      }
    }
    
    String queryUrl = query.toString();
    String vnp_SecureHash = VNPayConfig.hmacSHA512(vnPayConfig.vnp_HashSecret, hashData.toString());
    queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
    String paymentUrl = vnPayConfig.vnp_Url + "?" + queryUrl;

    // Note: Do not mutate bookingConfirmationCode here. It will be sent in vnp_OrderInfo and retrieved on callback.

    Response response = new Response();
    response.setStatusCode(200);
    response.setMessage("success");
    response.setPaymentUrl(paymentUrl);
    return response;
  }

  @Override
  @Transactional
  public Response handlePaymentCallback(Map<String, String> params) {
    String vnp_SecureHash = params.get("vnp_SecureHash");
    params.remove("vnp_SecureHashType");
    params.remove("vnp_SecureHash");

    String signValue = VNPayConfig.hashAllFields(params, vnPayConfig.vnp_HashSecret);
    
    Response response = new Response();
    
    if (signValue.equals(vnp_SecureHash)) {
      if ("00".equals(params.get("vnp_ResponseCode"))) {
        // Success
        String orderInfo = params.get("vnp_OrderInfo");
        // Extract booking code from orderInfo "Thanh toan don dat phong: CODE"
        String[] parts = orderInfo.split(": ");
        if (parts.length > 1) {
          String confirmationCodeWithTxn = parts[1];
          String originalCode = confirmationCodeWithTxn.split("_")[0];
          
          // Try to find the booking.
          Booking booking = bookingRepository.findByBookingConfirmationCode(originalCode).orElse(null);

          if (booking != null) {
            if ("PAID".equals(booking.getPaymentStatus())) {
              response.setStatusCode(200);
              response.setMessage("Payment success (already processed)");
              return response;
            }
            
            booking.setPaymentStatus("PAID");
            booking.setPaymentMethod("VNPAY");
            bookingRepository.save(booking);
            
            // Trigger lazy loading for async email service
            if (booking.getUser() != null) booking.getUser().getName();
            if (booking.getRoom() != null) booking.getRoom().getRoomType();
            
            // Send success email asynchronously (or synchronously)
            emailService.sendPaymentSuccessEmail(booking);

            log.info("Booking updated successfully!");
            response.setStatusCode(200);
            response.setMessage("Payment success");
            return response;
          } else {
             log.error("Booking not found!");
          }
        } else {
           log.error("OrderInfo parsing failed: {}", orderInfo);
        }
      } else {
         log.warn("ResponseCode is not 00: {}", params.get("vnp_ResponseCode"));
      }
    }
    
    response.setStatusCode(400);
    response.setMessage("Payment failed or invalid signature");
    return response;
  }

  private long calculateAmount(Booking booking) {
    if (booking.getTotalPrice() != null) {
      return booking.getTotalPrice().longValue();
    }
    long pricePerNight = booking.getRoom().getRoomPrice().longValue();
    int days = Math.max(1, (int) (booking.getCheckOutDate().toEpochDay() - booking.getCheckInDate().toEpochDay()));
    return pricePerNight * days;
  }
}
