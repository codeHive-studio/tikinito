const { createPool } = require("mysql");

// var pool = createPool({
//   host: "103.195.4.8",
//   user: "devicefilter",
//   password: "esh@len$1",
//   database: "devicefilter_db",
//   connectionLimit: 200000,
//   multipleStatements: true,
// });

var pool = createPool({
  host: "127.0.0.1",
  user: "root",
  password: "manolo123!@#",
  database: "devicefilter_db",
  connectionLimit: 200,
  multipleStatements: true,
});

module.exports = pool;
