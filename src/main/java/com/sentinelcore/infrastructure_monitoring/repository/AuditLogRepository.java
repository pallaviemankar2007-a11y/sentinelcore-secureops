package com.sentinelcore.infrastructure_monitoring.repository;

import com.sentinelcore.infrastructure_monitoring.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}