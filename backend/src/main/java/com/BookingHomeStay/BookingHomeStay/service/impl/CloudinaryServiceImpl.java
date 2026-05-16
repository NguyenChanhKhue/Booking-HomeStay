package com.BookingHomeStay.BookingHomeStay.service.impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.BookingHomeStay.BookingHomeStay.exception.BadRequestException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CloudinaryServiceImpl implements com.BookingHomeStay.BookingHomeStay.service.CloudinaryService {

  private final Cloudinary cloudinary;

  @Override
  public String uploadImage(MultipartFile file, String folder) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("Image file is required");
    }

    try {
      @SuppressWarnings("unchecked")
      Map<String, Object> result = cloudinary.uploader().upload(
          file.getBytes(),
          ObjectUtils.asMap(
              "folder", folder,
              "resource_type", "image"));

      Object secureUrl = result.get("secure_url");
      if (secureUrl == null) {
        throw new BadRequestException("Upload image failed");
      }

      return secureUrl.toString();
    } catch (IOException ex) {
      throw new BadRequestException("Cannot read image file");
    } catch (Exception ex) {
      throw new BadRequestException("Upload image to Cloudinary failed");
    }
  }
}
