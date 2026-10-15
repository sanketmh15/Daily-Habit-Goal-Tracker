const express = require("express");
const router = express.Router();
const db = require("../config/database");
const authenticateToken = require("../middleware/auth");

// All routes in this router require a valid login.
router.use(authenticateToken);

// Validate a positive integer ID.
function validId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Validate YYYY-MM-DD dates.
function validDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsed = new Date(`${date}T00:00:00Z`);

    return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date
    );
}

// ==================================================
// HABITS API
// ==================================================

// GET ALL HABITS
router.get("/habits", (req, res) => {
    db.query(
        `SELECT id, name, description, completed, created_at
         FROM habits
         WHERE user_id = ?
         ORDER BY id DESC`,
        [req.user.id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch habits."
                });
            }

            res.json({
                success: true,
                count: results.length,
                habits: results
            });
        }
    );
});

// GET SINGLE HABIT
router.get("/habits/:id", (req, res) => {
    const id = validId(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid habit ID."
        });
    }

    db.query(
        `SELECT id, name, description, completed, created_at
         FROM habits
         WHERE id = ? AND user_id = ?`,
        [id, req.user.id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch habit."
                });
            }

            if (!results.length) {
                return res.status(404).json({
                    success: false,
                    message: "Habit not found."
                });
            }

            res.json({
                success: true,
                habit: results[0]
            });
        }
    );
});

// ADD HABIT
router.post("/habits", (req, res) => {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();

    if (name.length < 3 || name.length > 100) {
        return res.status(400).json({
            success: false,
            message: "Habit name must contain 3 to 100 characters."
        });
    }

    db.query(
        `INSERT INTO habits (name, description, user_id)
         VALUES (?, ?, ?)`,
        [name, description, req.user.id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to add habit."
                });
            }

            res.status(201).json({
                success: true,
                message: "Habit added successfully.",
                habitId: result.insertId
            });
        }
    );
});

// UPDATE HABIT COMPLETION
router.put("/habits/:id", (req, res) => {
    const id = validId(req.params.id);
    const completed = req.body.completed;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid habit ID."
        });
    }

    if (![0, 1, true, false].includes(completed)) {
        return res.status(400).json({
            success: false,
            message: "Completed must be true or false."
        });
    }

    const status = completed === true || completed === 1 ? 1 : 0;

    db.query(
        `UPDATE habits
         SET completed = ?
         WHERE id = ? AND user_id = ?`,
        [status, id, req.user.id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update habit."
                });
            }

            if (!result.affectedRows) {
                return res.status(404).json({
                    success: false,
                    message: "Habit not found."
                });
            }

            res.json({
                success: true,
                message: "Habit updated successfully."
            });
        }
    );
});

// DELETE HABIT
router.delete("/habits/:id", (req, res) => {
    const id = validId(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid habit ID."
        });
    }

    db.query(
        `DELETE FROM habits
         WHERE id = ? AND user_id = ?`,
        [id, req.user.id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete habit."
                });
            }

            if (!result.affectedRows) {
                return res.status(404).json({
                    success: false,
                    message: "Habit not found."
                });
            }

            res.json({
                success: true,
                message: "Habit deleted successfully."
            });
        }
    );
});

// ==================================================
// GOALS API
// ==================================================

// GET ALL GOALS
router.get("/goals", (req, res) => {
    db.query(
        `SELECT id, name, completed, created_at
         FROM goals
         WHERE user_id = ?
         ORDER BY id DESC`,
        [req.user.id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch goals."
                });
            }

            res.json({
                success: true,
                count: results.length,
                goals: results
            });
        }
    );
});

// GET SINGLE GOAL
router.get("/goals/:id", (req, res) => {
    const id = validId(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid goal ID."
        });
    }

    db.query(
        `SELECT id, name, completed, created_at
         FROM goals
         WHERE id = ? AND user_id = ?`,
        [id, req.user.id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch goal."
                });
            }

            if (!results.length) {
                return res.status(404).json({
                    success: false,
                    message: "Goal not found."
                });
            }

            res.json({
                success: true,
                goal: results[0]
            });
        }
    );
});

// ADD GOAL
router.post("/goals", (req, res) => {
    const name = String(req.body.name || "").trim();

    if (name.length < 3 || name.length > 150) {
        return res.status(400).json({
            success: false,
            message: "Goal must contain 3 to 150 characters."
        });
    }

    db.query(
        `INSERT INTO goals (name, user_id)
         VALUES (?, ?)`,
        [name, req.user.id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to add goal."
                });
            }

            res.status(201).json({
                success: true,
                message: "Goal added successfully.",
                goalId: result.insertId
            });
        }
    );
});

