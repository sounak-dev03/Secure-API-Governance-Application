package com.secureapi.governance.controller;

import com.secureapi.governance.entity.AuditLog;
import com.secureapi.governance.service.AuditLogService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('AUDIT_READ')")
    public List<AuditLog> getAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {

        if ((search == null || search.isBlank())
                && (status == null || status.isBlank()
                || status.equalsIgnoreCase("ALL"))) {

            return auditLogService.getAllLogs();
        }

        return auditLogService.searchLogs(search, status);
    }
}