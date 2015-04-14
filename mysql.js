var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'nicholas',
  password : '54bitfal',
  database : 'GW2_CC'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

module.exports = {
  insert_account: function (accountID, accountName, accountWorld, accountCode) {
    var rowCount;
    connection.query('SELECT * FROM GW2_Accounts WHERE Account_ID=' + connection.escape(accountID), function(err, rows, fields) {
      if (err) throw err;
      rowCount = rows.length;
      if (rowCount > 0) {
        connection.query('UPDATE GW2_Accounts SET Account_Name=' + connection.escape(accountName) + ', Account_World=\'' + connection.escape(accountWorld) + '\', Account_Code=' + connection.escape(accountCode) + ', Account_Updated=CURRENT_TIMESTAMP WHERE Account_ID=' + connection.escape(accountID), function(err, rows, fields) {
          if (err) throw err;
          console.log('row was updated successfully!');
        });
      } else {
        connection.query('INSERT INTO GW2_Accounts VALUES (' + connection.escape(accountID) + ', ' + connection.escape(accountName) + ', \'' + connection.escape(accountWorld) + '\', ' + connection.escape(accountCode) + ', CURRENT_TIMESTAMP)', function(err, rows, fields) {
          if (err) throw err;
          console.log('row was inserted successfully!');
        });
      }
      //console.log('The solution is: ', rows[0].solution);
    });
  },
  check_code: function () {
    // whatever
  }
};