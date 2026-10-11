function GoalCard({
    goal,
    onComplete,
    onDelete
}) {

    return (

        <article className="habit-card">

            <h3>
                {goal.name}
            </h3>


            <p>

                Status:

                {" "}

                {goal.completed
                    ? "Completed ✅"
                    : "Pending ⏳"}

            </p>


            <button
                onClick={() =>
                    onComplete(goal.id)
                }
            >

                {goal.completed
                    ? "↩️ Undo"
                    : "✅ Complete"}

            </button>


            <button
                onClick={() =>
                    onDelete(goal.id)
                }
            >

                🗑️ Delete

            </button>

        </article>

    );

}


export default GoalCard;