package com.secureapi.governance.service;

import com.secureapi.governance.entity.ApiResource;
import com.secureapi.governance.repository.ApiResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApiResourceService {

    private final ApiResourceRepository apiResourceRepository;

    public ApiResourceService(ApiResourceRepository apiResourceRepository) {
        this.apiResourceRepository = apiResourceRepository;
    }

    public List<ApiResource> getAllResources() {
        return apiResourceRepository.findAll();
    }

    public ApiResource getResourceById(Long id) {
        return apiResourceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("API resource not found with id: " + id));
    }

    public ApiResource createResource(ApiResource resource) {

        if (apiResourceRepository.existsByEndpoint(resource.getEndpoint())) {
            throw new RuntimeException(
                    "API resource with this endpoint already exists");
        }

        return apiResourceRepository.save(resource);
    }

    public ApiResource updateResource(Long id, ApiResource updatedResource) {

        ApiResource existingResource = getResourceById(id);

        existingResource.setName(updatedResource.getName());
        existingResource.setEndpoint(updatedResource.getEndpoint());
        existingResource.setDescription(updatedResource.getDescription());
        existingResource.setGetAllowed(updatedResource.isGetAllowed());
        existingResource.setPostAllowed(updatedResource.isPostAllowed());
        existingResource.setPutAllowed(updatedResource.isPutAllowed());
        existingResource.setDeleteAllowed(updatedResource.isDeleteAllowed());

        return apiResourceRepository.save(existingResource);
    }

    public void deleteResource(Long id) {

        if (!apiResourceRepository.existsById(id)) {
            throw new RuntimeException(
                    "API resource not found with id: " + id);
        }

        apiResourceRepository.deleteById(id);
    }
}