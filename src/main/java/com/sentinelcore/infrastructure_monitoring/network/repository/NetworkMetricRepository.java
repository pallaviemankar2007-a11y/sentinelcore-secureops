package com.sentinelcore.infrastructure_monitoring.network.repository;

import com.sentinelcore.infrastructure_monitoring.network.domain.NetworkMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NetworkMetricRepository extends JpaRepository<NetworkMetric, UUID> {
}