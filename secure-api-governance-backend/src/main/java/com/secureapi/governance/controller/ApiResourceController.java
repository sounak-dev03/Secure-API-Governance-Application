package com.secureapi.governance.controller;

import com.secureapi.governance.entity.ApiResource;
import com.secureapi.governance.service.ApiResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/api-resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ApiResourceController {

    private final ApiResourceService apiResourceService;

    public ApiResourceController(ApiResourceService apiResourceService) {
        this.apiResourceService = apiResourceService;
    }

    // API_READ permission required
    @GetMapping
    @PreAuthorize("hasAuthority('API_READ')")
    public ResponseEntity<List<ApiResource>> getAllResources() {
        return ResponseEntity.ok(
                apiResourceService.getAllResources()
        );
    }

    // API_READ permission required
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('API_READ')")
    public ResponseEntity<ApiResource> getResourceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                apiResourceService.getResourceById(id)
        );
    }

    // API_MANAGE permission required
    @PostMapping
    @PreAuthorize("hasAuthority('API_MANAGE')")
    public ResponseEntity<ApiResource> createResource(
            @RequestBody ApiResource resource) {

        return ResponseEntity.ok(
                apiResourceService.createResource(resource)
        );
    }

    // API_MANAGE permission required
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('API_MANAGE')")
    public ResponseEntity<ApiResource> updateResource(
            @PathVariable Long id,
            @RequestBody ApiResource resource) {

        return ResponseEntity.ok(
                apiResourceService.updateResource(id, resource)
        );
    }

    // API_MANAGE permission required
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('API_MANAGE')")
    public ResponseEntity<Void> deleteResource(
            @PathVariable Long id) {

        apiResourceService.deleteResource(id);

        return ResponseEntity.noContent().build();
    }
}