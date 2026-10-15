const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must contain 2 to 100 characters."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address."
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must contain 8 to 72 characters."
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "Authentication is not configured."
            });
        }

        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({
                        success: false,
                        message: "Unable to create account."
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "An account with this email already exists."
                    });
                }

                try {
                    const passwordHash = await bcrypt.hash(password, 12);

                    db.query(
                        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                        [name, email, passwordHash],
                        (insertError, result) => {
                            if (insertError) {
                                console.error(insertError);

                                if (insertError.code === "ER_DUP_ENTRY") {
                                    return res.status(409).json({
                                        success: false,
                                        message: "An account with this email already exists."
                                    });
                                }

                                return res.status(500).json({
                                    success: false,
                                    message: "Unable to create account."
                                });
                            }

                            const token = jwt.sign(
                                { id: result.insertId, email },
                                secret,
                                { expiresIn: "2h" }
                            );

                            return res.status(201).json({
                                success: true,
                                message: "Account created successfully.",
                                token,
                                user: {
                                    id: result.insertId,
                                    name,
                                    email
                                }
                            });
                        }
                    );
                } catch (hashError) {
                    console.error(hashError);
                    return res.status(500).json({
                        success: false,
                        message: "Unable to create account."
                    });
                }
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred."
        });
    }
});

// LOGIN
router.post("/login", (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const secret = process.env.JWT_SECRET;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    if (!secret) {
        return res.status(500).json({
            success: false,
            message: "Authentication is not configured."
        });
    }

    db.query(
        "SELECT id, name, email, password_hash FROM users WHERE email = ?",
        [email],
        async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Unable to log in."
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            const user = results[0];

            try {
                const validPassword = await bcrypt.compare(
                    password,
                    user.password_hash
                );

                if (!validPassword) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password."
                    });
                }

                const token = jwt.sign(
                    { id: user.id, email: user.email },
                    secret,
                    { expiresIn: "2h" }
                );

                return res.json({
                    success: true,
                    message: "Login successful.",
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            } catch (compareError) {
                console.error(compareError);
                return res.status(500).json({
                    success: false,
                    message: "Unable to log in."
                });
            }
        }
    );
});

module.exports = router;