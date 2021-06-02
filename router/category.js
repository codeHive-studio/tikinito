const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const path = require("path");
const _ = require("lodash");
const bodyparser = require("body-parser");

router.get("/allCategory", (req, res) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ Message: "Internal Server Error" });
      }

      const getall = "select cname from category";
      conn.query(getall, (err, result) => {
        conn.release();
        if (err) {
          return res.status(404).send({ Message: "Not Found." });
        }
        res.status(200).send({ status: 200, Message: "OK", data: result });
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, Message: "Something went wrong" });
  }
});

module.exports = router;
