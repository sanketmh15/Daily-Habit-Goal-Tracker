function HabitCard({ habit, onComplete, onDelete }) {

    return (
        <article className="habit-card">

            <h3>
                {habit.name}
            </h3>

            <p>
                {habit.description}
            </p>

            <p>
                Status:{" "}
                {habit.completed
                    ? "Completed ✅"
                    : "Pending ⏳"}
            </p>

            <button
                onClick={() =>
                    onComplete(habit.id)
                }
            >
                {habit.completed
                    ? "↩️ Undo"
                    : "✅ Complete"}
            </button>

            <button
                onClick={() =>
                    onDelete(habit.id)
                }
            >
                🗑️ Delete
            </button>

        </article>
    );
}

export default HabitCard;