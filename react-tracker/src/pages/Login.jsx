import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

function Login({ onLogin }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed. Please check your details."
                );
            }

            if (!data.token) {
                throw new Error("The server did not return a login token.");
            }

            onLogin(data.token, data.user || null);

            navigate("/", { replace: true });
        } catch (err) {
            setError(
                err.message || "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="auth-page">
            <div className="auth-card">
                <p className="auth-eyebrow">WELCOME BACK</p>

                <h2>Login to Your Tracker</h2>

                <p className="auth-description">
                    Continue building better habits, one day at a time.
                </p>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="login-email">
                        Email address
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="login-password">
                        Password
                    </label>

                    <input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/signup">Create one</Link>
                </p>
            </div>
        </section>
    );
}

export default Login;