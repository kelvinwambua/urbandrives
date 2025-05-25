package com.urbandrives.app.controller;

import com.urbandrives.app.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class BlobUploadController {

    private final UploadService uploadService;

    @Autowired
    public BlobUploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadBlob(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = uploadService.upload(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("message", "File uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
