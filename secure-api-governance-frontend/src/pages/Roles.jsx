import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions,
} from "../services/api";


const ALL_PERMISSIONS = [
    "USER_READ",
    "USER_CREATE",
    "USER_UPDATE",
    "USER_DELETE",
    "API_READ",
    "API_MANAGE",
    "AUDIT_READ",
    "DOCUMENT_READ",
];


function Roles() {

    const [roles, setRoles] =
        useState([]);

    const [selectedRoleId, setSelectedRoleId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [showRoleForm, setShowRoleForm] =
        useState(false);

    const [editingRole, setEditingRole] =
        useState(null);

    const [roleName, setRoleName] =
        useState("");

    const [roleDescription, setRoleDescription] =
        useState("");

    const [editingPermissions, setEditingPermissions] =
        useState(false);

    const [selectedPermissions, setSelectedPermissions] =
        useState([]);


    /* =========================
       LOAD
    ========================= */

    const loadRoles = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getRoles();

            setRoles(data);

            if (data.length > 0) {

                setSelectedRoleId(
                    (currentId) => {

                        if (
                            currentId &&
                            data.some(
                                (role) =>
                                    role.id === currentId
                            )
                        ) {
                            return currentId;
                        }

                        return data[0].id;

                    }
                );

            }

        } catch (err) {

            console.error(err);

            setError(
                "Failed to load roles."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadRoles();

    }, []);


    const activeRole =
        roles.find(
            (role) =>
                role.id === selectedRoleId
        );


    const filteredRoles =
        roles.filter(
            (role) =>
                role.name
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
        );


    /* =========================
       ADD ROLE
    ========================= */

    const openAddRole = () => {

        setEditingRole(null);

        setRoleName("");
        setRoleDescription("");

        setShowRoleForm(true);

    };


    /* =========================
       EDIT ROLE
    ========================= */

    const openEditRole = (role) => {

        setEditingRole(role);

        setRoleName(role.name);

        setRoleDescription(
            role.description || ""
        );

        setShowRoleForm(true);

    };


    /* =========================
       SAVE ROLE
    ========================= */

    const handleSaveRole = async (event) => {

        event.preventDefault();

        if (!roleName.trim()) {

            setError(
                "Role name is required."
            );

            return;

        }

        try {

            setError("");
            setMessage("");

            if (editingRole) {

                await updateRole(
                    editingRole.id,
                    {
                        name: roleName,
                        description:
                            roleDescription,
                    }
                );

                setMessage(
                    "Role updated successfully."
                );

            } else {

                await createRole({
                    name: roleName,
                    description:
                        roleDescription,
                });

                setMessage(
                    "Role created successfully."
                );

            }

            setShowRoleForm(false);

            await loadRoles();

        } catch (err) {

            console.error(err);

            setError(
                "Failed to save role."
            );

        }

    };


    /* =========================
       DELETE ROLE
    ========================= */

    const handleDeleteRole = async (role) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${role.name}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteRole(
                role.id
            );

            setMessage(
                "Role deleted successfully."
            );

            setSelectedRoleId(null);

            await loadRoles();

        } catch (err) {

            console.error(err);

            setError(
                "Failed to delete role."
            );

        }

    };


    /* =========================
       PERMISSION EDIT
    ========================= */

    const startPermissionEdit = () => {

        if (!activeRole) {
            return;
        }

        setSelectedPermissions(
            activeRole.permissions || []
        );

        setEditingPermissions(true);

    };


    const togglePermission = (
        permission
    ) => {

        setSelectedPermissions(
            (currentPermissions) => {

                if (
                    currentPermissions.includes(
                        permission
                    )
                ) {

                    return currentPermissions.filter(
                        (item) =>
                            item !== permission
                    );

                }

                return [
                    ...currentPermissions,
                    permission,
                ];

            }
        );

    };


    const savePermissions = async () => {

        if (!activeRole) {
            return;
        }

        try {

            setError("");
            setMessage("");

            const updated =
                await updateRolePermissions(
                    activeRole.id,
                    selectedPermissions
                );

            setRoles(
                (currentRoles) =>
                    currentRoles.map(
                        (role) =>
                            role.id === updated.id
                                ? updated
                                : role
                    )
            );

            setEditingPermissions(false);

            setMessage(
                "Permissions updated successfully."
            );

        } catch (err) {

            console.error(err);

            setError(
                "Failed to update permissions."
            );

        }

    };


    return (

        <div className="min-h-screen bg-gray-100">

            <Sidebar />

            <Navbar />


            <main className="ml-64 pt-16">

                <div className="p-8">


                    {/* HEADER */}

                    <div className="flex items-center justify-between mb-8">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Roles & Permissions
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Manage roles and control access to protected resources.
                            </p>

                        </div>


                        <button
                            onClick={openAddRole}
                            className="bg-gray-900 text-white px-5 py-3 rounded-lg"
                        >
                            + Add Role
                        </button>

                    </div>


                    {message && (

                        <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50 text-green-700">
                            {message}
                        </div>

                    )}


                    {error && (

                        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
                            {error}
                        </div>

                    )}


                    {/* SEARCH */}

                    <div className="bg-white rounded-xl border border-gray-200 mb-6 p-6">

                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg"
                        />

                    </div>


                    {loading ? (

                        <div className="bg-white rounded-xl p-10 text-center text-gray-500">
                            Loading roles...
                        </div>

                    ) : (

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                            {/* ROLES */}

                            <div className="bg-white rounded-xl border border-gray-200">

                                <div className="p-6 border-b border-gray-200">

                                    <h2 className="text-lg font-semibold">
                                        Roles
                                    </h2>

                                </div>


                                <div className="p-4 space-y-2">

                                    {filteredRoles.map(
                                        (role) => (

                                            <button
                                                key={role.id}
                                                onClick={() =>
                                                    setSelectedRoleId(
                                                        role.id
                                                    )
                                                }
                                                className={`w-full text-left p-4 rounded-lg ${
                                                    selectedRoleId === role.id
                                                        ? "bg-gray-900 text-white"
                                                        : "hover:bg-gray-100"
                                                }`}
                                            >

                                                <div className="flex justify-between">

                                                    <span className="font-semibold">
                                                        {role.name}
                                                    </span>

                                                    <span className="text-xs">
                                                        {(
                                                            role.permissions ||
                                                            []
                                                        ).length} permissions
                                                    </span>

                                                </div>

                                                <p className="text-sm mt-1 opacity-70">
                                                    {role.description}
                                                </p>

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>


                            {/* PERMISSIONS */}

                            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">

                                {activeRole ? (

                                    <>

                                        <div className="p-6 border-b border-gray-200 flex justify-between">

                                            <div>

                                                <h2 className="text-lg font-semibold">
                                                    {activeRole.name}
                                                </h2>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {activeRole.description}
                                                </p>

                                            </div>


                                            <div className="flex gap-3">

                                                <button
                                                    onClick={() =>
                                                        openEditRole(
                                                            activeRole
                                                        )
                                                    }
                                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteRole(
                                                            activeRole
                                                        )
                                                    }
                                                    className="px-4 py-2 text-red-600 border border-gray-300 rounded-lg"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>


                                        <div className="p-6">

                                            <div className="flex justify-between mb-6">

                                                <h3 className="font-semibold">
                                                    Permissions
                                                </h3>

                                                {!editingPermissions && (

                                                    <button
                                                        onClick={
                                                            startPermissionEdit
                                                        }
                                                        className="px-4 py-2 bg-gray-900 text-white rounded-lg"
                                                    >
                                                        Edit Permissions
                                                    </button>

                                                )}

                                            </div>


                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                {ALL_PERMISSIONS.map(
                                                    (permission) => (

                                                        <label
                                                            key={permission}
                                                            className="flex items-center gap-3 border border-gray-200 rounded-lg p-4"
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    editingPermissions
                                                                        ? selectedPermissions.includes(
                                                                            permission
                                                                        )
                                                                        : (
                                                                            activeRole.permissions ||
                                                                            []
                                                                        ).includes(
                                                                            permission
                                                                        )
                                                                }
                                                                disabled={
                                                                    !editingPermissions
                                                                }
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        permission
                                                                    )
                                                                }
                                                            />

                                                            <span className="text-sm">
                                                                {permission}
                                                            </span>

                                                        </label>

                                                    )
                                                )}

                                            </div>


                                            {editingPermissions && (

                                                <div className="flex justify-end gap-3 mt-6">

                                                    <button
                                                        onClick={() =>
                                                            setEditingPermissions(
                                                                false
                                                            )
                                                        }
                                                        className="px-5 py-3 border border-gray-300 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        onClick={
                                                            savePermissions
                                                        }
                                                        className="px-5 py-3 bg-gray-900 text-white rounded-lg"
                                                    >
                                                        Save Permissions
                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    </>

                                ) : (

                                    <div className="p-10 text-center text-gray-500">
                                        Select a role.
                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </main>


            {/* ROLE MODAL */}

            {showRoleForm && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

                        <h2 className="text-xl font-bold mb-6">
                            {editingRole
                                ? "Edit Role"
                                : "Add Role"}
                        </h2>

                        <form onSubmit={handleSaveRole}>

                            <input
                                type="text"
                                placeholder="Role name"
                                value={roleName}
                                onChange={(event) =>
                                    setRoleName(
                                        event.target.value
                                    )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                                required
                            />

                            <textarea
                                placeholder="Description"
                                value={roleDescription}
                                onChange={(event) =>
                                    setRoleDescription(
                                        event.target.value
                                    )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6"
                                rows="4"
                            />

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowRoleForm(
                                            false
                                        )
                                    }
                                    className="px-5 py-3 border border-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-gray-900 text-white rounded-lg"
                                >
                                    Save Role
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Roles;