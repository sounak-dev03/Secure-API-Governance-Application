import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
    getCurrentUser,
    hasPermission,
    hasRole,
} from "../services/api";

function Sidebar() {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {

        const loadUser = async () => {

            try {

                const user = await getCurrentUser();

                setCurrentUser(user);

            } catch (error) {

                console.error(
                    "Failed to load current user:",
                    error
                );

            }

        };

        loadUser();

    }, []);


    const linkClass = ({ isActive }) =>
        `block px-4 py-3 rounded-lg text-sm font-medium transition ${
            isActive
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
        }`;


    const isAdmin =
        hasRole(currentUser, "ADMIN");

    const canReadUsers =
        hasPermission(
            currentUser,
            "USER_READ"
        );

    const canReadApi =
        hasPermission(
            currentUser,
            "API_READ"
        );

    const canReadAudit =
        hasPermission(
            currentUser,
            "AUDIT_READ"
        );


    return (

        <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-20">

            {/* Logo */}

            <div className="h-16 flex items-center px-6 border-b border-gray-200">

                <h1 className="text-xl font-bold text-gray-900">
                    Secure API
                </h1>

            </div>


            {/* Navigation */}

            <nav className="p-4 space-y-2">

                <NavLink
                    to="/dashboard"
                    className={linkClass}
                >
                    Dashboard
                </NavLink>


                {canReadUsers && (
                    <NavLink
                        to="/users"
                        className={linkClass}
                    >
                        Users
                    </NavLink>
                )}


                {isAdmin && (
                    <NavLink
                        to="/roles"
                        className={linkClass}
                    >
                        Roles & Permissions
                    </NavLink>
                )}


                {canReadApi && (
                    <NavLink
                        to="/api-resources"
                        className={linkClass}
                    >
                        API Resources
                    </NavLink>
                )}


                {canReadAudit && (
                    <NavLink
                        to="/audit-logs"
                        className={linkClass}
                    >
                        Audit Logs
                    </NavLink>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;