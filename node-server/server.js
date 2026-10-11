const express = require("express");

const cors = require("cors");

const path = require("path");

const pageRoutes = require("./routes/pages");

const apiRoutes = require("./routes/api");


const app = express();

const PORT = 3000;


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

app.use(
    "/api",
    apiRoutes
);


// =========================
// START SERVER
// =========================

app.listen(
    PORT,
    function () {

        console.log(
            `Node.js server running at http://localhost:${PORT}`
        );

    }
);