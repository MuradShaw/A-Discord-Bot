//For interacting with a MySql DB

var mysql = require('mysql');
var index = require('./index.js')
const { Host, User, Password, Database, currMin, currMax} = require('./settings.json');

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

//Return this to index
function getConnection()
{
	return con;
}

module.exports = {
  addConnection
};
