package com.sentinelcore.infrastructure_monitoring.controller;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    private final AssetService assetService;
    private final Random random = new Random();

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping
    public ResponseEntity<?> createAsset(@RequestBody Asset asset) {
        try {
            // Auto-assign logical initial status if not provided
            if (asset.getStatus() == null || asset.getStatus().trim().isEmpty()) {
                asset.setStatus("HEALTHY");
            }

            // Explicitly cast generated values to float
            if (asset.getCpuUsage() == null || asset.getCpuUsage() == 0f) {
                asset.setCpuUsage((float) (10 + random.nextInt(15))); // 10.0f - 24.0f baseline
            }
            if (asset.getMemoryUsage() == null || asset.getMemoryUsage() == 0f) {
                asset.setMemoryUsage((float) (20 + random.nextInt(20))); // 20.0f - 39.0f baseline
            }
            if (asset.getDiskUsage() == null || asset.getDiskUsage() == 0f) {
                asset.setDiskUsage((float) (15 + random.nextInt(10))); // 15.0f - 24.0f baseline
            }
            if (asset.getNetworkUsage() == null || asset.getNetworkUsage() == 0f) {
                asset.setNetworkUsage((float) (5 + random.nextInt(10))); // 5.0f - 14.0f baseline
            }

            Asset created = assetService.createAsset(asset);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Asset creation error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{assetId}")
    public ResponseEntity<Asset> getAssetById(@PathVariable UUID assetId) {
        return ResponseEntity.ok(assetService.getAssetById(assetId));
    }

    @PutMapping("/{assetId}")
    public ResponseEntity<Asset> updateAsset(
            @PathVariable UUID assetId,
            @RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.updateAsset(assetId, asset));
    }

    @DeleteMapping("/{assetId}")
    public ResponseEntity<Void> deleteAsset(@PathVariable UUID assetId) {
        assetService.deleteAsset(assetId);
        return ResponseEntity.noContent().build();
    }
}