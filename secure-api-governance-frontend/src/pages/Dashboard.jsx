import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

import {
    getUsers,
    getApiResources,
    getAuditLogs,
} from "../services/api";


function Dashboard() {

    const [totalUsers, setTotalUsers] =
        useState(0);

    const [totalResources, setTotalResources] =
        useState(0);

    const [totalRequests, setTotalRequests] =
        useState(0);

    const [deniedRequests, setDeniedRequests] =
        useState(0);

    const [recentActivity, setRecentActivity] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);


                /* USERS */

                try {

                    const users =
                        await getUsers();

                    setTotalUsers(
                        users.length
                    );

                } catch (error) {

                    console.error(
                        "Failed to load users:",
                        error
                    );

                }


                /* API RESOURCES */

                try {

                    const resources =
                        await getApiResources();

                    setTotalResources(
                        resources.length
                    );

                } catch (error) {

                    console.error(
                        "Failed to load API resources:",
                        error
                    );

                }


                /* AUDIT LOGS */

                try {

                    const logs =
                        await getAuditLogs();

                    setTotalRequests(
                        logs.length
                    );

                    setDeniedRequests(
                        logs.filter(
                            (log) =>
                                log.status ===
                                "DENIED"
                        ).length
                    );

                    setRecentActivity(
                        logs
                            .slice()
                            .sort(
                                (a, b) =>
                                    new Date(
                                        b.timestamp
                                    ) -
                                    new Date(
                                        a.timestamp
                                    )
                            )
                            .slice(0, 5)
                    );

                } catch (error) {

                    console.error(
                        "Failed to load audit logs:",
                        error
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        loadDashboard();

    }, []);


    return (

        <div className="min-h-screen bg-gray-100">

            <Sidebar />

            <Navbar />


            <main className="ml-64 pt-16">

                <div className="p-8">


                    {/* HEADER */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-900">
                            Security Dashboard
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Monitor API access, users and security activity.
                        </p>

                    </div>


                    {/* STATISTICS */}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                        <StatCard
                            title="Total Users"
                            value={
                                loading
                                    ? "..."
                                    : totalUsers
                            }
                            description="Registered platform users"
                        />


                        <StatCard
                            title="API Resources"
                            value={
                                loading
                                    ? "..."
                                    : totalResources
                            }
                            description="Protected API endpoints"
                        />


                        <StatCard
                            title="Total Requests"
                            value={
                                loading
                                    ? "..."
                                    : totalRequests
                            }
                            description="Requests processed"
                        />


                        <StatCard
                            title="Denied Requests"
                            value={
                                loading
                                    ? "..."
                                    : deniedRequests
                            }
                            description="Unauthorized attempts"
                        />

                    </div>


                    {/* RECENT ACTIVITY */}

                    <div className="mt-8 bg-white rounded-xl border border-gray-200">

                        <div className="p-6 border-b border-gray-200">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Recent Security Activity
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Latest API access events
                            </p>

                        </div>


                        {recentActivity.length === 0 ? (

                            <div className="p-8 text-center text-gray-500">
                                No recent security activity.
                            </div>

                        ) : (

                            <div className="divide-y divide-gray-200">

                                {recentActivity.map(
                                    (log, index) => (

                                        <div
                                            key={
                                                log.id ||
                                                index
                                            }
                                            className="p-5 flex items-center justify-between"
                                        >

                                            <div>

                                                <p className="font-medium text-gray-900">
                                                    {log.method}{" "}
                                                    {log.endpoint}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {log.username}
                                                </p>

                                            </div>


                                            <span
                                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                                    log.status ===
                                                    "GRANTED"
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {log.status}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>

    );
}

export default Dashboard;