const { createPool } = require("mysql");

var pool = createPool({
  host: "127.0.0.1",
  user: "root",
  password: "manolo123!@#",
  database: "devicefilter_db",
  connectionLimit: 1000,
  multipleStatements: true,
});

pool.setMaxListeners = 1000;
pool.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});
module.exports = pool;
