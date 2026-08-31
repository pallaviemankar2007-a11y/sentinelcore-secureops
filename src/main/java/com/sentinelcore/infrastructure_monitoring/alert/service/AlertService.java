package com.sentinelcore.infrastructure_monitoring.alert.service;

import com.sentinelcore.infrastructure_monitoring.alert.domain.Alert;

import java.util.List;
import java.util.UUID;

public interface AlertService {

    Alert createAlert(Alert alert);

    List<Alert> getAllAlerts();

    Alert getAlertById(UUID id);

    Alert resolveAlert(UUID id);
}