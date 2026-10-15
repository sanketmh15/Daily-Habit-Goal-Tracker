import { useEffect, useState } from "react";
import "./Home.css";

function Home({ habits = [], goals = [] }) {
    const [userName, setUserName] = useState(
        () => localStorage.getItem("habitTrackerUserName") || ""
    );

    const [nameInput, setNameInput] = useState(userName);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const hour = now.getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 17
                ? "Good afternoon"
                : "Good evening";

    const dateText = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const totalHabits = habits.length;

    const completedHabits = habits.filter(
        habit => Number(habit.completed) === 1
    ).length;

    const pendingHabits = totalHabits - completedHabits;

    const totalGoals = goals.length;

    const completedGoals = goals.filter(
        goal => Number(goal.completed) === 1
    ).length;

    const habitProgress = totalHabits
        ? Math.round((completedHabits / totalHabits) * 100)
        : 0;

    const goalProgress = totalGoals
        ? Math.round((completedGoals / totalGoals) * 100)
        : 0;

    function saveName(event) {
        event.preventDefault();

        const cleanName = nameInput.trim();

        if (!cleanName) return;

        localStorage.setItem("habitTrackerUserName", cleanName);
        setUserName(cleanName);
    }

    function playGreeting() {
        if (!("speechSynthesis" in window)) {
            alert("Voice greetings are not supported by this browser.");
            return;
        }

        window.speechSynthesis.cancel();

        const message =
            `${greeting}${userName ? ", " + userName : ""}! ` +
            "Welcome back to your habit tracker. " +
            "Every small step counts. Let's make today meaningful.";

        const speech = new SpeechSynthesisUtterance(message);

        speech.lang = "en-IN";
        speech.rate = 0.95;

        window.speechSynthesis.speak(speech);
    }

    return (
        <div className="home-dashboard">

            <section className="welcome-panel">
                <div className="welcome-content">
                    <span className="welcome-label">
                        YOUR PERSONAL PRODUCTIVITY SPACE
                    </span>

                    <h1>
                        {greeting}
                        {userName ? `, ${userName}` : ""}! 👋
                    </h1>

                    <p className="welcome-description">
                        Small steps every day lead to remarkable results.
                        Let's make today count.
                    </p>

                    <p className="welcome-date">
                        📅 {dateText}
                    </p>

                    <button
                        className="voice-button"
                        onClick={playGreeting}
                        type="button"
                    >
                        🔊 Hear your greeting
                    </button>
                </div>

                <div
                    className="welcome-illustration"
                    aria-hidden="true"
                >
                    <div className="illustration-circle">
                        <span>🌱</span>
                    </div>

                    <span className="floating-star star-one">✦</span>
                    <span className="floating-star star-two">✧</span>
                </div>
            </section>

            {!userName && (
                <section className="name-panel">
                    <h2>Let's personalize your experience</h2>

                    <p>What should we call you?</p>

                    <form
                        className="name-form"
                        onSubmit={saveName}
                    >
                        <label htmlFor="habit-user-name">
                            Your name
                        </label>

                        <input
                            id="habit-user-name"
                            type="text"
                            placeholder="Enter your name"
                            value={nameInput}
                            onChange={event =>
                                setNameInput(event.target.value)
                            }
                            maxLength={40}
                            required
                        />

                        <button type="submit">
                            Save my name
                        </button>
                    </form>
                </section>
            )}

            <section className="dashboard-heading">
                <span className="section-eyebrow">
                    YOUR JOURNEY
                </span>

                <h2>Your daily overview</h2>

                <p>Your statistics update using your saved data.</p>
            </section>

            <section className="dashboard-grid">

                <article className="dashboard-card">
                    <div className="dashboard-card-icon purple-icon">
                        📋
                    </div>

                    <div>
                        <p className="dashboard-card-label">
                            Total Habits
                        </p>

                        <h3>{totalHabits}</h3>

                        <p className="dashboard-card-description">
                            Habits in your tracker
                        </p>
                    </div>
                </article>

                <article className="dashboard-card">
                    <div className="dashboard-card-icon green-icon">
                        ✅
                    </div>

                    <div>
                        <p className="dashboard-card-label">
                            Completed Habits
                        </p>

                        <h3>{completedHabits}/{totalHabits}</h3>

                        <p className="dashboard-card-description">
                            {pendingHabits} pending
                        </p>
                    </div>
                </article>

                <article className="dashboard-card">
                    <div className="dashboard-card-icon orange-icon">
                        🎯
                    </div>

                    <div>
                        <p className="dashboard-card-label">
                            Completed Goals
                        </p>

                        <h3>{completedGoals}/{totalGoals}</h3>

                        <p className="dashboard-card-description">
                            {totalGoals - completedGoals} remaining
                        </p>
                    </div>
                </article>

                <article className="dashboard-card">
                    <div className="dashboard-card-icon purple-icon">
                        📊
                    </div>

                    <div>
                        <p className="dashboard-card-label">
                            Habit Completion
                        </p>

                        <h3>{habitProgress}%</h3>

                        <div
                            className="progress-bar"
                            role="progressbar"
                            aria-valuenow={habitProgress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Habit completion"
                        >
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${habitProgress}%`
                                }}
                            />
                        </div>

                        <p className="dashboard-card-description">
                            Based on saved completion statuses
                        </p>
                    </div>
                </article>

            </section>

            <section className="motivation-panel">
                <div className="motivation-icon">🌱</div>

                <div>
                    <span className="section-eyebrow">
                        YOUR PROGRESS
                    </span>

                    <h2>
                        {totalHabits === 0
                            ? "Start with one small habit."
                            : habitProgress === 100
                                ? "Amazing! All habits are complete."
                                : "Every small step matters."}
                    </h2>

                    <p>
                        {totalHabits === 0
                            ? "Visit Habits and create your first habit."
                            : `${completedHabits} of ${totalHabits} habits marked complete.`}
                    </p>
                </div>
            </section>

            <section className="motivation-panel">
                <div className="motivation-icon">🏆</div>

                <div>
                    <span className="section-eyebrow">
                        YOUR GOALS
                    </span>

                    <h2>
                        {totalGoals === 0
                            ? "Give your ambitions a direction."
                            : goalProgress === 100
                                ? "Congratulations on completing your goals!"
                                : "Keep working towards your goals."}
                    </h2>

                    <p>
                        {completedGoals} of {totalGoals} goals completed
                        ({goalProgress}%).
                    </p>
                </div>
            </section>

            <section className="motivation-panel">
                <div className="motivation-icon">💜</div>

                <div>
                    <span className="section-eyebrow">
                        A LITTLE REMINDER
                    </span>

                    <h2>Progress over perfection.</h2>

                    <p>
                        You don't have to change everything today.
                        Just take one small step in the right direction.
                    </p>
                </div>
            </section>

        </div>
    );
}

export default Home;