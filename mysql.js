//For interacting with a MySql DB

const Discord = require('discord.js');
const Embed = require('textembs.js');
const { Host, User, Password, Database } = require('./settings.json');

//Create connection
var connection = mysql.createConnection({
	host: Host,
	user: User,
	password: Password,
	database: Database
});
  
//Attempt a connection
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

//Get amount of currency
const getCurrency = (did, message) => {
	connection.query(`SELECT * FROM currency WHERE id = '${message.author.id}'`, (err, rows) => {
		if(err) throw err;

		let amount = rows[0].amount;
		message.channel.send(Embed.createInfoEmbed());
	});
}

//Adding more currency to the db
const increaseCurrency = (did) => {

	//Get user from db
	connection.query(`SELECT * FROM currency WHERE id = '${did}'`, (err, rows) => {
		if(err) throw err;
		
		let sql;
		var newAmount = Math.floor(Math.random() * Math.floor(3));
		
		//User doesn't exist in db
		if(rows < 1)
			sql = `INSERT into currency (id, amount) VALUES ('${did}', ${newAmount})`;
		else { //Exists, just update them
			let amount = rows[0].amount;
			sql = `UPDATE currency SET amount = '${amount + newAmount}' WHERE id = '${did}'`;
		}
		
		//Do the thing
		connection.query(sql);
	});
}

exports.increaseCurrency = increaseCurrency;
exports.getCurrency = getCurrency;
