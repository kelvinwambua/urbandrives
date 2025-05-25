package com.urbandrives.app.controller;

import com.urbandrives.app.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class BlobUploadController {

    private final UploadService uploadService;

    @Autowired
    public BlobUploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<String> uploadBlob(@RequestParam("file") MultipartFile file) {
        String result = uploadService.upload(file);
        return ResponseEntity.ok(result);
    }
}


