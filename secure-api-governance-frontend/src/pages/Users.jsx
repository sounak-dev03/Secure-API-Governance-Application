import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
    getUsers,
    getRoles,
    getCurrentUser,
    hasPermission,
    hasRole,
    createUser,
    updateUser,
    deleteUser,
} from "../services/api";


function Users() {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    const [currentUser, setCurrentUser] =
        useState(null);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingUser, setEditingUser] =
        useState(null);

    const [formData, setFormData] =
        useState({
            username: "",
            email: "",
            password: "",
            role: "",
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const canCreate =
        hasPermission(
            currentUser,
            "USER_CREATE"
        );

    const canUpdate =
        hasPermission(
            currentUser,
            "USER_UPDATE"
        );

    const canDelete =
        hasPermission(
            currentUser,
            "USER_DELETE"
        );

    const isAdmin =
        hasRole(
            currentUser,
            "ADMIN"
        );


    /* =========================
       LOAD DATA
    ========================= */

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const user =
                await getCurrentUser();

            setCurrentUser(user);


            const usersData =
                await getUsers();

            setUsers(usersData);


            /*
             * Only ADMIN needs the role
             * list for creating users.
             */
            if (isAdmin || user.role === "ADMIN") {

                try {

                    const rolesData =
                        await getRoles();

                    setRoles(rolesData);

                } catch (roleError) {

                    console.error(
                        "Failed to load roles:",
                        roleError
                    );

                }

            }

        } catch (error) {

            console.error(error);

            setError(
                "Failed to load users."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadData();

    }, []);


    /* =========================
       FORM INPUT
    ========================= */

    const handleInputChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    /* =========================
       ADD USER
    ========================= */

    const handleAddUser = () => {

        if (!canCreate) {
            return;
        }

        setEditingUser(null);

        setFormData({
            username: "",
            email: "",
            password: "",
            role: "",
        });

        setError("");
        setSuccess("");

        setShowModal(true);

    };


    /* =========================
       EDIT USER
    ========================= */

    const handleEditUser = (user) => {

        if (!canUpdate) {
            return;
        }

        setEditingUser(user);

        setFormData({
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
        });

        setError("");
        setSuccess("");

        setShowModal(true);

    };


    /* =========================
       CREATE / UPDATE
    ========================= */

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setError("");
            setSuccess("");

            if (editingUser) {

                if (!canUpdate) {
                    return;
                }

                await updateUser(
                    editingUser.id,
                    formData
                );

                setSuccess(
                    "User updated successfully."
                );

            } else {

                if (!canCreate) {
                    return;
                }

                await createUser(formData);

                setSuccess(
                    "User created successfully."
                );

            }

            setShowModal(false);
            setEditingUser(null);

            setFormData({
                username: "",
                email: "",
                password: "",
                role: "",
            });

            await loadData();

        } catch (error) {

            console.error(error);

            setError(
                editingUser
                    ? "Failed to update user."
                    : "Failed to create user."
            );

        }

    };


    /* =========================
       DELETE
    ========================= */

    const handleDeleteUser = async (id) => {

        if (!canDelete) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteUser(id);

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) =>
                        user.id !== id
                )
            );

            setSuccess(
                "User deleted successfully."
            );

            setError("");

        } catch (error) {

            console.error(error);

            setError(
                "Failed to delete user."
            );

            setSuccess("");

        }

    };


    /* =========================
       SEARCH
    ========================= */

    const filteredUsers =
        users.filter(
            (user) =>
                user.username
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    ) ||

                user.email
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    ) ||

                user.role
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
        );


    return (

        <div className="min-h-screen bg-gray-50">

            <Sidebar />

            <Navbar />


            <main className="ml-64 pt-16">

                <div className="p-8">


                    {/* HEADER */}

                    <div className="flex items-center justify-between mb-8">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Users
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Manage platform users and their access roles.
                            </p>

                        </div>


                        {canCreate && (

                            <button
                                onClick={handleAddUser}
                                className="bg-gray-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                            >
                                + Add User
                            </button>

                        )}

                    </div>


                    {/* MESSAGES */}

                    {success && (

                        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                            {success}
                        </div>

                    )}


                    {error && (

                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                            {error}
                        </div>

                    )}


                    {/* SEARCH */}

                    <div className="bg-white rounded-xl border border-gray-200 mb-8">

                        <div className="p-6">

                            <input
                                type="text"
                                placeholder="Search by username, email or role..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />

                        </div>

                    </div>


                    {/* TABLE */}

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                        {loading ? (

                            <div className="p-10 text-center text-gray-500">
                                Loading users...
                            </div>

                        ) : filteredUsers.length === 0 ? (

                            <div className="p-10 text-center text-gray-500">
                                No users found.
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50 border-b border-gray-200">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                ID
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Username
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Email
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Role
                                            </th>

                                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-200">

                                        {filteredUsers.map(
                                            (user) => (

                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50 transition"
                                                >

                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user.id}
                                                    </td>

                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {user.username}
                                                    </td>

                                                    <td className="px-6 py-4 text-gray-600">
                                                        {user.email}
                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                                            {user.role}
                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-4 text-right">

                                                        {canUpdate && (

                                                            <button
                                                                onClick={() =>
                                                                    handleEditUser(
                                                                        user
                                                                    )
                                                                }
                                                                className="text-sm font-medium text-gray-700 hover:text-black mr-4"
                                                            >
                                                                Edit
                                                            </button>

                                                        )}


                                                        {canDelete && (

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        user.id
                                                                    )
                                                                }
                                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                                            >
                                                                Delete
                                                            </button>

                                                        )}

                                                        {!canUpdate &&
                                                            !canDelete && (

                                                                <span className="text-sm text-gray-400">
                                                                    View only
                                                                </span>

                                                            )}

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </main>


            {/* MODAL */}

            {showModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <h2 className="text-2xl font-bold text-gray-900">

                                    {editingUser
                                        ? "Edit User"
                                        : "Add User"}

                                </h2>

                                <p className="text-gray-500 mt-1">

                                    {editingUser
                                        ? "Update user information."
                                        : "Create a new platform user."}

                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="text-gray-500 hover:text-gray-900 text-2xl"
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>


                            {/* USERNAME */}

                            <div className="mb-4">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="mb-4">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="mb-4">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingUser}
                                    placeholder={
                                        editingUser
                                            ? "Leave blank to keep current password"
                                            : ""
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />

                            </div>


                            {/* ROLE */}

                            <div className="mb-6">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                >

                                    <option value="">
                                        Select a role
                                    </option>

                                    {roles.map(
                                        (role) => (

                                            <option
                                                key={role.id}
                                                value={role.name}
                                            >
                                                {role.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-gray-900 text-white rounded-lg"
                                >
                                    {editingUser
                                        ? "Update User"
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Users;