package com.sentinelcore.infrastructure_monitoring.cloud.repository;

import com.sentinelcore.infrastructure_monitoring.cloud.domain.CloudMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CloudMetricRepository extends JpaRepository<CloudMetric, UUID> {
}