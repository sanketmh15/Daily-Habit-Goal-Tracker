import HabitCard from "../components/HabitCard";

function Habits({
    habits,
    newHabit,
    setNewHabit,
    newHabitDescription,
    setNewHabitDescription,
    addHabit,
    completeHabit,
    deleteHabit
}) {
    return (
        <>
            <section>
                <h2>Add New Habit</h2>

                <form onSubmit={addHabit}>
                    <input
                        type="text"
                        placeholder="Enter habit name"
                        value={newHabit}
                        onChange={(event) =>
                            setNewHabit(event.target.value)
                        }
                    />

                    <textarea
                        placeholder="Enter habit description"
                        value={newHabitDescription}
                        onChange={(event) =>
                            setNewHabitDescription(event.target.value)
                        }
                    />

                    <button type="submit">
                        Add Habit
                    </button>
                </form>
            </section>

            <section>
                <h2>My Habits</h2>

                {habits.length === 0 ? (
                    <p>No habits available.</p>
                ) : (
                    habits.map(function (habit) {
                        return (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onComplete={completeHabit}
                                onDelete={deleteHabit}
                            />
                        );
                    })
                )}
            </section>
        </>
    );
}

export default Habits;