const mysql = require("mysql2");


const connection = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "daily_habit_tracker"

});


connection.connect(
    function (error) {

        if (error) {

            console.error(
                "MySQL connection failed:",
                error.message
            );

            return;

        }


        console.log(
            "MySQL database connected successfully."
        );

    }
);


module.exports = connection;