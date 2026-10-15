require("dotenv").config();
const express = require("express");

const cors = require("cors");

const path = require("path");

const pageRoutes = require("./routes/pages");

const apiRoutes = require("./routes/api");

const authRoutes = require("./routes/auth");
const app = express();

const PORT = Number(process.env.PORT || 3000);


// =========================
// CORS
// =========================

app.use(
    cors()
);


// =========================
// JSON REQUEST SUPPORT
// =========================

app.use(
    express.json()
);


// =========================
// STATIC RESOURCES
// =========================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// =========================
// PAGE ROUTES
// =========================

app.use(
    "/",
    pageRoutes
);


// =========================
// REST API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// =========================
// START SERVER
// =========================

const server = app.listen(
    PORT,
    function () {

        console.log(
            `Node.js server running at http://localhost:${PORT}`
        );

    }
);

server.on(
    "error",
    function (error) {

        console.error(
            `Unable to start the server on port ${PORT}:`,
            error.message
        );

        process.exit(1);

    }
);