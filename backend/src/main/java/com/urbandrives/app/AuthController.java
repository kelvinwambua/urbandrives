package com.urbandrives.app;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.urbandrives.app.security.UserPrincipal;

@RestController
public class AuthController {

    @GetMapping("/auth/me")
    public ResponseEntity<UserPrincipal> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getPrincipal() instanceof UserPrincipal userPrincipal) {
            return ResponseEntity.ok(userPrincipal);
        }

        return ResponseEntity.status(401).build();
    }

    @GetMapping("/auth/test")
    public ResponseEntity<Map<String, Object>> testAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();

        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "user", user,
            "authorities", auth.getAuthorities()
        ));
    }

    @GetMapping("/public/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "timestamp", String.valueOf(System.currentTimeMillis()));
    }
}
