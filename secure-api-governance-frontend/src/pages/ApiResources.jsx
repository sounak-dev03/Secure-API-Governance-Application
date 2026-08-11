import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
    getApiResources,
    createApiResource,
    updateApiResource,
    deleteApiResource,
    getCurrentUser,
    hasPermission,
} from "../services/api";


function ApiResources() {

    const [apiResources, setApiResources] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [currentUser, setCurrentUser] =
        useState(null);

    const [showModal, setShowModal] =
        useState(false);

    const [editingResource, setEditingResource] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [formData, setFormData] =
        useState({
            name: "",
            endpoint: "",
            description: "",
            getAllowed: false,
            postAllowed: false,
            putAllowed: false,
            deleteAllowed: false,
        });


    const canRead =
        hasPermission(
            currentUser,
            "API_READ"
        );

    const canManage =
        hasPermission(
            currentUser,
            "API_MANAGE"
        );


    /* =========================
       LOAD
    ========================= */

    const loadResources = async () => {

        try {

            setError("");

            const user =
                await getCurrentUser();

            setCurrentUser(user);

            const data =
                await getApiResources();

            setApiResources(data);

        } catch (err) {

            console.error(err);

            setError(
                "Failed to load API resources."
            );

        }

    };


    useEffect(() => {

        loadResources();

    }, []);


    /* =========================
       FORM
    ========================= */

    const handleInputChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

    };


    const openAddModal = () => {

        if (!canManage) {
            return;
        }

        setEditingResource(null);

        setFormData({
            name: "",
            endpoint: "",
            description: "",
            getAllowed: false,
            postAllowed: false,
            putAllowed: false,
            deleteAllowed: false,
        });

        setError("");
        setMessage("");

        setShowModal(true);

    };


    const openEditModal = (resource) => {

        if (!canManage) {
            return;
        }

        setEditingResource(resource);

        setFormData({
            name: resource.name,
            endpoint: resource.endpoint,
            description:
                resource.description || "",
            getAllowed:
                resource.getAllowed,
            postAllowed:
                resource.postAllowed,
            putAllowed:
                resource.putAllowed,
            deleteAllowed:
                resource.deleteAllowed,
        });

        setError("");
        setMessage("");

        setShowModal(true);

    };


    const closeModal = () => {

        setShowModal(false);

        setEditingResource(null);

    };


    /* =========================
       SAVE
    ========================= */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!canManage) {
            return;
        }

        try {

            setError("");
            setMessage("");

            if (editingResource) {

                await updateApiResource(
                    editingResource.id,
                    formData
                );

                setMessage(
                    "API resource updated successfully."
                );

            } else {

                await createApiResource(
                    formData
                );

                setMessage(
                    "API resource created successfully."
                );

            }

            closeModal();

            await loadResources();

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to save API resource."
            );

        }

    };


    /* =========================
       DELETE
    ========================= */

    const handleDelete = async (id) => {

        if (!canManage) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this API resource?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteApiResource(id);

            setMessage(
                "API resource deleted successfully."
            );

            await loadResources();

        } catch (err) {

            console.error(err);

            setError(
                "Failed to delete API resource."
            );

        }

    };


    const filteredResources =
        apiResources.filter(
            (resource) =>
                resource.name
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    ) ||

                resource.endpoint
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
        );


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
                                API Resources
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Manage protected APIs and their permitted operations.
                            </p>

                        </div>


                        {canManage && (

                            <button
                                onClick={openAddModal}
                                className="bg-gray-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                            >
                                + Add API Resource
                            </button>

                        )}

                    </div>


                    {/* MESSAGES */}

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

                    <div className="bg-white rounded-xl border border-gray-200 mb-8">

                        <div className="p-6">

                            <input
                                type="text"
                                placeholder="Search API resources..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg"
                            />

                        </div>

                    </div>


                    {/* TABLE */}

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                        {filteredResources.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">
                                No API resources found.
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50 border-b border-gray-200">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Name
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Endpoint
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Description
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                                Methods
                                            </th>

                                            {canManage && (

                                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                                    Actions
                                                </th>

                                            )}

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-200">

                                        {filteredResources.map(
                                            (resource) => (

                                                <tr
                                                    key={resource.id}
                                                    className="hover:bg-gray-50"
                                                >

                                                    <td className="px-6 py-5 font-medium text-gray-900">
                                                        {resource.name}
                                                    </td>

                                                    <td className="px-6 py-5 font-mono text-sm text-gray-600">
                                                        {resource.endpoint}
                                                    </td>

                                                    <td className="px-6 py-5 text-gray-600">
                                                        {resource.description}
                                                    </td>

                                                    <td className="px-6 py-5">

                                                        <div className="flex gap-2">

                                                            {resource.getAllowed && (
                                                                <span className="px-2 py-1 text-xs rounded bg-gray-100">
                                                                    GET
                                                                </span>
                                                            )}

                                                            {resource.postAllowed && (
                                                                <span className="px-2 py-1 text-xs rounded bg-gray-900 text-white">
                                                                    POST
                                                                </span>
                                                            )}

                                                            {resource.putAllowed && (
                                                                <span className="px-2 py-1 text-xs rounded bg-gray-200">
                                                                    PUT
                                                                </span>
                                                            )}

                                                            {resource.deleteAllowed && (
                                                                <span className="px-2 py-1 text-xs rounded bg-gray-800 text-white">
                                                                    DELETE
                                                                </span>
                                                            )}

                                                        </div>

                                                    </td>


                                                    {canManage && (

                                                        <td className="px-6 py-5 text-right">

                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        resource
                                                                    )
                                                                }
                                                                className="text-sm font-medium text-gray-700 hover:text-black mr-4"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        resource.id
                                                                    )
                                                                }
                                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                                            >
                                                                Delete
                                                            </button>

                                                        </td>

                                                    )}

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                        <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
                            Showing {filteredResources.length} of{" "}
                            {apiResources.length} API resources
                        </div>

                    </div>

                </div>

            </main>


            {/* MODAL */}

            {showModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-xl font-bold text-gray-900">

                                {editingResource
                                    ? "Edit API Resource"
                                    : "Add API Resource"}

                            </h2>

                            <button
                                onClick={closeModal}
                                className="text-gray-500 text-2xl"
                            >
                                ×
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="mb-4">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />

                            </div>


                            <div className="mb-4">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Endpoint
                                </label>

                                <input
                                    type="text"
                                    name="endpoint"
                                    value={formData.endpoint}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />

                            </div>


                            <div className="mb-4">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    rows="3"
                                />

                            </div>


                            <div className="space-y-3 mb-6">

                                {[
                                    ["getAllowed", "GET"],
                                    ["postAllowed", "POST"],
                                    ["putAllowed", "PUT"],
                                    ["deleteAllowed", "DELETE"],
                                ].map(
                                    ([field, label]) => (

                                        <label
                                            key={field}
                                            className="flex items-center gap-3"
                                        >

                                            <input
                                                type="checkbox"
                                                name={field}
                                                checked={
                                                    formData[field]
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                            />

                                            <span>
                                                {label}
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>


                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-3 border border-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-3 bg-gray-900 text-white rounded-lg"
                                >
                                    {editingResource
                                        ? "Update Resource"
                                        : "Create Resource"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ApiResources;