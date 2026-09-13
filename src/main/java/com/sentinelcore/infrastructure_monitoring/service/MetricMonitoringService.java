package com.sentinelcore.infrastructure_monitoring.service;

import com.sentinelcore.infrastructure_monitoring.domain.Asset;
import com.sentinelcore.infrastructure_monitoring.domain.AuditLog;
import com.sentinelcore.infrastructure_monitoring.domain.Incident;
import com.sentinelcore.infrastructure_monitoring.repository.AssetRepository;
import com.sentinelcore.infrastructure_monitoring.repository.AuditLogRepository;
import com.sentinelcore.infrastructure_monitoring.repository.IncidentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class MetricMonitoringService {

    private final AssetRepository assetRepository;
    private final IncidentRepository incidentRepository;
    private final AuditLogRepository auditLogRepository;
    private final Random random = new Random();

    public MetricMonitoringService(AssetRepository assetRepository,
                                   IncidentRepository incidentRepository,
                                   AuditLogRepository auditLogRepository) {
        this.assetRepository = assetRepository;
        this.incidentRepository = incidentRepository;
        this.auditLogRepository = auditLogRepository;
    }

    // Runs automatically every 10 seconds (10000 ms)
    @Scheduled(fixedRate = 10000)
    public void evaluateAssetMetrics() {
        System.out.println("--- [MetricMonitoringService] Checking asset metrics... ---");
        List<Asset> assets = assetRepository.findAll();

        for (Asset asset : assets) {
            if (asset.getCpuUsage() == null) {
                continue;
            }

            // Convert Float/Double safely
            double cpu = asset.getCpuUsage().doubleValue();

            // Check if CPU exceeds 80%
            if (cpu > 80.0) {
                System.out.println("-> ALERT: Asset " + asset.getName() + " has high CPU usage: " + cpu + "%");

                // 1. Ensure Asset status is marked CRITICAL in DB
                if (!"CRITICAL".equalsIgnoreCase(asset.getStatus())) {
                    asset.setStatus("CRITICAL");
                    assetRepository.save(asset);
                    System.out.println("   [+] Updated asset status to CRITICAL for: " + asset.getName());
                }

                // 2. Check if an OPEN incident already exists for this asset to prevent duplicate spam
                List<Incident> allIncidents = incidentRepository.findAll();
                boolean hasOpenIncident = allIncidents.stream()
                        .anyMatch(i -> asset.getName().equalsIgnoreCase(i.getAssetName())
                                && "OPEN".equalsIgnoreCase(i.getStatus()));

                // 3. Auto-generate Incident and Audit Log if no open incident exists
                if (!hasOpenIncident) {
                    String ticketId = "INC-" + (100 + random.nextInt(900));

                    // Create Incident Ticket
                    Incident incident = new Incident();
                    incident.setTicketId(ticketId);
                    incident.setTitle("Auto-Trigger: High CPU Usage Detected (" + String.format("%.1f", cpu) + "%)");
                    incident.setAssetName(asset.getName());
                    incident.setSeverity("CRITICAL");
                    incident.setStatus("OPEN");
                    incident.setAssignedTo("System Agent (Automated)");
                    incident.setCreatedAt(LocalDateTime.now());
                    incidentRepository.save(incident);
                    System.out.println("   [+] Saved new Incident ticket: " + ticketId);

                    // Create Audit Log Entry
                    AuditLog auditLog = new AuditLog();
                    auditLog.setTimestamp(LocalDateTime.now());
                    auditLog.setUsername("System Agent");
                    auditLog.setAction("METRIC_THRESHOLD_BREACH");
                    auditLog.setDetails("CPU usage breached critical threshold (" + String.format("%.1f", cpu) + "%) on asset: " + asset.getName());
                    auditLog.setIpAddress("127.0.0.1");
                    auditLogRepository.save(auditLog);
                    System.out.println("   [+] Saved new AuditLog for: " + asset.getName());
                } else {
                    System.out.println("   [-] Open incident already exists for " + asset.getName() + ", skipping duplicate creation.");
                }
            }
        }
    }
}