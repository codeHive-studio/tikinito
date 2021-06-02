const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const path = require("path");
const _ = require("lodash");
const bodyparser = require("body-parser");
const { fstat } = require("fs");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

router.get("/initial", async (req, res) => {
  try {
    var data;
    // const query = req.query;
    // var size = query.size.split(",");

    const sql = `SELECT * FROM sliderrange; `;

    // console.log(sql);
    pool.getConnection((err, conn) => {
      if (err) {
        return res.send("something went wrong");
      }
      conn.query(sql, (err, result) => {
        conn.release();
        console.log("SUCCESS...!!!"); // console.log(result);
        if (err) {
          console.log(err);
          return res
            .status(404)
            .send({ status: 404, error: "Something went wrong" });
        }

        res.send(result);
      });
      conn.on("error", function (err) {
        conn.release();
        if (err) {
          return res.send("something went wrong");
        }
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500, error: "internal server error" });
  }
});

router.get("/Multiple-filter", async (req, res) => {
  try {
    //console.log(req.query);
    var data;
    const query = req.query;
    var objValue=Object.values(query);
    var a ="";
    var b ="";
    for (let i = 3; i < objValue.length; i++) {
      a += "fs."+objValue[i]+" DESC,";
    
    }
    for (let i = 3; i < objValue.length; i++) {
      b+= "fs."+objValue[i]+",";
    
    }
    console.log(a);
    var size = query.size.split(",");
    const sql = `select m.model_id,m.model_name,m.price,${b}productimg.file_name from model as m join feature_spec as fs 
    on m.model_id = fs.model_id
    left join productimg on m.model_id = productimg.model_id
        where  m.model_id  in
    (select model_id from feature_spec as fs
  where fs.size IN (${query.size}) AND M.PRICE BETWEEN
  ${query.min} AND ${query.max} ) order by ${a.slice(0,-1)}; `;

    // console.log(sql);
    pool.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        return res.send("something went wrong");
      }
      conn.query(sql, (err, result) => {
        conn.release();
        console.log("SUCCESS...!!!");
        // console.log(result);
        if (err) {
          console.log(err);
          return res
            .status(404)
            .send({ status: 404, error: "Something went wrong" });
        }
        // console.log(result);
        const newState = result.map((obj) => {
          if (obj.Size == 1) return { ...obj, Size: "S" };
          else if (obj.Size == 2) return { ...obj, Size: "M" };
          else if (obj.Size == 3) return { ...obj, Size: "L" };
          else if (obj.Size == 4) return { ...obj, Size: "XL" };
        });
        // console.log(newState);
        res.send(newState);
      });
      conn.on("error", function (err) {
        conn.release();
        if (err) {
          return res.send("something went wrong");
        }
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500, error: "internal server error" });
  }
});

router.get("/data", (req, res) => {
  res.sendFile(path.join(__dirname, "../data.html"));
});

module.exports = router;
