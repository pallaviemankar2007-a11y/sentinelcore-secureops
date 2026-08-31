package com.sentinelcore.infrastructure_monitoring.network.controller;

import com.sentinelcore.infrastructure_monitoring.network.domain.NetworkMetric;
import com.sentinelcore.infrastructure_monitoring.network.service.NetworkMonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/network")
public class NetworkMonitoringController {

    private final NetworkMonitoringService networkMonitoringService;

    public NetworkMonitoringController(NetworkMonitoringService networkMonitoringService) {
        this.networkMonitoringService = networkMonitoringService;
    }

    @PostMapping("/metrics")
    public ResponseEntity<NetworkMetric> addMetric(@RequestBody NetworkMetric metric) {
        return ResponseEntity.ok(networkMonitoringService.addMetric(metric));
    }

    @GetMapping("/metrics")
    public ResponseEntity<List<NetworkMetric>> getAllMetrics() {
        return ResponseEntity.ok(networkMonitoringService.getAllMetrics());
    }

    @GetMapping("/metrics/{id}")
    public ResponseEntity<NetworkMetric> getMetricById(@PathVariable UUID id) {
        return ResponseEntity.ok(networkMonitoringService.getMetricById(id));
    }
}