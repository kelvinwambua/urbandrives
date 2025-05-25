package com.urbandrives.app.service;

import com.urbandrives.app.service.UploadService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class UploadServiceImp implements UploadService {

    private final Path uploadDir = Paths.get("uploads");

    public UploadServiceImp() throws IOException {
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
    }

    @Override
    public String upload(MultipartFile file) {
        try {
            Path filePath = uploadDir.resolve(file.getOriginalFilename());
            Files.write(filePath, file.getBytes());
            return "File saved at: " + filePath.toAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}

