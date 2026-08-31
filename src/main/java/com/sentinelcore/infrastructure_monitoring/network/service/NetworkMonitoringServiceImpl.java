package com.sentinelcore.infrastructure_monitoring.network.service;

import com.sentinelcore.infrastructure_monitoring.network.domain.NetworkMetric;
import com.sentinelcore.infrastructure_monitoring.network.repository.NetworkMetricRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NetworkMonitoringServiceImpl implements NetworkMonitoringService {

    private final NetworkMetricRepository networkMetricRepository;

    public NetworkMonitoringServiceImpl(NetworkMetricRepository networkMetricRepository) {
        this.networkMetricRepository = networkMetricRepository;
    }

    @Override
    public NetworkMetric addMetric(NetworkMetric metric) {
        return networkMetricRepository.save(metric);
    }

    @Override
    public List<NetworkMetric> getAllMetrics() {
        return networkMetricRepository.findAll();
    }

    @Override
    public NetworkMetric getMetricById(UUID id) {
        return networkMetricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Network metric not found"));
    }
}