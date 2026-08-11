package com.secureapi.governance.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "api_resources")
public class ApiResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String endpoint;

    @Column(length = 500)
    private String description;

    @Column(name = "get_allowed", nullable = false)
    private boolean getAllowed;

    @Column(name = "post_allowed", nullable = false)
    private boolean postAllowed;

    @Column(name = "put_allowed", nullable = false)
    private boolean putAllowed;

    @Column(name = "delete_allowed", nullable = false)
    private boolean deleteAllowed;

    public ApiResource() {
    }

    public ApiResource(
            String name,
            String endpoint,
            String description,
            boolean getAllowed,
            boolean postAllowed,
            boolean putAllowed,
            boolean deleteAllowed) {

        this.name = name;
        this.endpoint = endpoint;
        this.description = description;
        this.getAllowed = getAllowed;
        this.postAllowed = postAllowed;
        this.putAllowed = putAllowed;
        this.deleteAllowed = deleteAllowed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isGetAllowed() {
        return getAllowed;
    }

    public void setGetAllowed(boolean getAllowed) {
        this.getAllowed = getAllowed;
    }

    public boolean isPostAllowed() {
        return postAllowed;
    }

    public void setPostAllowed(boolean postAllowed) {
        this.postAllowed = postAllowed;
    }

    public boolean isPutAllowed() {
        return putAllowed;
    }

    public void setPutAllowed(boolean putAllowed) {
        this.putAllowed = putAllowed;
    }

    public boolean isDeleteAllowed() {
        return deleteAllowed;
    }

    public void setDeleteAllowed(boolean deleteAllowed) {
        this.deleteAllowed = deleteAllowed;
    }
}