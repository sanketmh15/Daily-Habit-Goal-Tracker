import { useState, useEffect, useCallback } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Header from "./components/Header";

import Home from "./pages/Home";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import Calendar from "./pages/Calendar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

const API_URL = "http://localhost:3000/api";


function AppContent() {
    const navigate = useNavigate();

    // =========================================
    // AUTHENTICATION
    // =========================================

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    const [habits, setHabits] = useState([]);
    const [goals, setGoals] = useState([]);

    const [newHabit, setNewHabit] = useState("");
    const [newHabitDescription, setNewHabitDescription] = useState("");
    const [newGoal, setNewGoal] = useState("");

    // =========================================
    // LOGIN
    // =========================================

    function handleLogin(newToken, newUser) {
        localStorage.setItem("token", newToken);

        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }

        setToken(newToken);
        setUser(newUser);
        setHabits([]);
        setGoals([]);
    }

    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
        setHabits([]);
        setGoals([]);

        navigate("/login", { replace: true });
    }, [navigate]);

    // =========================================
    // API REQUEST HELPER
    // =========================================

    const apiRequest = useCallback(async (path, options = {}) => {
        if (!token) {
            throw new Error("Please log in to continue.");
        }

        const response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
            handleLogout();
            throw new Error(
                "Your login session has expired. Please log in again."
            );
        }

        return { response, data };
    }, [token, handleLogout]);

    // =========================================
    // LOAD HABITS AND GOALS
    // =========================================

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        async function loadData() {
            try {
                const [habitsResult, goalsResult] = await Promise.all([
                    apiRequest("/habits"),
                    apiRequest("/goals")
                ]);

                if (cancelled) return;

                if (!habitsResult.response.ok) {
                    throw new Error("Failed to load habits.");
                }

                if (!goalsResult.response.ok) {
                    throw new Error("Failed to load goals.");
                }

                setHabits(habitsResult.data.habits || []);
                setGoals(goalsResult.data.goals || []);
            } catch (error) {
                if (!cancelled) {
                    console.error("Loading data failed:", error);

                    if (!error.message.includes("session has expired")) {
                        alert(error.message || "Unable to load your data.");
                    }
                }
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, [token, apiRequest]);

    // =========================================
    // ADD HABIT
    // =========================================

    async function addHabit(event) {
        event.preventDefault();

        const name = newHabit.trim();
        const description = newHabitDescription.trim();

        if (!name) {
            alert("Please enter a habit name.");
            return;
        }

        try {
            const { response, data } = await apiRequest("/habits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    description: description || "No description"
                })
            });

            if (!response.ok || !data.success) {
                alert(data.message || "Unable to add habit.");
                return;
            }

            setHabits(current => [
                {
                    id: data.habitId,
                    name,
                    description: description || "No description",
                    completed: 0
                },
                ...current
            ]);

            setNewHabit("");
            setNewHabitDescription("");

            alert("Habit saved successfully!");
        } catch (error) {
            console.error("Add habit error:", error);

            if (!error.message.includes("session has expired")) {
                alert(error.message || "Unable to connect to the server.");
            }
        }
    }

    // =========================================
    // COMPLETE / UNDO HABIT
    // =========================================

    async function completeHabit(id) {
        const habit = habits.find(item => item.id === id);

        if (!habit) return;

        const newStatus = !habit.completed;

        try {
            const { response, data } = await apiRequest(`/habits/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: newStatus
                })
            });

            if (!response.ok || !data.success) {
                alert(data.message || "Unable to update habit.");
                return;
            }

            setHabits(current =>
                current.map(item =>
                    item.id === id
                        ? { ...item, completed: newStatus ? 1 : 0 }
                        : item
                )
            );
        } catch (error) {
            console.error("Complete habit error:", error);

            if (!error.message.includes("session has expired")) {
                alert(error.message || "Unable to update habit.");
            }
        }
    }

    // =========================================
    // DELETE HABIT
    // =========================================

    async function deleteHabit(id) {
        if (!window.confirm("Are you sure you want to delete this habit?")) {
            return;
        }

        try {
            const { response, data } = await apiRequest(`/habits/${id}`, {
                method: "DELETE"
            });

            if (!response.ok || !data.success) {
                alert(data.message || "Unable to delete habit.");
                return;
            }

            setHabits(current =>
                current.filter(item => item.id !== id)
            );
        } catch (error) {
            console.error("Delete habit error:", error);

            if (!error.message.includes("session has expired")) {
                alert(error.message || "Unable to delete habit.");
            }
        }
    }

    // =========================================
    // ADD GOAL
    // =========================================

    async function addGoal(event) {
        event.preventDefault();

        const name = newGoal.trim();

        if (!name) {
            alert("Please enter a goal.");
            return;
        }

        try {
            const { response, data } = await apiRequest("/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name })
            });

            if (!response.ok || !data.success) {
                alert(data.message || "Unable to add goal.");
                return;
            }

            setGoals(current => [
                {
                    id: data.goalId,
                    name,
                    completed: 0
                },
                ...current
            ]);

            setNewGoal("");

            alert("Goal saved successfully!");
        } catch (error) {
            console.error("Add goal error:", error);

            if (!error.message.includes("session has expired")) {
                alert(error.message || "Unable to connect to the server.");
            }
        }
    }

    // =========================================
    // COMPLETE / UNDO GOAL
    // =========================================

    async function completeGoal(id) {
        const goal = goals.find(item => item.id === id);

        if (!goal) return;

        const newStatus = !goal.completed;

        try {
            const { response, data } = await apiRequest(`/goals/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: newStatus
                })
            });

            if (!response.ok || !data.success) {
                alert(data.message || "Unable to update goal.");
                return;
            }

            setGoals(current =>
                current.map(item =>
                    item.id === id
                        ? { ...item, completed: newStatus ? 1 : 0 }
                        : item
                )
            );
        } catch (error) {
            console.error("Complete goal error:", error);

            if (!error.message.includes("session has expired")) {
                alert(error.message || "Unable to update goal.");
            }
        }
    }

    // =========================================
    // DELETE GOAL
    // =========================================

    async function deleteGoal(id) {
        if (!window.confirm("Are you sure you want to delete this goal?")) {
            return;
        }

        try {
            const { response, data } = await apiRequest(`/goals/${id}`, {
                method: "DELETE"
            });

            if (!response.ok || !data.success) {
                alert(data.message || "Unable to delete goal.");
                return;
            }

            setGoals(current =>
                current.filter(item => item.id !== id)
            );
        } catch (error) {
            console.error("Delete goal error:", error);

            if (!error.message.includes("session has expired")) {
                alert(error.message || "Unable to delete goal.");
            }
        }
    }

    // =========================================
    // ROUTES
    // =========================================

    return (
        <>
            {token && (
                <Header
                    onLogout={handleLogout}
                    user={user}
                />
            )}

            <main>
                <Routes>
                    {/* LOGIN */}
                    <Route
                        path="/login"
                        element={
                            token
                                ? <Navigate to="/" replace />
                                : <Login onLogin={handleLogin} />
                        }
                    />

                    {/* SIGNUP */}
                    <Route
                        path="/signup"
                        element={
                            token
                                ? <Navigate to="/" replace />
                                : <Signup />
                        }
                    />

                    {/* HOME */}
                    <Route
                        path="/"
                        element={
                            token
                                ? <Home />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* HABITS */}
                    <Route
                        path="/habits"
                        element={
                            token ? (
                                <Habits
                                    habits={habits}
                                    newHabit={newHabit}
                                    setNewHabit={setNewHabit}
                                    newHabitDescription={newHabitDescription}
                                    setNewHabitDescription={setNewHabitDescription}
                                    addHabit={addHabit}
                                    completeHabit={completeHabit}
                                    deleteHabit={deleteHabit}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* GOALS */}
                    <Route
                        path="/goals"
                        element={
                            token ? (
                                <Goals
                                    goals={goals}
                                    newGoal={newGoal}
                                    setNewGoal={setNewGoal}
                                    addGoal={addGoal}
                                    completeGoal={completeGoal}
                                    deleteGoal={deleteGoal}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* PROGRESS */}
                    <Route
                        path="/progress"
                        element={
                            token ? (
                                <Progress
                                    habits={habits}
                                    goals={goals}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* CALENDAR */}
                    <Route
                        path="/calendar"
                        element={
                            token ? (
                                <Calendar
                                    habits={habits}
                                    token={token}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* UNKNOWN URL */}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={token ? "/" : "/login"}
                                replace
                            />
                        }
                    />
                </Routes>
            </main>
        </>
    );
}


function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;