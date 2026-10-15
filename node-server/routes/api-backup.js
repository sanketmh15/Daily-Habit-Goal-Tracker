const express = require("express");

const router = express.Router();

const db = require("../config/database");


// ==================================================
// HABITS API
// ==================================================


// =========================
// GET ALL HABITS
// =========================

router.get(
    "/habits",
    function (req, res) {

        const sql = `
            SELECT
                id,
                name,
                description,
                completed,
                created_at
            FROM habits
            ORDER BY id DESC
        `;


        db.query(
            sql,
            function (error, results) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to fetch habits."

                    });

                }


                res.json({

                    success: true,

                    count: results.length,

                    habits: results

                });

            }
        );

    }
);


// =========================
// GET SINGLE HABIT
// =========================

router.get(
    "/habits/:id",
    function (req, res) {

        const id = parseInt(
            req.params.id
        );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid habit ID."

            });

        }


        const sql = `
            SELECT
                id,
                name,
                description,
                completed,
                created_at
            FROM habits
            WHERE id = ?
        `;


        db.query(
            sql,
            [id],
            function (error, results) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to fetch habit."

                    });

                }


                if (results.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Habit not found."

                    });

                }


                res.json({

                    success: true,

                    habit: results[0]

                });

            }
        );

    }
);


// =========================
// ADD NEW HABIT
// =========================

router.post(
    "/habits",
    function (req, res) {

        const name =
            String(
                req.body.name || ""
            ).trim();


        const description =
            String(
                req.body.description || ""
            ).trim();


        if (name === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Habit name is required."

            });

        }


        if (name.length < 3) {

            return res.status(400).json({

                success: false,

                message:
                    "Habit name must contain at least 3 characters."

            });

        }


        if (name.length > 100) {

            return res.status(400).json({

                success: false,

                message:
                    "Habit name cannot contain more than 100 characters."

            });

        }


        const sql = `
            INSERT INTO habits
            (name, description)
            VALUES (?, ?)
        `;


        db.query(
            sql,
            [name, description],
            function (error, result) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to add habit."

                    });

                }


                res.status(201).json({

                    success: true,

                    message:
                        "Habit added successfully.",

                    habitId:
                        result.insertId

                });

            }
        );

    }
);


// =========================
// UPDATE HABIT
// =========================

router.put(
    "/habits/:id",
    function (req, res) {

        const id = parseInt(
            req.params.id
        );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid habit ID."

            });

        }


        const completed =
            req.body.completed;


        if (
            completed !== 0 &&
            completed !== 1 &&
            completed !== true &&
            completed !== false
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Completed must be true or false."

            });

        }


        const newStatus =
            completed === true ||
            completed === 1
                ? 1
                : 0;


        const sql = `
            UPDATE habits
            SET completed = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [newStatus, id],
            function (error, result) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to update habit."

                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Habit not found."

                    });

                }


                res.json({

                    success: true,

                    message:
                        "Habit updated successfully."

                });

            }
        );

    }
);


// =========================
// DELETE HABIT
// =========================

router.delete(
    "/habits/:id",
    function (req, res) {

        const id = parseInt(
            req.params.id
        );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid habit ID."

            });

        }


        const sql = `
            DELETE FROM habits
            WHERE id = ?
        `;


        db.query(
            sql,
            [id],
            function (error, result) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to delete habit."

                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Habit not found."

                    });

                }


                res.json({

                    success: true,

                    message:
                        "Habit deleted successfully."

                });

            }
        );

    }
);


// ==================================================
// GOALS API
// ==================================================


// =========================
// GET ALL GOALS
// =========================

router.get(
    "/goals",
    function (req, res) {

        const sql = `
            SELECT
                id,
                name,
                completed,
                created_at
            FROM goals
            ORDER BY id DESC
        `;


        db.query(
            sql,
            function (error, results) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to fetch goals."

                    });

                }


                res.json({

                    success: true,

                    count: results.length,

                    goals: results

                });

            }
        );

    }
);


// =========================
// GET SINGLE GOAL
// =========================

router.get(
    "/goals/:id",
    function (req, res) {

        const id = parseInt(
            req.params.id
        );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid goal ID."

            });

        }


        const sql = `
            SELECT
                id,
                name,
                completed,
                created_at
            FROM goals
            WHERE id = ?
        `;


        db.query(
            sql,
            [id],
            function (error, results) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to fetch goal."

                    });

                }


                if (results.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Goal not found."

                    });

                }


                res.json({

                    success: true,

                    goal: results[0]

                });

            }
        );

    }
);


// =========================
// ADD NEW GOAL
// =========================

router.post(
    "/goals",
    function (req, res) {

        const name =
            String(
                req.body.name || ""
            ).trim();


        if (name === "") {

            return res.status(400).json({

                success: false,

                message:
                    "Goal name is required."

            });

        }


        if (name.length < 3) {

            return res.status(400).json({

                success: false,

                message:
                    "Goal must contain at least 3 characters."

            });

        }


        if (name.length > 150) {

            return res.status(400).json({

                success: false,

                message:
                    "Goal cannot contain more than 150 characters."

            });

        }


        const sql = `
            INSERT INTO goals
            (name)
            VALUES (?)
        `;


        db.query(
            sql,
            [name],
            function (error, result) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to add goal."

                    });

                }


                res.status(201).json({

                    success: true,

                    message:
                        "Goal added successfully.",

                    goalId:
                        result.insertId

                });

            }
        );

    }
);


// =========================
// UPDATE GOAL
// =========================

router.put(
    "/goals/:id",
    function (req, res) {

        const id = parseInt(
            req.params.id
        );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid goal ID."

            });

        }


        const completed =
            req.body.completed;


        if (
            completed !== 0 &&
            completed !== 1 &&
            completed !== true &&
            completed !== false
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Completed must be true or false."

            });

        }


        const newStatus =
            completed === true ||
            completed === 1
                ? 1
                : 0;


        const sql = `
            UPDATE goals
            SET completed = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [newStatus, id],
            function (error, result) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to update goal."

                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Goal not found."

                    });

                }


                res.json({

                    success: true,

                    message:
                        "Goal updated successfully."

                });

            }
        );

    }
);


// =========================
// DELETE GOAL
// =========================

router.delete(
    "/goals/:id",
    function (req, res) {

        const id = parseInt(
            req.params.id
        );


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid goal ID."

            });

        }


        const sql = `
            DELETE FROM goals
            WHERE id = ?
        `;


        db.query(
            sql,
            [id],
            function (error, result) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to delete goal."

                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Goal not found."

                    });

                }


                res.json({

                    success: true,

                    message:
                        "Goal deleted successfully."

                });

            }
        );

    }
);


module.exports = router;