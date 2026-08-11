import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const data = await loginUser(username, password);

            console.log("Login response:", data); 

            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="text-center mb-8">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Secure API Governance
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Sign in to access your dashboard
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    {/* Username */}

                    <div className="mb-5">

                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />

                    </div>

                    {/* Password */}

                    <div className="mb-6">

                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-gray-900"
                            required
                        />

                    </div>

                    {/* Sign In Button */}

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3 rounded-lg
                                   font-medium hover:bg-gray-800 transition"
                    >
                        Sign In
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;