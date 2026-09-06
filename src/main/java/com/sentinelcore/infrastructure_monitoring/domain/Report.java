package com.sentinelcore.infrastructure_monitoring.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private LocalDate generatedAt;
    private String size;

    public Report() {}

    public Report(String name, String type, LocalDate generatedAt, String size) {
        this.name = name;
        this.type = type;
        this.generatedAt = generatedAt;
        this.size = size;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDate getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDate generatedAt) { this.generatedAt = generatedAt; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}