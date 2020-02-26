//For creating and interacting with MySql DB

var mysql = require('mysql');
const { Host, User, Password, Database } = require('./settings.json');

//Create connection
var con = mysql.createConnection({
  host: Host,
  user: User,
  password: Password,
  database: Database
});

//Did we attempt a connection?
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
