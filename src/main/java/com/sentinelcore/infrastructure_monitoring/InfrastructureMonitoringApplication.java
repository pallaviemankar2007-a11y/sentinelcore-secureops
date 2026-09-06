package com.sentinelcore.infrastructure_monitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Enables background scheduled tasks
public class InfrastructureMonitoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(InfrastructureMonitoringApplication.class, args);
    }
}