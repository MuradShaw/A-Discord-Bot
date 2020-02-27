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

//Adding currency
function addCurrency(var did)
{
	//Calculate amount
	int newAmount = Math.floor(Math.random() * (currMin - currMax + 1)) - currMin;
	
	//Find user
	con.query(`SELECT * FROM currency WHERE did = '${did}'`, (err, rows) => {
		if(err) throw err;
		
		let sql;
		
		//User not in the database?
		if(rows.length < 1)
			sql = `INSERT into currency (id, amount) VALUES ('${did}', ${newAmount})`
		else {
			let amount = rows[0].amount;
			sql = `UPDATE currency SET amount = ${amount + newAmount} WHERE did = '${did}'`
		}
		
		//Do it
		con.query(sql);
	});
}

//Get currency amount
function getCurrency(var did)
{
	//Find user
	con.query(`SELECT * FROM currency WHERE did = '${did}'`, (err, rows) => {
		if(err) throw err;
		
		let amount = rows[0].amount;
		message.channel.send(amount);
	});
}

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
  prepareAuthentication,
  addCurrency
};
