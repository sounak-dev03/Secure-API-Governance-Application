package com.secureapi.governance.service;

import com.secureapi.governance.entity.AuditLog;
import com.secureapi.governance.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog createLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> searchLogs(String search, String status) {

        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();

        return logs.stream()
                .filter(log -> {

                    boolean matchesSearch = true;
                    boolean matchesStatus = true;

                    if (search != null && !search.isBlank()) {

                        String value = search.toLowerCase();

                        matchesSearch =
                                log.getUsername().toLowerCase().contains(value)
                                || log.getEndpoint().toLowerCase().contains(value)
                                || log.getMethod().toLowerCase().contains(value)
                                || log.getIpAddress().toLowerCase().contains(value);
                    }

                    if (status != null
                            && !status.isBlank()
                            && !status.equalsIgnoreCase("ALL")) {

                        matchesStatus =
                                log.getStatus().equalsIgnoreCase(status);
                    }

                    return matchesSearch && matchesStatus;
                })
                .toList();
    }
}