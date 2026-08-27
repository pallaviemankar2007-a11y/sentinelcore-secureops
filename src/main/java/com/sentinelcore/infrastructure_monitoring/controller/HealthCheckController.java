package com.sentinelcore.infrastructure_monitoring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @GetMapping
    public String checkHealth() {
        return "SentinelCore Infrastructure Monitoring Service is Running!";
    }
}