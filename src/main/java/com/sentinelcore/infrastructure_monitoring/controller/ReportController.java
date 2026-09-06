package com.sentinelcore.infrastructure_monitoring.controller;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final AssetRepository assetRepository;

    @Autowired
    public ReportController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getDynamicReports() {
        List<Asset> assets = assetRepository.findAll();
        List<Map<String, Object>> reports = new ArrayList<>();

        Map<String, Object> report = new HashMap<>();
        report.put("id", "REP-AST-01");
        report.put("name", "Live Infrastructure Health & Asset Telemetry Audit");
        report.put("type", "CSV");
        report.put("totalAssets", assets.size());
        report.put("generatedAt", java.time.LocalDate.now().toString());
        report.put("size", (assets.size() * 2 + 1) + " KB");

        reports.add(report);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable String id) {
        List<Asset> assets = assetRepository.findAll();

        StringBuilder csvContent = new StringBuilder();
        csvContent.append("=== SENTINELCORE SECUREOPS AUTOMATED TELEMETRY REPORT ===\n");
        csvContent.append("Report ID: ").append(id).append("\n");
        csvContent.append("Generated Date: ").append(java.time.LocalDateTime.now()).append("\n");
        csvContent.append("Total Assets Count: ").append(assets.size()).append("\n\n");
        csvContent.append("Asset ID,Asset Name,Type,Status,CPU Usage (%),Memory Usage (%),Disk Usage (%),Network Usage (MB/s)\n");

        for (Asset asset : assets) {
            csvContent.append(asset.getId()).append(",")
                    .append("\"").append(asset.getName()).append("\",")
                    .append(asset.getType()).append(",")
                    .append(asset.getStatus()).append(",")
                    .append(asset.getCpuUsage()).append(",")
                    .append(asset.getMemoryUsage()).append(",")
                    .append(asset.getDiskUsage()).append(",")
                    .append(asset.getNetworkUsage()).append("\n");
        }

        byte[] body = csvContent.toString().getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Asset_Telemetry_Report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
    }
}