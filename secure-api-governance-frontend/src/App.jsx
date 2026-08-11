import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import ApiResources from "./pages/ApiResources";
import AuditLogs from "./pages/AuditLogs";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    return (

        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================= */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =========================
                DASHBOARD
            ========================= */}

            <Route
                element={
                    <ProtectedRoute />
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Route>


            {/* =========================
                USERS
            ========================= */}

            <Route
                element={
                    <ProtectedRoute
                        requiredPermission="USER_READ"
                    />
                }
            >

                <Route
                    path="/users"
                    element={<Users />}
                />

            </Route>


            {/* =========================
                ROLES
                ADMIN ONLY
            ========================= */}

            <Route
                element={
                    <ProtectedRoute
                        requiredRole="ADMIN"
                    />
                }
            >

                <Route
                    path="/roles"
                    element={<Roles />}
                />

            </Route>


            {/* =========================
                API RESOURCES
            ========================= */}

            <Route
                element={
                    <ProtectedRoute
                        requiredPermission="API_READ"
                    />
                }
            >

                <Route
                    path="/api-resources"
                    element={<ApiResources />}
                />

            </Route>


            {/* =========================
                AUDIT LOGS
            ========================= */}

            <Route
                element={
                    <ProtectedRoute
                        requiredPermission="AUDIT_READ"
                    />
                }
            >

                <Route
                    path="/audit-logs"
                    element={<AuditLogs />}
                />

            </Route>

        </Routes>

    );
}

export default App;