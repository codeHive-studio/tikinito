const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const path = require("path");
const _ = require("lodash");
const bodyparser = require("body-parser");
pool.setMaxListeners = 1000000000;
router.get("/SingleProduct/", (req, res) => {
  res.sendFile(path.join(__dirname, "../singleProduct.html"));
});

router.get("/Singleproduct/:id", (req, res) => {
  // console.log(req.params);
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        return res.status(404).send({ Message: "Something Went Wrong" });
      }
      const selectQuery = `select COLUMN_NAME
      from INFORMATION_SCHEMA.COLUMNS
          where TABLE_NAME='feature_spec'`;
      conn.query(selectQuery, (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({ status: 500, error: "Internal server error." });
        }

        const cname = new Array();
        result.forEach((c) => {
          cname.push(c.COLUMN_NAME);
        });
        const features = cname.join(",f.").slice(14);
      const getQuery = `select m.model_id,m.model_name,m.price,${features},productimg.file_name from model as m join feature_spec as f on m.model_id = f.model_id 
      left join productimg on m.model_id = productimg.model_id
      where m.model_id = ${req.params.id}`;
      conn.query(getQuery, (err, result) => {
        conn.release();
        // console.log(result);
        if (result.length === null || result.length === undefined) {
          return res
            .status(400)
            .send("Selected Product Not Show Please Try Another Product.");
        }
        res.status(200).send(result);
      });
    });
  });
  } catch (e) {
    res.status(500).send({ status: 500, Message: "internal server error." });
  }
});

module.exports = router;
