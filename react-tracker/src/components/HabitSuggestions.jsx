import { useEffect, useState } from "react";


function HabitSuggestions() {

    // =========================
    // STATE
    // =========================

    const [suggestions, setSuggestions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================
    // FETCH JSON DATA
    // =========================

    useEffect(() => {

        fetch("/data/habits.json")

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load habit data."
                    );

                }

                return response.json();

            })

            .then(function (data) {

                setSuggestions(
                    data.habits
                );

                setLoading(false);

            })

            .catch(function (error) {

                console.error(error);

                setError(
                    "Unable to load habit suggestions."
                );

                setLoading(false);

            });

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <section>

                <h2>
                    Habit Suggestions
                </h2>

                <p>
                    Loading suggestions...
                </p>

            </section>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (

            <section>

                <h2>
                    Habit Suggestions
                </h2>

                <p>
                    {error}
                </p>

            </section>

        );

    }


    // =========================
    // DISPLAY DATA
    // =========================

    return (

        <section>

            <h2>
                Habit Suggestions
            </h2>


            {suggestions.map(
                function (habit) {

                    return (

                        <article
                            key={habit.id}
                            className="habit-card"
                        >

                            <h3>
                                {habit.name}
                            </h3>

                            <p>
                                {habit.description}
                            </p>

                        </article>

                    );

                }
            )}

        </section>

    );

}


export default HabitSuggestions;