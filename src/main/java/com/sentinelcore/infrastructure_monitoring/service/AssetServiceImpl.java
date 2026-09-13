package com.sentinelcore.infrastructure_monitoring.service;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;

    public AssetServiceImpl(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public Asset createAsset(Asset asset) {
        // Clear any ID sent from frontend so Hibernate triggers a clean INSERT
        asset.setId(null);
        return assetRepository.save(asset);
    }

    @Override
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    @Override
    public Asset getAssetById(UUID assetId) {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + assetId));
    }

    @Override
    public Asset updateAsset(UUID assetId, Asset updatedAsset) {
        Asset existing = getAssetById(assetId);
        existing.setName(updatedAsset.getName());
        existing.setType(updatedAsset.getType());
        existing.setStatus(updatedAsset.getStatus());
        existing.setCpuUsage(updatedAsset.getCpuUsage());
        existing.setMemoryUsage(updatedAsset.getMemoryUsage());
        existing.setDiskUsage(updatedAsset.getDiskUsage());
        existing.setNetworkUsage(updatedAsset.getNetworkUsage());
        return assetRepository.save(existing);
    }

    @Override
    public void deleteAsset(UUID assetId) {
        assetRepository.deleteById(assetId);
    }
}