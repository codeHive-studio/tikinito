const mysql = require('mysql2');
 
// create the connection to database
const pool = mysql.createPool({
  host: "localhost",
  user: "j126922gil_tikinito",
  password: "T%k60e2e",
  database: "j126922gil_tikinito",
  connectionLimit: 200000,
  multipleStatements: true,
});
 
// // create the connection to database
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root3",
//   password: "manolo123!@#",
//   database: "devicefilter_db",
//   connectionLimit: 200000,
//   multipleStatements: true,
// });

module.exports = pool;