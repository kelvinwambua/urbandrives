// New DocumentUploadService for handling documents
package com.urbandrives.app.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@Service("documentUploadService")
public class DocumentUploadService implements UploadService {

    private final Cloudinary cloudinary;
    private final Set<String> ALLOWED_DOCUMENT_TYPES = Set.of(
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
    );

    public DocumentUploadService(@Value("${CLOUDINARY_URL:}") String cloudinaryUrl) {
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

            // Check file size (20MB limit for documents)
            if (file.getSize() > 20 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds 20MB limit");
            }

            // Check file type for documents
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_DOCUMENT_TYPES.contains(contentType)) {
                throw new RuntimeException("Only PDF, Word, and text documents are allowed");
            }

            String originalFilename = file.getOriginalFilename();
            String publicId = "doc_" + System.currentTimeMillis() + "_" +
                (originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") : "document");

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type", "raw", // Important for non-image files
                    "folder", "urbandrives/documents",
                    "public_id", publicId
                ));

            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload document to Cloudinary: " + e.getMessage(), e);
        }
    }
}
