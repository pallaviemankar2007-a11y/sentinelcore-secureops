package com.sentinelcore.infrastructure_monitoring.cloud.service;

import com.sentinelcore.infrastructure_monitoring.cloud.domain.CloudMetric;
import com.sentinelcore.infrastructure_monitoring.cloud.repository.CloudMetricRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CloudMonitoringServiceImpl implements CloudMonitoringService {

    private final CloudMetricRepository cloudMetricRepository;

    public CloudMonitoringServiceImpl(CloudMetricRepository cloudMetricRepository) {
        this.cloudMetricRepository = cloudMetricRepository;
    }

    @Override
    public CloudMetric addMetric(CloudMetric metric) {
        return cloudMetricRepository.save(metric);
    }

    @Override
    public List<CloudMetric> getAllMetrics() {
        return cloudMetricRepository.findAll();
    }

    @Override
    public CloudMetric getMetricById(UUID id) {
        return cloudMetricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cloud metric not found"));
    }
}