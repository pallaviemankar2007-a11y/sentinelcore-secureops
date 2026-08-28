package com.sentinelcore.infrastructure_monitoring.service;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.repository.AssetRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        return assetRepository.save(asset);
    }

    @Override
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    @Override
    public Asset getAssetById(UUID assetId) {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Asset not found"
                ));
    }

    @Override
    public Asset updateAsset(UUID assetId, Asset asset) {
        Asset existingAsset = getAssetById(assetId);

        existingAsset.setName(asset.getName());
        existingAsset.setType(asset.getType());
        existingAsset.setStatus(asset.getStatus());
        existingAsset.setCpuUsage(asset.getCpuUsage());
        existingAsset.setMemoryUsage(asset.getMemoryUsage());
        existingAsset.setDiskUsage(asset.getDiskUsage());
        existingAsset.setNetworkUsage(asset.getNetworkUsage());
        existingAsset.setLastCheckedAt(asset.getLastCheckedAt());

        return assetRepository.save(existingAsset);
    }

    @Override
    public void deleteAsset(UUID assetId) {
        Asset existingAsset = getAssetById(assetId);
        assetRepository.delete(existingAsset);
    }
}