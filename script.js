// ==========================================
// DAILY HABIT & GOAL TRACKER
// LocalStorage Version
// ==========================================


// ==========================================
// Load habits from LocalStorage
// ==========================================

let habits =
    JSON.parse(localStorage.getItem("habits")) || [

        {
            id: Date.now() + 1,
            name: "Exercise",
            description: "30 minutes of exercise",
            completed: false
        },

        {
            id: Date.now() + 2,
            name: "Study",
            description: "Study for 2 hours",
            completed: false
        },

        {
            id: Date.now() + 3,
            name: "Drink Water",
            description: "Drink enough water",
            completed: false
        },

        {
            id: Date.now() + 4,
            name: "Read",
            description: "Read for 20 minutes",
            completed: false
        }

    ];


// ==========================================
// Save habits
// ==========================================

function saveHabits() {

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );

}


// ==========================================
// Display Habits
// ==========================================

function displayHabits() {

    const container =
        document.getElementById("habitContainer");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (habits.length === 0) {

        container.innerHTML = `
            <p>No habits available.</p>
        `;

        updateProgress();

        return;
    }


    habits.forEach(function (habit) {

        const card =
            document.createElement("article");


        card.className = "habit-card";


        card.innerHTML = `

            <h3>${habit.name}</h3>

            <p>${habit.description}</p>

            <button
                onclick="completeHabit(${habit.id})">

                ${
                    habit.completed
                    ? "↩️ Undo"
                    : "✅ Complete"
                }

            </button>

            <button
                class="delete-button"
                onclick="deleteHabit(${habit.id})">

                🗑️ Delete

            </button>

        `;


        container.appendChild(card);

    });


    updateProgress();

}


// ==========================================
// Complete / Undo Habit
// ==========================================

function completeHabit(id) {

    const habit =
        habits.find(function (item) {

            return item.id === id;

        });


    if (!habit) {
        return;
    }


    habit.completed =
        !habit.completed;


    saveHabits();

    displayHabits();

}


// ==========================================
// Delete Habit
// ==========================================

function deleteHabit(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this habit?"
        );


    if (!confirmation) {
        return;
    }


    habits =
        habits.filter(function (habit) {

            return habit.id !== id;

        });


    saveHabits();

    displayHabits();

}


// ==========================================
// Calculate Progress
// ==========================================

function calculateProgress() {

    if (habits.length === 0) {

        return 0;

    }


    const completedHabits =
        habits.filter(function (habit) {

            return habit.completed;

        });


    const percentage =
        (completedHabits.length /
            habits.length) * 100;


    return Math.round(percentage);

}


// ==========================================
// Update Progress
// ==========================================

function updateProgress() {

    const progress =
        calculateProgress();


    const progressFill =
        document.querySelector(
            ".progress-fill"
        );


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }


    if (progressText) {

        progressText.textContent =
            progress + "% Completed";

    }

}


// ==========================================
// Add Habit
// ==========================================

const habitForm =
    document.getElementById("habitForm");


if (habitForm) {

    habitForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const input =
                document.getElementById(
                    "habitName"
                );


            const habitName =
                input.value.trim();


            // Validation

            if (habitName === "") {

                alert(
                    "Please enter a habit name."
                );

                input.focus();

                return;

            }


            // Check duplicate habit

            const duplicate =
                habits.some(function (habit) {

                    return habit.name.toLowerCase()
                        === habitName.toLowerCase();

                });


            if (duplicate) {

                alert(
                    "This habit already exists."
                );

                return;

            }


            // Create new habit

            const newHabit = {

                id: Date.now(),

                name: habitName,

                description:
                    "New daily habit",

                completed: false

            };


            habits.push(newHabit);


            saveHabits();


            alert(
                "Habit added successfully!"
            );


            input.value = "";


            window.location.href =
                "habits.html";

        }
    );

}


// ==========================================
// Welcome Voice
// ==========================================

function welcomeUser() {

    const message =
        "Welcome to your Daily Habits and Goal Tracker. Let's make today productive and achieve our goals.";


    const speech =
        new SpeechSynthesisUtterance(
            message
        );


    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;


    speechSynthesis.speak(speech);

}


// ==========================================
// Page Load
// ==========================================

displayHabits();

updateProgress();

// ===============================
// GOALS FUNCTIONALITY
// ===============================

let goals =
    JSON.parse(localStorage.getItem("goals")) || [
        {
            id: Date.now() + 1,
            name: "Complete Web Development Project",
            completed: false
        },
        {
            id: Date.now() + 2,
            name: "Learn JavaScript",
            completed: false
        },
        {
            id: Date.now() + 3,
            name: "Improve Daily Routine",
            completed: false
        }
    ];


// Save goals to LocalStorage
function saveGoals() {

    localStorage.setItem(
        "goals",
        JSON.stringify(goals)
    );

}


// Display goals
function displayGoals() {

    const container =
        document.getElementById("goalContainer");

    if (!container) return;

    container.innerHTML = "";


    // If there are no goals
    if (goals.length === 0) {

        container.innerHTML =
            "<p>No goals available.</p>";

        updateGoalProgress();

        return;
    }


    // Display every goal
    goals.forEach(function (goal) {

        const card =
            document.createElement("article");

        card.className = "habit-card";


        card.innerHTML = `
            <h3>${goal.name}</h3>

            <p>
                Status:
                ${goal.completed ? "Completed ✅" : "Pending ⏳"}
            </p>

            <button onclick="completeGoal(${goal.id})">
                ${goal.completed ? "↩️ Undo" : "✅ Complete"}
            </button>

            <button
                class="delete-button"
                onclick="deleteGoal(${goal.id})">
                🗑️ Delete
            </button>
        `;


        container.appendChild(card);

    });


    updateGoalProgress();

}


