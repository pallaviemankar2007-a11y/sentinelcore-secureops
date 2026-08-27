package com.sentinelcore.infrastructure_monitoring.repository;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {
}