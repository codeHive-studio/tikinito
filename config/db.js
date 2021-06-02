const { createPool } = require("mysql");

var pool = createPool({
  host: "localhost",
  port: "3306",
  user: "j126922gil_tikinito",
  password: "T%k60e2e",
  database: "j126922gil_tikinito",
  connectionLimit: 200000,
  multipleStatements: true,
});

module.exports = pool;
