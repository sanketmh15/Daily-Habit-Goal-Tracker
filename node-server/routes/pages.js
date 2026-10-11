const express = require("express");

const path = require("path");


const router = express.Router();


// =========================
// HOME ROUTE
// =========================

router.get(
    "/",
    function (req, res) {

        res.sendFile(
            path.join(
                __dirname,
                "../public/index.html"
            )
        );

    }
);


// =========================
// ABOUT ROUTE
// =========================

router.get(
    "/about",
    function (req, res) {

        res.sendFile(
            path.join(
                __dirname,
                "../public/about.html"
            )
        );

    }
);


// =========================
// HABITS ROUTE
// =========================

router.get(
    "/habits",
    function (req, res) {

        res.sendFile(
            path.join(
                __dirname,
                "../public/habits.html"
            )
        );

    }
);


module.exports = router;