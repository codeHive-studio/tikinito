const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const InsertCsv = require("../controller/csvHandler");
pool.setMaxListeners = 100000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/dashboard/AddProduct",
  upload.single("file"),
  (req, res, next) => {
    var fileinfo = req.file.filename;
    console.log(req.body.obj);
    console.log(fileinfo);
    const obj = JSON.parse(req.body.obj);
    const key = Object.keys(obj);
    const value = Object.values(obj);
    key.pop();
    value.pop();

    const modelKey = key.slice(0, 2);
    const modelValue = value.slice(0, 2);
    pool.getConnection(function (err, conn) {
      if (err) {
        return res
          .status(500)
          .send({ status: 500, error: "Something went wrong" });
      }

      let insertQuery = `insert into model (${modelKey},device_id) values ("${modelValue[0]}",${modelValue[1]},1)`;

      conn.query(insertQuery, (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
          return res
            .status(400)
            .send({ status: 400, error: "Data not insert" });
        }

        let insertImage = `insert into productimg (model_id,File_name) values (${result.insertId},"${fileinfo}");`;

        conn.query(insertImage, (err, result) => {
          if (err) {
            console.log(err);
            return res.send({ status: 400, error: "something went wrong" });
          }
          res.status(201);
        });

        let insertData = `insert into feature_spec (model_id,${key.slice(2)}) 

      values(${result.insertId},${value.splice(2)})`;

        conn.query(insertData, (err, result) => {
          if (err) {
            console.log(err);
            return res.send({ status: 400, error: "something went wrong" });
          }
          res.status(201).send({ Message: "Record added successfully" });
          conn.destroy();
        });
      });
    });
  }
);

router.get("/dashboard/DeleteProduct/:id", (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        return res
          .status(500)
          .send({ status: 500, error: "Internal Server Error !!!" });
      }
      const SelectQuery = `select File_name from productimg where model_id=${id};`;
      conn.query(SelectQuery, (err, result) => {
        conn.release();
        if (err) {
          return res.status(404);
        }
        if (result == "") {
          const DeleteQuery = `Delete from model where model_id =${id};delete from feature_spec where model_id = ${id};delete from productimg where model_id = ${id};`;
          conn.query(DeleteQuery, (err, result) => {
            if (err) {
              return res
                .status(404)
                .send({ status: 404, error: "Record Not Found" });
            }
            if (result) {
              // console.log(result);
              res
                .status(200)
                .send({ status: 200, Message: "Deleted successfully" });
              conn.destroy();
            }
          });
        } else {
          fs.unlink(
            path.join(__dirname, "../public/uploads/" + result[0].Image),
            (err) => {
              if (err) res.status(404);
              const DeleteQuery = `Delete from model where model_id =${id};delete from feature_spec where model_id = ${id};delete from productimg where model_id = ${id};`;
              conn.query(DeleteQuery, (err, result) => {
                if (err) {
                  return res
                    .status(404)
                    .send({ status: 404, error: "Record Not Found" });
                }
                if (result) {
                  // console.log(result);
                  res
                    .status(200)
                    .send({ status: 200, Message: "Deleted successfully" });
                  conn.destroy();
                }
              });
            }
          );
        }
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, error: "Something Went Wrong" });
  }
});

