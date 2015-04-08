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
    connection.query('INSERT INTO GW2_Accounts VALUES (' + connection.escape(accountID) + ', ' + connection.escape(accountName) + ', ' + connection.escape(accountWorld) + ', ' + connection.escape(accountCode) + ')', function(err, rows, fields) {
      if (err) throw err;
      //console.log('The solution is: ', rows[0].solution);
    });
  },
  check_code: function () {
    // whatever
  }
};