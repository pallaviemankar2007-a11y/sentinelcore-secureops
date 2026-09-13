package com.sentinelcore.infrastructure_monitoring.service;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.repository.AssetRepository;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + assetId));

        // Update metrics
        asset.setCpuUsage(cpuUsage);
        asset.setMemoryUsage(memoryUsage);
        asset.setDiskUsage(diskUsage);
        asset.setNetworkUsage(networkUsage);

        // Dynamic Status Evaluation
        if (cpuUsage >= 85.0f || memoryUsage >= 85.0f || diskUsage >= 90.0f) {
            asset.setStatus("CRITICAL");
        } else if (cpuUsage >= 70.0f || memoryUsage >= 70.0f || diskUsage >= 75.0f) {
            asset.setStatus("WARNING");
        } else {
            asset.setStatus("HEALTHY");
        }

        return assetRepository.save(asset);
    }
}