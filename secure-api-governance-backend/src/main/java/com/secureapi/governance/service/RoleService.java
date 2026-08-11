package com.secureapi.governance.service;

import com.secureapi.governance.entity.Role;
import com.secureapi.governance.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public Role updateRole(Long id, Role updatedRole) {

        Role existingRole = getRoleById(id);

        existingRole.setName(updatedRole.getName());
        existingRole.setDescription(updatedRole.getDescription());

        return roleRepository.save(existingRole);
    }

    public Role updatePermissions(Long id, List<String> permissions) {

        Role role = getRoleById(id);

        role.setPermissions(permissions);

        return roleRepository.save(role);
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}