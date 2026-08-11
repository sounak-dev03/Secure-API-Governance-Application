import { useEffect, useState } from "react";
import {
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";

import {
    getCurrentUser,
    hasPermission,
    hasRole,
} from "../services/api";

function ProtectedRoute({
    requiredPermission,
    requiredRole,
}) {

    const location = useLocation();

    const [state, setState] = useState({
        loading: true,
        authenticated: false,
        user: null,
    });


    useEffect(() => {

        const checkAuthentication = async () => {

            try {

                const user =
                    await getCurrentUser();

                setState({
                    loading: false,
                    authenticated: true,
                    user,
                });

            } catch (error) {

                setState({
                    loading: false,
                    authenticated: false,
                    user: null,
                });

            }

        };

        checkAuthentication();

    }, []);


    if (state.loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <p className="text-gray-600">
                    Checking authentication...
                </p>

            </div>
        );

    }


    if (!state.authenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (
        requiredRole &&
        !hasRole(
            state.user,
            requiredRole
        )
    ) {

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-md">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Access Denied
                    </h1>

                    <p className="mt-3 text-gray-500">
                        You do not have permission to access this page.
                    </p>

                    <button
                        onClick={() =>
                            window.history.back()
                        }
                        className="mt-6 px-5 py-3 bg-gray-900 text-white rounded-lg"
                    >
                        Go Back
                    </button>

                </div>

            </div>
        );

    }


    if (
        requiredPermission &&
        !hasPermission(
            state.user,
            requiredPermission
        )
    ) {

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center max-w-md">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Access Denied
                    </h1>

                    <p className="mt-3 text-gray-500">
                        You do not have permission to access this page.
                    </p>

                    <button
                        onClick={() =>
                            window.history.back()
                        }
                        className="mt-6 px-5 py-3 bg-gray-900 text-white rounded-lg"
                    >
                        Go Back
                    </button>

                </div>

            </div>
        );

    }


    return <Outlet />;

}

export default ProtectedRoute;