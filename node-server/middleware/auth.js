const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please log in first."
        });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        console.error("JWT_SECRET is not configured.");

        return res.status(500).json({
            success: false,
            message: "Authentication is not configured."
        });
    }

    jwt.verify(token, secret, (error, user) => {
        if (error) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired login session."
            });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;