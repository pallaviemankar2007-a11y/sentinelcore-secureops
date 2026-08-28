package com.sentinelcore.infrastructure_monitoring.service;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;

import java.util.UUID;

public interface MonitoringService {

    Asset updateMetrics(
            UUID assetId,
            Float cpuUsage,
            Float memoryUsage,
            Float diskUsage,
            Float networkUsage
    );
}