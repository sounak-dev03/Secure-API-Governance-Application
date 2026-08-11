import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getCurrentUser,
    logoutUser,
} from "../services/api";

function Navbar() {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Failed to load current user:", error);
            }
        };

        loadUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();

            sessionStorage.removeItem("authenticated");

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const username =
        currentUser?.username || "User";

    const role =
        currentUser?.role || "USER";

    const displayRole =
        role.charAt(0) +
        role.slice(1).toLowerCase();

    const initial =
        username.charAt(0).toUpperCase();

    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">

            {/* Page title */}

            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    Security Administration
                </h2>

                <p className="text-xs text-gray-500">
                    Manage your API security and access
                </p>
            </div>


            {/* User section */}

            <div className="flex items-center gap-4">

                <div className="text-right">

                    <p className="text-sm font-semibold text-gray-900">
                        {username}
                    </p>

                    <p className="text-xs text-gray-500">
                        {displayRole}
                    </p>

                </div>


                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                    {initial}
                </div>


                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                    Logout
                </button>

            </div>

        </header>
    );
}

export default Navbar;