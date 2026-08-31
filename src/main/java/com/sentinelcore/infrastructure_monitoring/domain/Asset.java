package com.sentinelcore.infrastructure_monitoring.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String status;
    private Float cpuUsage;
    private Float memoryUsage;
    private Float diskUsage;
    private Float networkUsage;
    private LocalDateTime lastCheckedAt;

    // Explicit Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Float getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(Float cpuUsage) { this.cpuUsage = cpuUsage; }

    public Float getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(Float memoryUsage) { this.memoryUsage = memoryUsage; }

    public Float getDiskUsage() { return diskUsage; }
    public void setDiskUsage(Float diskUsage) { this.diskUsage = diskUsage; }

    public Float getNetworkUsage() { return networkUsage; }
    public void setNetworkUsage(Float networkUsage) { this.networkUsage = networkUsage; }

    public LocalDateTime getLastCheckedAt() { return lastCheckedAt; }
    public void setLastCheckedAt(LocalDateTime lastCheckedAt) { this.lastCheckedAt = lastCheckedAt; }
}