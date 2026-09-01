package com.sentinelcore.infrastructure_monitoring.service;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;

import java.util.List;
import java.util.UUID;

public interface AssetService {
    Asset createAsset(Asset asset);
    List<Asset> getAllAssets();
    Asset getAssetById(UUID assetId);
    Asset updateAsset(UUID assetId, Asset updatedAsset);
    void deleteAsset(UUID assetId);
}