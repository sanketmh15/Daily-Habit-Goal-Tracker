function Progress({
    habits,
    goals
}) {

    const completedHabits =
        habits.filter(
            function (habit) {

                return habit.completed;

            }
        ).length;


    const completedGoals =
        goals.filter(
            function (goal) {

                return goal.completed;

            }
        ).length;


    const habitProgress =

        habits.length === 0

            ? 0

            : Math.round(

                (
                    completedHabits /
                    habits.length
                ) * 100

            );


    const goalProgress =

        goals.length === 0

            ? 0

            : Math.round(

                (
                    completedGoals /
                    goals.length
                ) * 100

            );


    return (

        <>

            <section>

                <h2>
                    Habit Progress
                </h2>


                <p>

                    {completedHabits}

                    {" / "}

                    {habits.length}

                    {" habits completed"}

                </p>


                <div
                    className="progress-bar"
                >

                    <div

                        className="progress-fill"

                        style={{
                            width:
                                habitProgress +
                                "%"
                        }}

                    />

                </div>


                <h3>
                    {habitProgress}%
                </h3>

            </section>


            <section>

                <h2>
                    Goal Progress
                </h2>


                <p>

                    {completedGoals}

                    {" / "}

                    {goals.length}

                    {" goals completed"}

                </p>


                <div
                    className="progress-bar"
                >

                    <div

                        className="progress-fill"

                        style={{
                            width:
                                goalProgress +
                                "%"
                        }}

                    />

                </div>


                <h3>
                    {goalProgress}%
                </h3>

            </section>

        </>

    );

}


export default Progress;