router.post(
  "/dashboard/UpdateProduct/:id",
  upload.single("file"),
  (req, res, next) => {
    let { id } = req.params;
    const fileinfo = req.file.filename;

    const DataObj = JSON.parse(req.body.obj);
    const key = Object.keys(DataObj);
    const value = Object.values(DataObj);
    key.pop();
    value.pop();
    key.splice(0, 2);
    value.splice(0, 2);
    var c = "set ";

    for (i = 0; i < 5 && i < key.length; i++) {
      c += `${key[i]} = ${value[i]} `;
      if (i != key.length - 1) c += `,`;
    }
    for (i = 5; i < key.length; i++) {
      if (i != 5) c += `, `;
      c += ` ${key[i]} = "${value[i]}"`;
    }

    // console.log(Updates());
    const { model_name, price } = JSON.parse(req.body.obj);

    try {
      pool.getConnection((err, conn) => {
        conn.release();
        if (err) {
          return res
            .status(500)
            .send({ status: 500, error: "Internal Server Error !!!" });
        }

        const SelectQuery = `select File_name from productImg where model_id=${id};`;

        conn.query(SelectQuery, (err, result) => {
          if (err) console.log(err);
          if (result == "") {
            let UpdateQuery = `Update model set  model_name = "${model_name}" , price = ${price} where model_id = ${id} ;
            update feature_spec  ${c} where model_id = ${id};
            insert into productimg (model_id,File_name) values  (${id},"${fileinfo}"); `;

            conn.query(UpdateQuery, (err, result) => {
              if (err) {
                return res
                  .status(404)
                  .send({ status: 404, error: "Record not found" });
              }

              res
                .status(200)
                .send({ status: 200, Message: "Updated Successfully" });
              conn.destroy();
            });
          } else {
            fs.unlink(
              path.join(__dirname, "../public/uploads/" + result[0].File_name),
              (err) => {
                if (err) console.log(err);
                let UpdateQuery = `Update model set  model_name = "${model_name}" , price = ${price} where model_id = ${id} ;
                update feature_spec  ${c} where model_id = ${id};
            update productimg set File_name = "${fileinfo}" where model_id = ${id}`;

                conn.query(UpdateQuery, (err, result) => {
                  if (err) {
                    return res
                      .status(404)
                      .send({ status: 404, error: "Record not found" });
                  }
                  // console.log(result);
                  res
                    .status(200)
                    .send({ status: 200, Message: "Updated Successfully" });
                  conn.destroy();
                });
              }
            );
          }
        });
      });
    } catch (e) {
      res.status(500).send({ status: 500, error: "Something Went Wrong" });
    }
  }
);

router.get("/dashboard/showAll", (req, res) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        return res
          .status(500)
          .send({ status: 500, error: "Internal Server Error !!!" });
      }
      const selectQuery = `select COLUMN_NAME
              from INFORMATION_SCHEMA.COLUMNS
                  where TABLE_NAME='feature_spec'`;
      conn.query(selectQuery, (err, result) => {
        conn.release();
        if (err) {
          return res
            .status(500)
            .send({ status: 500, error: "Internal server error." });
        }

        const cname = new Array();
        result.forEach((c) => {
          cname.push(c.COLUMN_NAME);
        });
        const features = cname.join(",f.").slice(14);

        const showAll = `select m.model_id,m.model_name,m.price,${features},i.File_name 
              from model as m 
             right outer join feature_spec as f on m.model_id = f.model_id 
              left  join productimg as i on i.model_id = f.model_id order by m.model_id `;
        conn.query(showAll, (err, result) => {
          if (err) {
            return res
              .status(500)
              .send({ status: 500, error: "Internal server error." });
          }
          // console.log(result)
          const newState = result.map((obj) => {
            if (obj.Size == 1) return { ...obj, Size: "S" };
            else if (obj.Size == 2) return { ...obj, Size: "M" };
            else if (obj.Size == 3) return { ...obj, Size: "L" };
            else if (obj.Size == 4) return { ...obj, Size: "XL" };
          });

          res.status(200).send({ status: 200, Message: "OK", data: newState });
          conn.destroy();
        });
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, error: "Something Went Wrong" });
  }
});

