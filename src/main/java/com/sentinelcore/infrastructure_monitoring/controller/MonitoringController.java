package com.sentinelcore.infrastructure_monitoring.controller;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.service.MonitoringService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @PutMapping("/{assetId}")
    public ResponseEntity<Asset> updateMetrics(
            @PathVariable UUID assetId,
            @RequestParam Float cpuUsage,
            @RequestParam Float memoryUsage,
            @RequestParam Float diskUsage,
            @RequestParam Float networkUsage) {

        return ResponseEntity.ok(
                monitoringService.updateMetrics(
                        assetId,
                        cpuUsage,
                        memoryUsage,
                        diskUsage,
                        networkUsage
                )
        );
    }
}