// UPDATE GOAL
router.put("/goals/:id", (req, res) => {
    const id = validId(req.params.id);
    const completed = req.body.completed;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid goal ID."
        });
    }

    if (![0, 1, true, false].includes(completed)) {
        return res.status(400).json({
            success: false,
            message: "Completed must be true or false."
        });
    }

    const status = completed === true || completed === 1 ? 1 : 0;

    db.query(
        `UPDATE goals
         SET completed = ?
         WHERE id = ? AND user_id = ?`,
        [status, id, req.user.id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update goal."
                });
            }

            if (!result.affectedRows) {
                return res.status(404).json({
                    success: false,
                    message: "Goal not found."
                });
            }

            res.json({
                success: true,
                message: "Goal updated successfully."
            });
        }
    );
});

// DELETE GOAL
router.delete("/goals/:id", (req, res) => {
    const id = validId(req.params.id);

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Invalid goal ID."
        });
    }

    db.query(
        `DELETE FROM goals
         WHERE id = ? AND user_id = ?`,
        [id, req.user.id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete goal."
                });
            }

            if (!result.affectedRows) {
                return res.status(404).json({
                    success: false,
                    message: "Goal not found."
                });
            }

            res.json({
                success: true,
                message: "Goal deleted successfully."
            });
        }
    );
});

// ==================================================
// HABIT CALENDAR API
// ==================================================

// GET COMPLETION HISTORY FOR A MONTH
router.get("/calendar", (req, res) => {
    const month = String(req.query.month || "");

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        return res.status(400).json({
            success: false,
            message: "Provide month in YYYY-MM format."
        });
    }

    const startDate = `${month}-01`;

    const sql = `
        SELECT
            hc.id,
            hc.habit_id,
            h.name AS habit_name,
            DATE_FORMAT(
                hc.completion_date,
                '%Y-%m-%d'
            ) AS completion_date
        FROM habit_completions hc
        INNER JOIN habits h ON h.id = hc.habit_id
        WHERE h.user_id = ?
          AND hc.completion_date >= ?
          AND hc.completion_date < DATE_ADD(?, INTERVAL 1 MONTH)
        ORDER BY hc.completion_date, h.name
    `;

    db.query(
        sql,
        [req.user.id, startDate, startDate],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch calendar history."
                });
            }

            res.json({
                success: true,
                month,
                count: results.length,
                completions: results
            });
        }
    );
});

// MARK A HABIT COMPLETED ON A SPECIFIC DATE
router.post("/calendar", (req, res) => {
    const habitId = validId(req.body.habitId);
    const date = String(req.body.date || "");

    if (!habitId) {
        return res.status(400).json({
            success: false,
            message: "A valid habitId is required."
        });
    }

    if (!validDate(date)) {
        return res.status(400).json({
            success: false,
            message: "A valid date in YYYY-MM-DD format is required."
        });
    }

    db.query(
        `SELECT id FROM habits
         WHERE id = ? AND user_id = ?`,
        [habitId, req.user.id],
        (error, habits) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to verify habit."
                });
            }

            if (!habits.length) {
                return res.status(404).json({
                    success: false,
                    message: "Habit not found."
                });
            }

            const sql = `
                INSERT INTO habit_completions
                    (habit_id, completion_date, user_id)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE id = id
            `;

            db.query(
                sql,
                [habitId, date, req.user.id],
                (insertError) => {
                    if (insertError) {
                        console.error(insertError);
                        return res.status(500).json({
                            success: false,
                            message: "Failed to save completion."
                        });
                    }

                    res.json({
                        success: true,
                        message: "Habit completion saved.",
                        habitId,
                        date
                    });
                }
            );
        }
    );
});

// UNDO A HABIT COMPLETION FOR A SPECIFIC DATE
router.delete("/calendar/:habitId/:date", (req, res) => {
    const habitId = validId(req.params.habitId);
    const date = String(req.params.date || "");

    if (!habitId) {
        return res.status(400).json({
            success: false,
            message: "Invalid habit ID."
        });
    }

    if (!validDate(date)) {
        return res.status(400).json({
            success: false,
            message: "Invalid calendar date."
        });
    }

    db.query(
        `DELETE hc
         FROM habit_completions hc
         INNER JOIN habits h ON h.id = hc.habit_id
         WHERE hc.habit_id = ?
           AND hc.completion_date = ?
           AND h.user_id = ?`,
        [habitId, date, req.user.id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to undo completion."
                });
            }

            res.json({
                success: true,
                message: result.affectedRows
                    ? "Completion removed."
                    : "No completion was recorded for this date.",
                habitId,
                date
            });
        }
    );
});

module.exports = router;