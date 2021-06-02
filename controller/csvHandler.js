module.exports = function InsertCsv(csvData, matches, conn, res) {
  console.log(csvData);
  var i, k;
  for (i = 0; i < csvData.length; ) {
    var csvValue = values(csvData[i], matches);
    var modelvalues = csvValue.slice(0, 2);
    modelvalues[0] = `" ${modelvalues[0]} "`;
    var featureVal = csvValue.slice(2);
    executequery(conn, modelvalues, matches, featureVal)
      .then((cb) => {
        res.status(cb).send("okk");
      })
      .catch((e) => {
        res.status(e).send();
      });
    i++;
  }
};

function values(csvData, matches) {
  var csvValue = new Array();
  for (k = 0; k < matches.length; k++) csvValue.push(`,${csvData[matches[k]]}`);
  return csvValue;
}

function executequery(conn, modelvalues, matches, featureVal) {
  return new Promise((resolve, reject) => {
    conn.query(
      `insert into model (model_name,price,device_id) values(${modelvalues},1)`,
      (err, result) => {
        if (!err) {
          var featureQuery = `insert into feature_spec (model_id,${matches.slice(
            2
          )}) values(${result.insertId}${featureVal})`;
          console.log(featureQuery);

          conn.query(featureQuery, (err, data) => {
            if (!err) {
              resolve(200);
            } else {
              reject(400);
            }
          });
        }
      }
    );
  });
}
