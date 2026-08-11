const API_BASE_URL = "http://localhost:8080/api";

/* =========================
   FRONTEND ROLE PERMISSIONS
========================= */

const ROLE_PERMISSIONS = {
    ADMIN: [
        "USER_READ",
        "USER_CREATE",
        "USER_UPDATE",
        "USER_DELETE",
        "API_READ",
        "API_MANAGE",
        "AUDIT_READ",
        "DOCUMENT_READ",
    ],

    MANAGER: [
        "USER_READ",
        "USER_UPDATE",
        "API_READ",
        "AUDIT_READ",
        "DOCUMENT_READ",
    ],

    EMPLOYEE: [
        "USER_READ",
        "DOCUMENT_READ",
    ],
};


/* =========================
   AUTH
========================= */

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Invalid username or password");
    }

    return response.json();
};


export const getCurrentUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Not authenticated");
    }

    const user = await response.json();

    const role = user.role
        ? user.role.toUpperCase()
        : "";

    return {
        ...user,
        username: user.username || "",
        role,
        permissions:
            Array.isArray(user.permissions)
                ? user.permissions
                : ROLE_PERMISSIONS[role] || [],
    };
};


export const logoutUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }

    return response.json();
};


/* =========================
   AUTHORIZATION HELPERS
========================= */

export const hasPermission = (user, permission) => {
    if (!user) {
        return false;
    }

    return user.permissions?.includes(permission) || false;
};


export const hasAnyPermission = (user, permissions) => {
    if (!user) {
        return false;
    }

    return permissions.some((permission) =>
        user.permissions?.includes(permission)
    );
};


export const hasAllPermissions = (user, permissions) => {
    if (!user) {
        return false;
    }

    return permissions.every((permission) =>
        user.permissions?.includes(permission)
    );
};


export const hasRole = (user, role) => {
    if (!user?.role) {
        return false;
    }

    return user.role.toUpperCase() === role.toUpperCase();
};


/* =========================
   USERS
========================= */

export const getUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
};


export const getUserById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return response.json();
};


export const createUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    return response.json();
};


export const updateUser = async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return response.json();
};


export const deleteUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }
};


/* =========================
   ROLES
========================= */

export const getRoles = async () => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch roles");
    }

    return response.json();
};


export const createRole = async (roleData) => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(roleData),
    });

    if (!response.ok) {
        throw new Error("Failed to create role");
    }

    return response.json();
};


export const updateRole = async (id, roleData) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(roleData),
    });

    if (!response.ok) {
        throw new Error("Failed to update role");
    }

    return response.json();
};


export const deleteRole = async (id) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to delete role");
    }
};


export const updateRolePermissions = async (id, permissions) => {
    const response = await fetch(
        `${API_BASE_URL}/roles/${id}/permissions`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(permissions),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update role permissions");
    }

    return response.json();
};


/* =========================
   API RESOURCES
========================= */

export const getApiResources = async () => {
    const response = await fetch(
        `${API_BASE_URL}/api-resources`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch API resources");
    }

    return response.json();
};


export const getApiResourceById = async (id) => {
    const response = await fetch(
        `${API_BASE_URL}/api-resources/${id}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch API resource");
    }

    return response.json();
};


export const createApiResource = async (resourceData) => {
    const response = await fetch(
        `${API_BASE_URL}/api-resources`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(resourceData),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create API resource");
    }

    return response.json();
};


export const updateApiResource = async (id, resourceData) => {
    const response = await fetch(
        `${API_BASE_URL}/api-resources/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(resourceData),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update API resource");
    }

    return response.json();
};


export const deleteApiResource = async (id) => {
    const response = await fetch(
        `${API_BASE_URL}/api-resources/${id}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete API resource");
    }
};


/* =========================
   AUDIT LOGS
========================= */

export const getAuditLogs = async (
    search = "",
    status = "ALL"
) => {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (status && status !== "ALL") {
        params.append("status", status);
    }

    const queryString = params.toString();

    const response = await fetch(
        `${API_BASE_URL}/audit-logs${
            queryString ? `?${queryString}` : ""
        }`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
    }

    return response.json();
};