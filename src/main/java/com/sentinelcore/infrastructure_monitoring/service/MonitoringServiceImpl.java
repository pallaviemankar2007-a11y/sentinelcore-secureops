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

        asset.setCpuUsage(cpuUsage);
        asset.setMemoryUsage(memoryUsage);
        asset.setDiskUsage(diskUsage);
        asset.setNetworkUsage(networkUsage);

        return assetRepository.save(asset);
    }
}