package com.sentinelcore.infrastructure_monitoring.service;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.repository.AssetRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class MonitoringServiceImpl implements MonitoringService {

    private final AssetRepository assetRepository;

    public MonitoringServiceImpl(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public Asset updateMetrics(
            UUID assetId,
            Float cpuUsage,
            Float memoryUsage,
            Float diskUsage,
            Float networkUsage) {

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        asset.setCpuUsage(cpuUsage);
        asset.setMemoryUsage(memoryUsage);
        asset.setDiskUsage(diskUsage);
        asset.setNetworkUsage(networkUsage);
        asset.setLastCheckedAt(LocalDateTime.now());

        if (cpuUsage >= 80 || memoryUsage >= 80 || diskUsage >= 80) {
            asset.setStatus("CRITICAL");
        } else if (cpuUsage >= 60 || memoryUsage >= 60 || diskUsage >= 60) {
            asset.setStatus("WARNING");
        } else {
            asset.setStatus("HEALTHY");
        }

        return assetRepository.save(asset);
    }
}