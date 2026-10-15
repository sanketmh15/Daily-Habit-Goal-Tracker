import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to create your account."
                );
            }

            setSuccess("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1200);

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
                <p className="auth-eyebrow">START YOUR JOURNEY</p>

                <h2>Create Your Account</h2>

                <p className="auth-description">
                    Build better habits and track your goals every day.
                </p>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success" role="status">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="signup-name">Full name</label>

                    <input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                        maxLength={100}
                        required
                    />

                    <label htmlFor="signup-email">Email address</label>

                    <input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="signup-password">Password</label>

                    <input
                        id="signup-password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <label htmlFor="signup-confirm-password">
                        Confirm password
                    </label>

                    <input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Enter your password again"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </section>
    );
}

export default Signup;