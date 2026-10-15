import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header({ onLogout, user }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme(previousTheme =>
            previousTheme === "dark" ? "light" : "dark"
        );
    }

    return (
        <header>
            <h1>Daily Habits &amp; Goal Tracker</h1>

            {user?.name && (
                <p className="welcome-user">
                    Welcome, {user.name}!
                </p>
            )}

            <nav>
                <Link to="/">Home</Link>

                <Link to="/habits">Habits</Link>

                <Link to="/goals">Goals</Link>

                <Link to="/progress">Progress</Link>

                <Link to="/calendar">Calendar</Link>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="theme-toggle"
                    aria-label="Toggle dark mode"
                >
                    {theme === "dark"
                        ? "☀️ Light Mode"
                        : "🌙 Dark Mode"}
                </button>

                <button
                    type="button"
                    onClick={onLogout}
                    className="logout-button"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default Header;