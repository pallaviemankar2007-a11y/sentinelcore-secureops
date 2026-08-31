package com.sentinelcore.infrastructure_monitoring.network.service;

import com.sentinelcore.infrastructure_monitoring.network.domain.NetworkMetric;

import java.util.List;
import java.util.UUID;

public interface NetworkMonitoringService {

    NetworkMetric addMetric(NetworkMetric metric);

    List<NetworkMetric> getAllMetrics();

    NetworkMetric getMetricById(UUID id);
}