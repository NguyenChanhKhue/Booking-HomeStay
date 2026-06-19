package com.BookingHomeStay.BookingHomeStay.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.BookingHomeStay.BookingHomeStay.service.EmailService;
import com.BookingHomeStay.BookingHomeStay.entity.Booking;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.scheduling.annotation.Async;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
  private final JavaMailSender mailSender;

  @Value("${app.mail.from}")
  private String fromEmail;

  @Value("${app.otp.expiration-minutes}")
  private long otpExpirationMinutes;

  @Value("${app.google.script.url:}")
  private String googleScriptUrl;

  private final ObjectMapper objectMapper = new ObjectMapper();

  private boolean sendViaGoogleScript(String to, String subject, String htmlBody, String replyTo) {
      if (googleScriptUrl == null || googleScriptUrl.trim().isEmpty()) {
          return false;
      }
      try {
          java.util.Map<String, String> payload = new java.util.HashMap<>();
          payload.put("to", to);
          payload.put("subject", subject);
          payload.put("htmlBody", htmlBody);
          if (replyTo != null) {
              payload.put("replyTo", replyTo);
          }
          String json = objectMapper.writeValueAsString(payload);
          java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                  .uri(java.net.URI.create(googleScriptUrl))
                  .header("Content-Type", "application/json")
                  .POST(java.net.http.HttpRequest.BodyPublishers.ofString(json))
                  .build();
          java.net.http.HttpClient.newHttpClient().send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
          return true;
      } catch (Exception e) {
          log.error("Failed to send via Google Script", e);
          return false;
      }
  }

  @Override
  public void sendForgotPasswordOtp(String toEmail, String otpCode) {
    String text = """
        Your BookingHomeStay OTP is: %s

        This OTP will expire in %d minutes.
        If you did not request a password reset, you can ignore this email.
        """.formatted(otpCode, otpExpirationMinutes);

    if (sendViaGoogleScript(toEmail, "BookingHomeStay password reset OTP", text.replace("\n", "<br>"), null)) {
        return;
    }

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject("BookingHomeStay password reset OTP");
    message.setText(text);
    mailSender.send(message);
  }

  @Async
  @Override
  public void sendContactEmail(String name, String email, String subject, String messageContent) {
    String text = """
        Bạn nhận được tin nhắn từ khách hàng qua trang Liên hệ:
        
        Họ tên: %s
        Email: %s
        Tiêu đề: %s
        
        Nội dung:
        %s
        """.formatted(name, email, subject, messageContent);

    if (sendViaGoogleScript(fromEmail, "Tin nhắn từ khách hàng: " + subject, text.replace("\n", "<br>"), email)) {
        return;
    }

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(fromEmail); // Send to homestay email
    message.setReplyTo(email); // Reply to customer
    message.setSubject("Tin nhắn từ khách hàng: " + subject);
    message.setText(text);
    mailSender.send(message);
  }

  @Async
  @Override
  public void sendPaymentSuccessEmail(Booking booking) {
    String htmlMsg = """
        <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>
          <div style='background-color: #f43f5e; color: white; padding: 20px; text-align: center;'>
            <h2 style='margin: 0;'>Thanh Toán Thành Công</h2>
          </div>
          <div style='padding: 20px;'>
            <p>Chào <strong>%s</strong>,</p>
            <p>Cảm ơn bạn đã lựa chọn <strong>BookingHomeStay</strong>. Chúng tôi xác nhận bạn đã thanh toán thành công đơn đặt phòng của mình.</p>
            
            <h3 style='border-bottom: 2px solid #f43f5e; padding-bottom: 5px; color: #f43f5e;'>Chi tiết đặt phòng</h3>
            <table style='width: 100%%; border-collapse: collapse;'>
              <tr>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee;'><strong>Mã xác nhận:</strong></td>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; color: #f43f5e; font-weight: bold;'>%s</td>
              </tr>
              <tr>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee;'><strong>Loại phòng:</strong></td>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;'>%s</td>
              </tr>
              <tr>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee;'><strong>Ngày Check-in:</strong></td>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;'>%s</td>
              </tr>
              <tr>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee;'><strong>Ngày Check-out:</strong></td>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;'>%s</td>
              </tr>
              <tr>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee;'><strong>Số lượng khách:</strong></td>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;'>%d Người</td>
              </tr>
              <tr>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee;'><strong>Tổng tiền:</strong></td>
                <td style='padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;'>%,d VND</td>
              </tr>
            </table>

            <p style='margin-top: 20px;'>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email này hoặc số điện thoại hotline.</p>
            <p>Chúc bạn một kỳ nghỉ tuyệt vời!</p>
            
            <p>Trân trọng,<br><strong>Đội ngũ BookingHomeStay</strong></p>
          </div>
          <div style='background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777;'>
            &copy; 2026 BookingHomeStay. All rights reserved.
          </div>
        </div>
        """.formatted(
            booking.getUser().getName(),
            booking.getBookingConfirmationCode(),
            booking.getRoom().getRoomType() + " - " + booking.getRoom().getRoomLocation(),
            booking.getCheckInDate().toString(),
            booking.getCheckOutDate().toString(),
            booking.getNumberOfGuests(),
            booking.getTotalPrice().longValue()
        );

    if (sendViaGoogleScript(booking.getUser().getEmail(), "Xác nhận thanh toán thành công - BookingHomeStay", htmlMsg, null)) {
        log.info("Payment success email sent via Google Script API to {}", booking.getUser().getEmail());
        return;
    }

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setFrom(fromEmail);
      helper.setTo(booking.getUser().getEmail());
      helper.setSubject("Xác nhận thanh toán thành công - BookingHomeStay");
      helper.setText(htmlMsg, true);
      mailSender.send(message);
      log.info("Payment success email sent via SMTP to {}", booking.getUser().getEmail());
    } catch (MessagingException e) {
      log.error("Failed to send payment success email to {}", booking.getUser().getEmail(), e);
    }
  }
}
