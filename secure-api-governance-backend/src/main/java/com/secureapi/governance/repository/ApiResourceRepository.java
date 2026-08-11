package com.secureapi.governance.repository;

import com.secureapi.governance.entity.ApiResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApiResourceRepository extends JpaRepository<ApiResource, Long> {

    boolean existsByEndpoint(String endpoint);

}