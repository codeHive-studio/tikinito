const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.post("/login", function (request, response) {
  var email = request.body.email;
  var password = request.body.password;
  if (email && password) {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        return response
          .status(500)
          .send({ status: 500, error: "Internal Server Error" });
      }
      // check if user exists

      conn.query(
        "SELECT * FROM user WHERE email = ? AND password = ?",
        [email, password],
        function (error, results, fields) {
          conn.release();
          if (results.length > 0) {
            request.session.loggedin = true;
            request.session.email = email;
            response.send({ redirect: "/admin" });
            conn.destroy();
          } else {
            return response.status(404).send({
              status: 404,
              error: "Incorrect Username and/or Password!",
            });
          }
        }
      );
    });
  } else {
    return response.send({
      status: 400,
      error: "Please enter Username and Password!",
    });
  }
});

module.exports = router;
