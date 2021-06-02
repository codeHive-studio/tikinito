const { createPool } = require("mysql");

var pool = createPool({
  host: "127.0.0.1",
  user: "j126922gil_tikinito",
  password: "T%k60e2e",
  database: "j126922gil_tikinito",
  connectionLimit: 2000,
  multipleStatements: true,
});

module.exports = pool;