// Complete / Undo goal
function completeGoal(id) {

    const goal =
        goals.find(function (item) {

            return item.id === id;

        });


    if (!goal) return;


    goal.completed =
        !goal.completed;


    saveGoals();

    displayGoals();

}


// Delete goal
function deleteGoal(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this goal?"
        );


    if (!confirmation) return;


    goals =
        goals.filter(function (goal) {

            return goal.id !== id;

        });


    saveGoals();

    displayGoals();

}


// Calculate goal progress
function calculateGoalProgress() {

    if (goals.length === 0) {

        return 0;

    }


    const completedGoals =
        goals.filter(function (goal) {

            return goal.completed;

        });


    const percentage =
        (completedGoals.length / goals.length) * 100;


    return Math.round(percentage);

}


// Update goal progress
function updateGoalProgress() {

    const progress =
        calculateGoalProgress();


    const progressFill =
        document.getElementById(
            "goalProgressFill"
        );


    const progressText =
        document.getElementById(
            "goalProgressText"
        );


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }


    if (progressText) {

        progressText.textContent =
            progress + "% Completed";

    }

}


// Goal form validation
const goalForm =
    document.getElementById("goalForm");


if (goalForm) {

    goalForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const input =
                document.getElementById("goalName");


            const goalName =
                input.value.trim();


            // Empty validation
            if (goalName === "") {

                alert(
                    "Please enter a goal."
                );

                input.focus();

                return;

            }


            // Duplicate validation
            const duplicate =
                goals.some(function (goal) {

                    return goal.name.toLowerCase() ===
                        goalName.toLowerCase();

                });


            if (duplicate) {

                alert(
                    "This goal already exists."
                );

                return;

            }


            // Create new goal
            const newGoal = {

                id: Date.now(),

                name: goalName,

                completed: false

            };


            goals.push(newGoal);


            // Save
            saveGoals();


            alert(
                "Goal added successfully!"
            );


            input.value = "";


            // Refresh goal list
            displayGoals();

        }
    );

}


// Display goals when page loads
displayGoals();

updateGoalProgress();

// ===============================
// PROGRESS PAGE
// ===============================

function updateProgressPage() {

    // Get habits from LocalStorage

    const savedHabits =
        JSON.parse(localStorage.getItem("habits")) || [];


    // Get goals from LocalStorage

    const savedGoals =
        JSON.parse(localStorage.getItem("goals")) || [];


    // =========================
    // HABIT STATISTICS
    // =========================

    const totalHabits =
        savedHabits.length;


    const completedHabits =
        savedHabits.filter(function (habit) {

            return habit.completed;

        }).length;


    let habitPercentage = 0;


    if (totalHabits > 0) {

        habitPercentage =
            Math.round(
                (completedHabits / totalHabits) * 100
            );

    }


    // Display habit statistics

    const totalHabitsElement =
        document.getElementById("totalHabits");


    const completedHabitsElement =
        document.getElementById("completedHabits");


    const habitProgressFill =
        document.getElementById("habitProgressFill");


    const habitProgressText =
        document.getElementById("habitProgressText");


    if (totalHabitsElement) {

        totalHabitsElement.textContent =
            totalHabits;

    }


    if (completedHabitsElement) {

        completedHabitsElement.textContent =
            completedHabits;

    }


    if (habitProgressFill) {

        habitProgressFill.style.width =
            habitPercentage + "%";

    }


    if (habitProgressText) {

        habitProgressText.textContent =
            habitPercentage + "% Completed";

    }


    // =========================
    // GOAL STATISTICS
    // =========================

    const totalGoals =
        savedGoals.length;


    const completedGoals =
        savedGoals.filter(function (goal) {

            return goal.completed;

        }).length;


    let goalPercentage = 0;


    if (totalGoals > 0) {

        goalPercentage =
            Math.round(
                (completedGoals / totalGoals) * 100
            );

    }


    // Display goal statistics

    const totalGoalsElement =
        document.getElementById("totalGoals");


    const completedGoalsElement =
        document.getElementById("completedGoals");


    const goalProgressFill =
        document.getElementById("goalProgressFill");


    const goalProgressText =
        document.getElementById("goalProgressText");


    if (totalGoalsElement) {

        totalGoalsElement.textContent =
            totalGoals;

    }


    if (completedGoalsElement) {

        completedGoalsElement.textContent =
            completedGoals;

    }


    if (goalProgressFill) {

        goalProgressFill.style.width =
            goalPercentage + "%";

    }


    if (goalProgressText) {

        goalProgressText.textContent =
            goalPercentage + "% Completed";

    }


    // =========================
    // OVERALL PROGRESS
    // =========================

    const totalItems =
        totalHabits + totalGoals;


    const completedItems =
        completedHabits + completedGoals;


    let overallPercentage = 0;


    if (totalItems > 0) {

        overallPercentage =
            Math.round(
                (completedItems / totalItems) * 100
            );

    }


    const overallProgressText =
        document.getElementById(
            "overallProgressText"
        );


    if (overallProgressText) {

        overallProgressText.textContent =
            overallPercentage + "% Completed";

    }

}


// Run progress calculation

updateProgressPage();