import { useState, useEffect } from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Header from "./components/Header";

import Home from "./pages/Home";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import Calendar from "./pages/Calendar";


const API_URL = "http://localhost:3000/api";


function App() {

    // ==================================================
    // HABITS
    // ==================================================

    const [habits, setHabits] = useState([]);

    const [newHabit, setNewHabit] = useState("");
    const [newHabitDescription, setNewHabitDescription] = useState("");


    // =========================
    // LOAD HABITS FROM API
    // =========================

    useEffect(function () {

        fetch(`${API_URL}/habits`)

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch habits."
                    );

                }

                return response.json();

            })

            .then(function (data) {

                setHabits(data.habits);

            })

            .catch(function (error) {

                console.error(error);

                alert(
                    "Unable to load habits from the server."
                );

            });

    }, []);


    // =========================
    // ADD HABIT
    // =========================
async function addHabit(event) {
    event.preventDefault();

    const name = newHabit.trim();
    const description = newHabitDescription.trim();

    if (!name) {
        alert("Please enter a habit name.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/habits`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                description: description || "No description"
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || "Unable to add habit.");
            return;
        }

        const newHabitObject = {
            id: data.habitId,
            name: name,
            description: description || "No description",
            completed: 0
        };

        setHabits(currentHabits => [
            newHabitObject,
            ...currentHabits
        ]);

        setNewHabit("");
        setNewHabitDescription("");

        alert("Habit saved successfully!");

    } catch (error) {
        console.error("Add habit error:", error);
        alert("Unable to connect to the server.");
    }
}

    // =========================
    // COMPLETE / UNDO HABIT
    // =========================

    function completeHabit(id) {

        const habit = habits.find(
            function (item) {

                return item.id === id;

            }
        );


        if (!habit) {

            return;

        }


        const newStatus =
            habit.completed ? false : true;


        fetch(`${API_URL}/habits/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                completed: newStatus

            })

        })

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                if (!data.success) {

                    alert(data.message);

                    return;

                }


                setHabits(function (currentHabits) {

                    return currentHabits.map(
                        function (item) {

                            if (item.id === id) {

                                return {

                                    ...item,

                                    completed:
                                        newStatus ? 1 : 0

                                };

                            }


                            return item;

                        }
                    );

                });

            })

            .catch(function (error) {

                console.error(error);

                alert(
                    "Unable to update habit."
                );

            });

    }


    // =========================
    // DELETE HABIT
    // =========================

    function deleteHabit(id) {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this habit?"
            );


        if (!confirmDelete) {

            return;

        }


        fetch(`${API_URL}/habits/${id}`, {

            method: "DELETE"

        })

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                if (!data.success) {

                    alert(data.message);

                    return;

                }


                setHabits(function (currentHabits) {

                    return currentHabits.filter(
                        function (item) {

                            return item.id !== id;

                        }
                    );

                });

            })

            .catch(function (error) {

                console.error(error);

                alert(
                    "Unable to delete habit."
                );

            });

    }


  // ==================================================
// GOALS
// ==================================================

const [goals, setGoals] = useState([]);

const [newGoal, setNewGoal] = useState("");


// =========================
// LOAD GOALS FROM API
// =========================

useEffect(function () {

    fetch(`${API_URL}/goals`)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch goals."
                );

            }

            return response.json();

        })

        .then(function (data) {

            setGoals(data.goals);

        })

        .catch(function (error) {

            console.error(error);

            alert(
                "Unable to load goals from the server."
            );

        });

}, []);


// =========================
// ADD GOAL
// =========================
async function addGoal(event) {
    event.preventDefault();

    const name = newGoal.trim();

    if (!name) {
        alert("Please enter a goal.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/goals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || "Unable to add goal.");
            return;
        }

        // Add the goal to React only after the server confirms success.
        setGoals(currentGoals => [
            {
                id: data.goalId,
                name: name,
                completed: 0
            },
            ...currentGoals
        ]);

        setNewGoal("");
        alert("Goal saved successfully!");

    } catch (error) {
        console.error("Add goal error:", error);
        alert("Unable to connect to the server.");
    }
}

// =========================
// COMPLETE / UNDO GOAL
// =========================

function completeGoal(id) {

    const goal = goals.find(
        function (item) {

            return item.id === id;

        }
    );


    if (!goal) {

        return;

    }


    const newStatus =
        goal.completed ? false : true;


    fetch(`${API_URL}/goals/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            completed: newStatus

        })

    })

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            if (!data.success) {

                alert(data.message);

                return;

            }


            setGoals(function (currentGoals) {

                return currentGoals.map(
                    function (item) {

                        if (item.id === id) {

                            return {

                                ...item,

                                completed:
                                    newStatus ? 1 : 0

                            };

                        }


                        return item;

                    }
                );

            });

        })

        .catch(function (error) {

            console.error(error);

            alert(
                "Unable to update goal."
            );

        });

}


// =========================
// DELETE GOAL
// =========================

function deleteGoal(id) {

    const confirmDelete =
        window.confirm(
            "Are you sure you want to delete this goal?"
        );


    if (!confirmDelete) {

        return;

    }


    fetch(`${API_URL}/goals/${id}`, {

        method: "DELETE"

    })

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            if (!data.success) {

                alert(data.message);

                return;

            }


            setGoals(function (currentGoals) {

                return currentGoals.filter(
                    function (item) {

                        return item.id !== id;

                    }
                );

            });

        })

        .catch(function (error) {

            console.error(error);

            alert(
                "Unable to delete goal."
            );

        });

}
    return (

        <BrowserRouter>

            <Header />


            <main>

                <Routes>

                    {/* HOME */}

                    <Route
                        path="/"
                        element={
                            <Home />
                        }
                    />


                    {/* HABITS */}

                    <Route
                        path="/habits"
                        element={

                            <Habits

                                habits={habits}

                                newHabit={newHabit}

                                setNewHabit={
                                    setNewHabit
                                }
                                newHabitDescription={newHabitDescription}
setNewHabitDescription={setNewHabitDescription}

                                addHabit={addHabit}

                                completeHabit={
                                    completeHabit
                                }

                                deleteHabit={
                                    deleteHabit
                                }

                            />

                        }
                    />


                    {/* GOALS */}

                    <Route
                        path="/goals"
                        element={

                            <Goals

                                goals={goals}

                                newGoal={newGoal}

                                setNewGoal={
                                    setNewGoal
                                }

                                addGoal={addGoal}

                                completeGoal={
                                    completeGoal
                                }

                                deleteGoal={
                                    deleteGoal
                                }

                            />

                        }
                    />


                    {/* PROGRESS */}

                    <Route
                        path="/progress"
                        element={

                            <Progress

                                habits={habits}

                                goals={goals}

                            />

                        }
                    />

                    {/* CALENDAR */}

                    <Route
                        path="/calendar"
                        element={
                            <Calendar habits={habits} />
                        }
                    />

                </Routes>

            </main>

        </BrowserRouter>

    );

}


export default App;