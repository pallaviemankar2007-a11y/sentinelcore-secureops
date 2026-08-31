package com.sentinelcore.infrastructure_monitoring.network.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class NetworkMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String networkName;
    private String deviceId;

    private double bandwidth;
    private double latency;
    private double packetLoss;
    private double incomingTraffic;
    private double outgoingTraffic;

    private String status;

    public NetworkMetric() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public double getBandwidth() {
        return bandwidth;
    }

    public void setBandwidth(double bandwidth) {
        this.bandwidth = bandwidth;
    }

    public double getLatency() {
        return latency;
    }

    public void setLatency(double latency) {
        this.latency = latency;
    }

    public double getPacketLoss() {
        return packetLoss;
    }

    public void setPacketLoss(double packetLoss) {
        this.packetLoss = packetLoss;
    }

    public double getIncomingTraffic() {
        return incomingTraffic;
    }

    public void setIncomingTraffic(double incomingTraffic) {
        this.incomingTraffic = incomingTraffic;
    }

    public double getOutgoingTraffic() {
        return outgoingTraffic;
    }

    public void setOutgoingTraffic(double outgoingTraffic) {
        this.outgoingTraffic = outgoingTraffic;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}