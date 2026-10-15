import { useEffect, useState } from "react";
import "./Calendar.css";

const API_URL = "http://localhost:3000/api";

function Calendar({ habits, token }) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [completions, setCompletions] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const monthString =
        `${year}-${String(month + 1).padStart(2, "0")}`;

    const monthName = currentMonth.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });

    // =========================================
    // LOAD CALENDAR
    // =========================================

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        async function loadCalendar() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${API_URL}/calendar?month=${monthString}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Unable to load calendar."
                    );
                }

                if (!cancelled) {
                    setCompletions(data.completions || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCalendar();

        return () => {
            cancelled = true;
        };
    }, [monthString, token]);

    // =========================================
    // FORMAT DATE
    // =========================================

    function formatDate(day) {
        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");
    }

    // =========================================
    // CHECK COMPLETION
    // =========================================

    function isCompleted(habitId, date) {
        return completions.some(
            item =>
                Number(item.habit_id) === Number(habitId) &&
                String(item.completion_date).slice(0, 10) === date
        );
    }

    // =========================================
    // MARK / UNMARK COMPLETION
    // =========================================

    async function toggleCompletion(habitId, date) {
        const alreadyCompleted = isCompleted(habitId, date);

        try {
            setError("");

            const response = await fetch(
                alreadyCompleted
                    ? `${API_URL}/calendar/${habitId}/${date}`
                    : `${API_URL}/calendar`,
                {
                    method: alreadyCompleted ? "DELETE" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    ...(alreadyCompleted
                        ? {}
                        : {
                            body: JSON.stringify({
                                habitId: Number(habitId),
                                date
                            })
                        })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to update completion."
                );
            }

            if (alreadyCompleted) {
                setCompletions(previous =>
                    previous.filter(
                        item =>
                            !(
                                Number(item.habit_id) === Number(habitId) &&
                                String(item.completion_date).slice(0, 10) === date
                            )
                    )
                );
            } else {
                const habit = habits.find(
                    item => Number(item.id) === Number(habitId)
                );

                setCompletions(previous => [
                    ...previous,
                    {
                        habit_id: Number(habitId),
                        habit_name: habit?.name || "Habit",
                        completion_date: date
                    }
                ]);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // =========================================
    // CHANGE MONTH
    // =========================================

    function changeMonth(amount) {
        setCurrentMonth(
            new Date(year, month + amount, 1)
        );
    }

    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const totalCompletions = completions.length;

    return (
        <section className="calendar-page">
            <div className="calendar-heading">
                <div>
                    <p className="calendar-eyebrow">
                        YOUR CONSISTENCY
                    </p>

                    <h2>Habit Calendar 📅</h2>

                    <p>
                        Small steps every day lead to big results.
                    </p>
                </div>

                <div className="calendar-total">
                    <strong>{totalCompletions}</strong>
                    <span>Completions this month</span>
                </div>
            </div>

            <div className="calendar-toolbar">
                <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                >
                    ← Previous
                </button>

                <h3>{monthName}</h3>

                <button
                    type="button"
                    onClick={() => changeMonth(1)}
                >
                    Next →
                </button>
            </div>

            <div className="calendar-legend">
                <span>
                    <i className="legend-dot completed-dot"></i>
                    Completed
                </span>

                <span>
                    <i className="legend-dot today-dot"></i>
                    Today
                </span>
            </div>

            {error && (
                <div className="calendar-error">
                    {error}
                </div>
            )}

            {loading && (
                <p className="calendar-message">
                    Loading calendar...
                </p>
            )}

            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div
                        className="calendar-weekday"
                        key={day}
                    >
                        {day}
                    </div>
                ))}

                {Array.from(
                    { length: firstWeekday },
                    (_, index) => (
                        <div
                            className="calendar-empty"
                            key={`empty-${index}`}
                        />
                    )
                )}

                {Array.from(
                    { length: daysInMonth },
                    (_, index) => {
                        const day = index + 1;
                        const date = formatDate(day);

                        const dayCompletions = completions.filter(
                            item =>
                                String(item.completion_date).slice(0, 10) === date
                        );

                        const isToday = date === todayString;

                        return (
                            <div
                                key={date}
                                className={[
                                    "calendar-day",
                                    dayCompletions.length
                                        ? "has-completion"
                                        : "",
                                    isToday ? "is-today" : ""
                                ].filter(Boolean).join(" ")}
                            >
                                <span className="calendar-day-number">
                                    {day}
                                </span>

                                {dayCompletions.length > 0 && (
                                    <span className="calendar-day-count">
                                        ✓ {dayCompletions.length}
                                    </span>
                                )}

                                {dayCompletions.length > 0 && (
                                    <div className="calendar-day-names">
                                        {dayCompletions.map(item => (
                                            <span
                                                key={`${item.habit_id}-${date}`}
                                            >
                                                {item.habit_name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }
                )}
            </div>

            <div className="calendar-actions">
                <h3>Mark a Habit for a Date</h3>

                <p>
                    Select a habit and date to record its completion.
                </p>

                {habits.length === 0 ? (
                    <p>
                        Add a habit first from the Habits page.
                    </p>
                ) : (
                    <>
                        <label htmlFor="calendar-habit">
                            Choose habit
                        </label>

                        <select
                            id="calendar-habit"
                            value={selectedHabit}
                            onChange={event =>
                                setSelectedHabit(event.target.value)
                            }
                        >
                            <option value="">
                                Select a habit
                            </option>

                            {habits.map(habit => (
                                <option
                                    key={habit.id}
                                    value={habit.id}
                                >
                                    {habit.name}
                                </option>
                            ))}
                        </select>

                        <div className="calendar-date-list">
                            {Array.from(
                                { length: daysInMonth },
                                (_, index) => index + 1
                            ).map(day => {
                                const date = formatDate(day);

                                const checked =
                                    selectedHabit &&
                                    isCompleted(selectedHabit, date);

                                return (
                                    <button
                                        type="button"
                                        key={date}
                                        disabled={!selectedHabit}
                                        className={
                                            checked
                                                ? "calendar-date-button checked"
                                                : "calendar-date-button"
                                        }
                                        onClick={() =>
                                            toggleCompletion(
                                                selectedHabit,
                                                date
                                            )
                                        }
                                    >
                                        {day} {checked ? "✓" : ""}
                                    </button>
                                );
                            })}
                        </div>

                        <p className="calendar-help">
                            Click a date to mark the habit complete.
                            Click it again to undo.
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}

export default Calendar;