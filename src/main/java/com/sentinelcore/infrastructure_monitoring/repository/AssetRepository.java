package com.sentinelcore.infrastructure_monitoring.repository;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID> {
}