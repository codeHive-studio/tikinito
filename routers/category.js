const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const path = require("path");

router.get("/dashboard/category", function (req, res) {
  res.sendFile(path.join(__dirname, "../category.html"));
});

router.post("/dashboard/category/addCategory", function (req, res) {
  const { cname } = req.body;
  try {
    pool.getConnection(function (err, conn) {
      if (err) {
        return res.status(500).send({ Message: "Internal server error." });
      }
      const alter = `ALTER TABLE feature_spec ADD ${cname} VARCHAR(255) NOT NULL DEFAULT '-';insert into category (cname) values ("${cname}")`;
      conn.query(alter, function (err, result) {
        conn.release();
        if (err) {
          console.log(err);
          if (err.errno === 1062 || err.errno === 1060) {
            console.log("enter if");
            return res
              .status(400)
              .send({ Message: "Duplicate entry please try another." });
          }
          return res
            .status(500)
            .send({ status: 500, Message: "Internal server error" });
        }
        res
          .status(200)
          .send({ status: 200, Message: "Category added successfully." });
        conn.destroy();
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, Message: "Something Went Wrong." });
  }
});

router.get("/dashboard/Category/showCategory", function (req, res) {
  try {
    pool.getConnection(function (err, conn) {
      if (err) {
        return res.status(500).send({ Message: "Internal server error." });
      }
      const showcol = `SHOW COLUMNS FROM feature_spec`;
      const addCatQuery = `select * from  category`;
      conn.query(addCatQuery, function (err, result) {
        // console.log(result);
        console.log(err);
        if (err) {
          return res.status(404).send({ status: 404, Message: "Not Found" });
        }
        res.status(200).send({ data: result });
        conn.destroy();
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500, Message: "Something Went Wrong." });
  }
});

router.get("/dashboard/Category/deletebyID/:id", function (req, res) {
  try {
    const { id } = req.params;
    pool.getConnection(function (err, conn) {
      if (err) {
        return res.status(500).send({ Message: "Internal server error." });
      }
      const selectQuery = `select cname from category where id=${id}`;
      conn.query(selectQuery, function (err, result) {
        // conn.release();
        if (err) {
          return res
            .status(500)
            .send({ status: 500, Message: "Internal server error" });
        }

        const cname1 = result[0].cname;
        const DeleteCatQuery = `delete from category where id = ${id};Alter table feature_spec drop column ${cname1};`;
        conn.query(DeleteCatQuery, function (err, result) {
          // conn.release();
          if (err) {
            return res
              .status(500)
              .send({ status: 500, Message: "Internal server error." });
          }
          res.status(200).send({ Message: "Deleted Successfully." });
          conn.destroy();
        });
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, Message: "Something Went Wrong." });
  }
});

router.post("/dashboard/category/update", function (req, res) {
  // console.log(req.body);
  const { cname, id } = req.body;
  try {
    pool.getConnection(function (err, conn) {
      if (err) {
        return res.status(500).send({ Message: "Internal server error." });
      }
      const selectQuery = `select cname from category where id=${id}`;
      conn.query(selectQuery, function (err, result) {
        // conn.release();
        if (err) {
          return res.status(404).send({ status: 404, Message: "Not Found" });
        }
        const cname1 = result[0].cname;
        const updateCatQuery = `update category set cname = "${cname}" where id = ${id};ALTER TABLE feature_spec RENAME COLUMN ${cname1} TO ${cname};`;
        conn.query(updateCatQuery, function (err, result) {
          conn.release();
          if (err) {
            console.log(err);
            if (err.errno === 1062) {
              return res
                .status(400)
                .send({ status: 400, Message: "Data already exist." });
            }
            return res
              .status(500)
              .send({ status: 500, Message: "Internal server error" });
          }
          res
            .status(200)
            .send({ status: 200, Message: "Category added successfully." });
          conn.destroy();
        });
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, Message: "Something Went Wrong." });
  }
});

module.exports = router;
