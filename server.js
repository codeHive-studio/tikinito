const express = require("express");
const app = express();
const path = require("path");
const Port = process.env.Port || 3000;
require("./config/db");
const router = require("./router/router");
const category = require("./router/category");
const SingleProduct = require("./router/singlePro");
app.use(express.static(path.join(__dirname + "/public/")));
app.use("/", router);
app.use("/", category);
app.use("/", SingleProduct);

app.listen(Port, () => {
  console.log(`server is runing ${Port}`);
});
