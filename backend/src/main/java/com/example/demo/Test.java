package com.example.demo;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {

    @GetMapping("/hello")
    public Map<String, String> sayHello() {

        return Map.of("message", "This is a test message from the backend.");
    }
}
