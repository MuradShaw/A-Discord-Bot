//For creating and interacting with MySql DB

var mysql = require('mysql');
var index = require('./index.js')
const { Host, User, Password, Database } = require('./settings.json');

//Create connection
var con = mysql.createConnection({
  host: Host,
  user: User,
  password: Password,
  database: Database
});

//Attempt a connection
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//Start authentication
function prepareAuthentication(var discordID)
{
  var authCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); //Generate code
  var sql = "INSERT into adb_auth (did, code) VALUES ?"; //Sql command
  var data = [discordID, authCode]; //Sql param
  
  var errored = false;
  
  //Do the query
  con.query(sql, [data], function (err, result) {
    errored = err;
  });
  
  return new Promise(function(resolve, reject) {
          resolve(errored); //Make sure nothing goes wrong and ruins the dinner
  });
}

module.exports = {
  prepareAuthentication
};
