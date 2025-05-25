package com.urbandrives.app.controller;

import com.urbandrives.app.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/test-email")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send-simple")
    public ResponseEntity<String> sendTestEmail(
            @RequestParam(defaultValue = "chelseamuegi@gmail.com") String to,
            @RequestParam(defaultValue = "Test Subject from UrbanDrives") String subject,
            @RequestParam(defaultValue = "This is a test email sent from the UrbanDrives backend.") String text) {

        try {
            boolean sent = emailService.sendSimpleEmail(to, subject, text);
            if (sent) {
                return new ResponseEntity<>("Test email sent successfully to " + to, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed to send test email to " + to + ". Check server logs for details.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            System.err.println("Exception while sending test email: " + e.getMessage());
            return new ResponseEntity<>("An error occurred while sending test email: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}