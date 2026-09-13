package com.sentinelcore.infrastructure_monitoring.controller;

import com.sentinelcore.infrastructure_monitoring.domain.Incident;
import com.sentinelcore.infrastructure_monitoring.domain.Vulnerability;
import com.sentinelcore.infrastructure_monitoring.domain.AuditLog;
import com.sentinelcore.infrastructure_monitoring.domain.ComplianceCheck;
import com.sentinelcore.infrastructure_monitoring.repository.IncidentRepository;
import com.sentinelcore.infrastructure_monitoring.repository.VulnerabilityRepository;
import com.sentinelcore.infrastructure_monitoring.repository.AuditLogRepository;
import com.sentinelcore.infrastructure_monitoring.repository.ComplianceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SecurityOpsController {

    @Autowired
    private IncidentRepository incidentRepo;

    @Autowired
    private VulnerabilityRepository vulnerabilityRepo;

    @Autowired
    private AuditLogRepository auditLogRepo;

    @Autowired
    private ComplianceRepository complianceRepo;

    @GetMapping("/incidents")
    public List<Incident> getIncidents() {
        return incidentRepo.findAll();
    }

    @GetMapping("/vulnerabilities")
    public List<Vulnerability> getVulnerabilities() {
        return vulnerabilityRepo.findAll();
    }

    @GetMapping("/audit-logs")
    public List<AuditLog> getAuditLogs() {
        return auditLogRepo.findAll();
    }

    @GetMapping("/compliance")
    public List<ComplianceCheck> getComplianceChecks() {
        return complianceRepo.findAll();
    }
}