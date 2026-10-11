import GoalCard from "../components/GoalCard";


function Goals({
    goals,
    newGoal,
    setNewGoal,
    addGoal,
    completeGoal,
    deleteGoal
}) {

    return (

        <>

            <section>

                <h2>
                    Add New Goal
                </h2>


                <form
                    onSubmit={addGoal}
                >

                    <input

                        type="text"

                        placeholder="Enter goal"

                        value={newGoal}

                        onChange={(event) =>
                            setNewGoal(
                                event.target.value
                            )
                        }

                    />


                    <button type="submit">

                        Add Goal

                    </button>

                </form>

            </section>


            <section>

                <h2>
                    My Goals
                </h2>


                {goals.length === 0 ? (

                    <p>
                        No goals available.
                    </p>

                ) : (

                    goals.map(
                        function (goal) {

                            return (

                                <GoalCard

                                    key={goal.id}

                                    goal={goal}

                                    onComplete={
                                        completeGoal
                                    }

                                    onDelete={
                                        deleteGoal
                                    }

                                />

                            );

                        }
                    )

                )}

            </section>

        </>

    );

}


export default Goals;