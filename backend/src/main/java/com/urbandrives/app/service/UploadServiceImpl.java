package com.urbandrives.app.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class UploadServiceImpl implements UploadService {

    private final Cloudinary cloudinary;

    public UploadServiceImpl(@Value("${CLOUDINARY_URL:}") String cloudinaryUrl) {
        if (cloudinaryUrl.isEmpty()) {
            throw new RuntimeException("CLOUDINARY_URL environment variable is not set");
        }
        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    @Override
    public String upload(MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // Check file size (10MB limit)
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds 10MB limit");
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            String originalFilename = file.getOriginalFilename();
            String publicId = System.currentTimeMillis() + "_" +
                (originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") : "file");

            // Fix the transformation parameters - don't nest ObjectUtils.asMap
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type", "auto",
                    "folder", "urbandrives/cars",
                    "public_id", publicId,
                    "quality", "auto",
                    "fetch_format", "auto",
                    "width", 800,
                    "height", 600,
                    "crop", "limit"
                ));

            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }
}
