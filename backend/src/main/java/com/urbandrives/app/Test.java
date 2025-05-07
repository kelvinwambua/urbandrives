package com.urbandrives.app;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {

    @GetMapping("/hell")
    public Map<String, String> sayHello() {

        return Map.of("message", "This is a test message from the backend.");
    }

    @GetMapping("/auth-test")
    public ResponseEntity<Map<String, Object>> testAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", auth != null && auth.isAuthenticated());
        response.put("principal", auth != null ? auth.getPrincipal() : "none");
        response.put("authorities", auth != null ? auth.getAuthorities() : "none");
        
        return ResponseEntity.ok(response);
    }
}