router.get("/dashboard/ProductById/:id", (req, res) => {
  const { id } = req.params;

  try {
    pool.getConnection((err, conn) => {
      if (err) {
        return res
          .status(500)
          .send({ status: 500, error: "Internal Server Error" });
      }
      const selectQuery = `select COLUMN_NAME
      from INFORMATION_SCHEMA.COLUMNS
          where TABLE_NAME='feature_spec'`;
      conn.query(selectQuery, (err, result) => {
        conn.release();
        if (err) {
          return res
            .status(500)
            .send({ status: 500, error: "Internal server error." });
        }

        const cname = new Array();
        result.forEach((c) => {
          cname.push(c.COLUMN_NAME);
        });
        const features = cname.join(",f.").slice(14);
        const GetById = `select m.model_id,m.model_name,m.price,${features} from model as m join feature_spec as f on m.model_id = f.model_id
      where m.model_id = ${id}`;
        conn.query(GetById, (err, result) => {
          if (err) {
            return res.status(404).send({ status: 404, error: "Bad Request" });
          }

          res.status(200).send(result);
          conn.destroy();
        });
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, error: "Internal Server Error" });
  }
});

router.post("/dashboard/setSliderRange", (req, res) => {
  const { min, max } = req.body;
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send({ status: 500, error: "SERVER PROBLEM" });
      }
      const setRange = `update sliderrange set min = ${min} , max = ${max} where id = 1`;
      conn.query(setRange, (err, result) => {
        conn.release();
        if (err) {
          return res.status(404).send({ status: 404, error: "Bad Request." });
        }
        res
          .status(200)
          .send({ status: 200, Message: "Slider Range Update Successfully" });
        conn.destroy();
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, error: "Internal Server Error" });
  }
});

// GET Slider range value
router.get("/dashboard/getslidervalue", (req, res) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        return res
          .status(500)
          .send({ status: 500, error: "Internal server error." });
      }

      const Get = `select * from sliderrange where id = 1`;
      conn.query(Get, (err, result) => {
        conn.release();
        if (err) {
          return res.status(404).send({ status: 404, error: "Bad Request." });
        }
        if (!result.length == null) {
          res.status(200).send({ status: 200, data: "Record not available." });
        } else {
          res.status(200).send({ status: 200, data: result });
        }
        conn.destroy();
      });
    });
  } catch (e) {
    res.status(500).send({ status: 500, error: "Internal server error." });
  }
});
router.get("/dashboard/Slider", (req, res) => {
  res.sendFile(path.join(__dirname, "../price.html"));
});

//multer disk storage
const DIR = "./public/uploads";

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = "csv.csv";
    cb(null, fileName);
  },
});

var upload2 = multer({
  storage: storage2,
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      path.extname(file.originalname) === ".csv" ||
      path.extname(file.originalname) === ".text"
    ) {
      cb(null, true);
    } else {
      req.error = "Only csv/text format allowed!";
      cb(null, false, req.error);
      // return cb("Only csv format allowed!");
    }
  },
});

// upload csv file
router.post("/uploadcsv", upload2.single("file"), (req, res, next) => {
  try {
    let csvData = [];
    if (req.error) {
      return res.status(400).send({ Message: req.error });
    }
    fs.createReadStream(path.join(__dirname, "../public/uploads/csv.csv"))
      .pipe(csv())
      .on("data", function (data) {
        csvData.push(data);
      });
    pool.getConnection((err, conn) => {
      if (err) {
        return res
          .status(500)
          .send({
            Message: "Internal Server Error",
          })
          .end();
      }
      const getColumn = `select COLUMN_NAME
          from INFORMATION_SCHEMA.COLUMNS
              where TABLE_NAME='feature_spec'`;
      conn.query(getColumn, (err, result) => {
        conn.release();
        if (result) {
          var cname = new Array();
          result.forEach((c) => {
            cname.push(c.COLUMN_NAME);
          });

          var HeaderValidator = Object.keys(csvData[0]);
          var matches = [];
          matches.push(HeaderValidator[0]);
          matches.push(HeaderValidator[1]);
          for (var i = 0; i < HeaderValidator.length; i++) {
            for (var e = 0; e < cname.length; e++) {
              if (HeaderValidator[i] === cname[e])
                matches.push(HeaderValidator[i]);
            }
          }

          if (matches.length == 0) {
            return res.status(400).send({ Message: "Invalid csv file data." });
          } else {
            InsertCsv(csvData, matches, conn, res);
          }
        }
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500, Message: "Internal Server Error" });
  }
});

module.exports = router;
