package com.sentinelcore.infrastructure_monitoring.domain;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_checks")
public class ComplianceCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String framework;
    private String controlName;
    private String status; // PASSED, FAILED, WARNING
    private LocalDateTime lastScanned = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFramework() { return framework; }
    public void setFramework(String framework) { this.framework = framework; }
    public String getControlName() { return controlName; }
    public void setControlName(String controlName) { this.controlName = controlName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getLastScanned() { return lastScanned; }
    public void setLastScanned(LocalDateTime lastScanned) { this.lastScanned = lastScanned; }
}