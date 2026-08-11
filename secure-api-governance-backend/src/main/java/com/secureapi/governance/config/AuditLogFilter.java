package com.secureapi.governance.config;

import com.secureapi.governance.entity.AuditLog;
import com.secureapi.governance.repository.AuditLogRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

public class AuditLogFilter extends OncePerRequestFilter {

    private final AuditLogRepository auditLogRepository;

    public AuditLogFilter(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        /*
         * Don't create audit logs for authentication
         * and audit-log viewing requests.
         */
        if (path.startsWith("/api/auth")
                || path.startsWith("/api/audit-logs")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            filterChain.doFilter(request, response);

        } finally {

            Authentication authentication =
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication();

            String username = "anonymous";

            if (authentication != null
                    && authentication.isAuthenticated()
                    && authentication.getName() != null) {

                username = authentication.getName();
            }

            String status;

            if (response.getStatus() >= 200
                    && response.getStatus() < 400) {

                status = "GRANTED";

            } else {

                status = "DENIED";
            }

            String ipAddress =
                    request.getHeader("X-Forwarded-For");

            if (ipAddress == null || ipAddress.isBlank()) {
                ipAddress = request.getRemoteAddr();
            }

            AuditLog auditLog = new AuditLog(
                    LocalDateTime.now(),
                    username,
                    request.getMethod(),
                    path,
                    status,
                    ipAddress
            );

            auditLogRepository.save(auditLog);
        }
    }
}