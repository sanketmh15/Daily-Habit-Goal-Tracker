const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ==================================================
// HABITS API
// ==================================================

// GET ALL HABITS
router.get("/habits", (req, res) => {
    const sql = `
        SELECT id, name, description, completed, created_at
        FROM habits
        ORDER BY id DESC
    `;

    db.query(sql, (error, results) => {
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
    });
});

// GET SINGLE HABIT
router.get("/habits/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid habit ID."
        });
    }

    db.query(
        `SELECT id, name, description, completed, created_at
         FROM habits WHERE id = ?`,
        [id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch habit."
                });
            }

            if (results.length === 0) {
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

// ADD NEW HABIT
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
        "INSERT INTO habits (name, description) VALUES (?, ?)",
        [name, description],
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

// UPDATE HABIT COMPLETION STATUS
router.put("/habits/:id", (req, res) => {
    const id = Number(req.params.id);
    const completed = req.body.completed;

    if (!Number.isInteger(id) || id < 1) {
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
        "UPDATE habits SET completed = ? WHERE id = ?",
        [status, id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update habit."
                });
            }

            if (result.affectedRows === 0) {
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
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid habit ID."
        });
    }

    db.query(
        "DELETE FROM habits WHERE id = ?",
        [id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete habit."
                });
            }

            if (result.affectedRows === 0) {
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
         FROM goals ORDER BY id DESC`,
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
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid goal ID."
        });
    }

    db.query(
        `SELECT id, name, completed, created_at
         FROM goals WHERE id = ?`,
        [id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch goal."
                });
            }

            if (results.length === 0) {
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

// ADD NEW GOAL
router.post("/goals", (req, res) => {
    const name = String(req.body.name || "").trim();

    if (name.length < 3 || name.length > 150) {
        return res.status(400).json({
            success: false,
            message: "Goal must contain 3 to 150 characters."
        });
    }

    db.query(
        "INSERT INTO goals (name) VALUES (?)",
        [name],
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
    const id = Number(req.params.id);
    const completed = req.body.completed;

    if (!Number.isInteger(id) || id < 1) {
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
        "UPDATE goals SET completed = ? WHERE id = ?",
        [status, id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update goal."
                });
            }

            if (result.affectedRows === 0) {
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
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid goal ID."
        });
    }

    db.query(
        "DELETE FROM goals WHERE id = ?",
        [id],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete goal."
                });
            }

            if (result.affectedRows === 0) {
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
// Example: GET /api/calendar?month=2026-10

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
            DATE_FORMAT(hc.completion_date, '%Y-%m-%d') AS completion_date
        FROM habit_completions hc
        INNER JOIN habits h ON h.id = hc.habit_id
        WHERE hc.completion_date >= ?
          AND hc.completion_date < DATE_ADD(?, INTERVAL 1 MONTH)
        ORDER BY hc.completion_date, h.name
    `;

    db.query(sql, [startDate, startDate], (error, results) => {
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
    });
});

// MARK A HABIT COMPLETED ON A SPECIFIC DATE
// POST /api/calendar
// Body: { "habitId": 1, "date": "2026-10-15" }

router.post("/calendar", (req, res) => {
    const habitId = Number(req.body.habitId);
    const date = String(req.body.date || "");

    if (!Number.isInteger(habitId) || habitId < 1) {
        return res.status(400).json({
            success: false,
            message: "A valid habitId is required."
        });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
            success: false,
            message: "Date must use YYYY-MM-DD format."
        });
    }

    const parsedDate = new Date(`${date}T00:00:00Z`);

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid calendar date."
        });
    }

    db.query(
        "SELECT id FROM habits WHERE id = ?",
        [habitId],
        (error, habits) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to verify habit."
                });
            }

            if (habits.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Habit not found."
                });
            }

            const sql = `
                INSERT INTO habit_completions (habit_id, completion_date)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE id = id
            `;

            db.query(sql, [habitId, date], (insertError, result) => {
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
            });
        }
    );
});

// UNDO A HABIT COMPLETION FOR A SPECIFIC DATE
// DELETE /api/calendar/:habitId/:date

router.delete("/calendar/:habitId/:date", (req, res) => {
    const habitId = Number(req.params.habitId);
    const date = String(req.params.date || "");

    if (!Number.isInteger(habitId) || habitId < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid habit ID."
        });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
            success: false,
            message: "Date must use YYYY-MM-DD format."
        });
    }

    const parsedDate = new Date(`${date}T00:00:00Z`);

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== date
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid calendar date."
        });
    }

    db.query(
        `DELETE FROM habit_completions
         WHERE habit_id = ? AND completion_date = ?`,
        [habitId, date],
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