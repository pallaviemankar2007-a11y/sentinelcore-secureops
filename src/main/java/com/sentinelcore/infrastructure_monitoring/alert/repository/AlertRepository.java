package com.sentinelcore.infrastructure_monitoring.alert.repository;

import com.sentinelcore.infrastructure_monitoring.alert.domain.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AlertRepository extends JpaRepository<Alert, UUID> {
}
