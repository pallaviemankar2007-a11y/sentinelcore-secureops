package com.sentinelcore.infrastructure_monitoring.cloud.service;

import com.sentinelcore.infrastructure_monitoring.cloud.domain.CloudMetric;

import java.util.List;

public interface CloudMonitoringService {

    CloudMetric addMetric(CloudMetric metric);

    List<CloudMetric> getAllMetrics();

    CloudMetric getMetricById(java.util.UUID id);
}