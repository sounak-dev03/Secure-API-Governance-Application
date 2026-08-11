import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getAuditLogs } from "../services/api";

function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch audit logs from backend
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAuditLogs(searchTerm, statusFilter);

      setAuditLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs whenever search or status filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAuditLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const methodStyles = {
    GET: "bg-gray-100 text-gray-800",
    POST: "bg-gray-900 text-white",
    PUT: "bg-gray-200 text-gray-800",
    DELETE: "bg-gray-800 text-white",
    PATCH: "bg-gray-300 text-gray-800",
    OPTIONS: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />

      <Navbar />

      <main className="ml-64 pt-16">

        <div className="p-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Audit Logs
            </h1>

            <p className="text-gray-500 mt-2">
              Monitor API access and security-related activities.
            </p>
          </div>

          {/* Logs Container */}
          <div className="bg-white rounded-xl border border-gray-200">

            {/* Filters */}
            <div className="p-6 border-b border-gray-200">

              <div className="flex flex-col md:flex-row gap-4">

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search username, endpoint, method or IP..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full md:max-w-md px-4 py-3 border border-gray-300
                             rounded-lg focus:outline-none
                             focus:ring-2 focus:ring-gray-900"
                />

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2
                             focus:ring-gray-900"
                >
                  <option value="ALL">All Status</option>
                  <option value="GRANTED">Granted</option>
                  <option value="DENIED">Denied</option>
                </select>

              </div>

            </div>

            {/* Loading State */}
            {loading && (
              <div className="p-8 text-center text-gray-500">
                Loading audit logs...
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="p-8 text-center text-red-600">
                {error}
              </div>
            )}

            {/* Audit Table */}
            {!loading && !error && (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b border-gray-200">

                    <tr>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Timestamp
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        User
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Method
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Endpoint
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        IP Address
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-200">

                    {auditLogs.map((log) => (

                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* Timestamp */}
                        <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                          {log.timestamp}
                        </td>

                        {/* Username */}
                        <td className="px-6 py-5">

                          <span className="font-medium text-gray-900">
                            {log.username}
                          </span>

                        </td>

                        {/* Method */}
                        <td className="px-6 py-5">

                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              methodStyles[log.method] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {log.method}
                          </span>

                        </td>

                        {/* Endpoint */}
                        <td className="px-6 py-5">

                          <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                            {log.endpoint}
                          </code>

                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">

                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              log.status === "GRANTED"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-gray-900 text-white"
                            }`}
                          >
                            {log.status}
                          </span>

                        </td>

                        {/* IP Address */}
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {log.ipAddress}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

            {/* Empty Result */}
            {!loading && !error && auditLogs.length === 0 && (

              <div className="p-8 text-center text-gray-500">
                No audit logs found.
              </div>

            )}

            {/* Footer */}
            {!loading && !error && (

              <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
                Showing {auditLogs.length} audit logs
              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AuditLogs;