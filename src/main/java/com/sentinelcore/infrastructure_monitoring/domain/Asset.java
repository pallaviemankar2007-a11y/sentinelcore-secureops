package com.sentinelcore.infrastructure_monitoring.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID assetId;

    @Column(nullable = false)
    private String name;

    private String type;   // SERVER, CLOUD, NETWORK

    private String status; // HEALTHY, WARNING, CRITICAL

    private Float cpuUsage;
    private Float memoryUsage;
    private Float diskUsage;
    private Float networkUsage;

    private LocalDateTime lastCheckedAt;
}