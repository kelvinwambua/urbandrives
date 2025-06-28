// src/main/java/com/example/demo/controllers/EmailTestController.java
package com.urbandrives.app;

import java.util.Map;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/hello")
    public Map<String, String> sayHello() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return Map.of(
            "message", "This is a test message from the backend.",
            "user", username != null ? username : "anonymous"
        );
    }

    @GetMapping("/public/test")
    public Map<String, String> publicEndpoint() {
        return Map.of("message", "This is a public endpoint that doesn't require authentication");
    }
}
