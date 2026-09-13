package com.sentinelcore.infrastructure_monitoring.cloud.controller;

import com.sentinelcore.infrastructure_monitoring.cloud.domain.CloudMetric;
import com.sentinelcore.infrastructure_monitoring.cloud.service.CloudMonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cloud")
public class CloudMonitoringController {

    private final CloudMonitoringService cloudMonitoringService;

    public CloudMonitoringController(CloudMonitoringService cloudMonitoringService) {
        this.cloudMonitoringService = cloudMonitoringService;
    }

    @PostMapping("/metrics")
    public ResponseEntity<CloudMetric> addMetric(@RequestBody CloudMetric metric) {
        return ResponseEntity.ok(cloudMonitoringService.addMetric(metric));
    }

    @GetMapping("/metrics")
    public ResponseEntity<List<CloudMetric>> getAllMetrics() {
        return ResponseEntity.ok(cloudMonitoringService.getAllMetrics());
    }

    @GetMapping("/metrics/{id}")
    public ResponseEntity<CloudMetric> getMetricById(@PathVariable UUID id) {
        return ResponseEntity.ok(cloudMonitoringService.getMetricById(id));
    }
}