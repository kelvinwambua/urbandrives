package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class Test {

    @GetMapping("/hello")
    public Map<String, String> sayHello() {

        return Map.of("message", "Cat");
    }
}
