package com.sentinelcore.infrastructure_monitoring.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "asset_id", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String type;
    private String status;

    @Column(name = "cpu_usage")
    private Float cpuUsage = 0.0f;

    @Column(name = "memory_usage")
    private Float memoryUsage = 0.0f;

    @Column(name = "disk_usage")
    private Float diskUsage = 0.0f;

    @Column(name = "network_usage")
    private Float networkUsage = 0.0f;

    public Asset() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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
}