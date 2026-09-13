package com.sentinelcore.infrastructure_monitoring.repository;

import com.sentinelcore.infrastructure_monitoring.domain.ComplianceCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplianceRepository extends JpaRepository<ComplianceCheck, Long> {
}