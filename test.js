let DBCONNECTION = require('./dbconnection.js');

//------------------------------------

let host = 'localhost';
let user = 'root';
let password = 'KUMACHAN8*';

let myConnection = DBCONNECTION.Create(host, user, password);

myConnection.Isconnected().then(success => {
  console.log(`\nConnected!`);

  let sql = 'select * from users';
  myConnection.RowReturningQuery(sql).then(rowsResult => {
    console.log(`RESULTS (${rowsResult.rows.length})\n`);

    rowsResult.rows.forEach((row, i) => console.log(`ROW ${i}: ${JSON.stringify(row)}`));

  }).catch(error => {
    console.log(`ERROR: ${error}`);
  });
}).catch(error => {
  console.log(`ERROR: ${error}`);
});