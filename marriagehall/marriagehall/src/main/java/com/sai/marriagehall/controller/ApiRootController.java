package com.sai.marriagehall.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiRootController {

    @GetMapping({"", "/"})
    public Map<String, Object> index() {
        return Map.of(
            "status", "OK",
            "endpoints", Map.of(
                "halls", "/api/halls",
                "bookings", "/api/bookings"
            )
        );
    }
}