//Getting things ready
const Discord = require('discord.js');
const Mysql = require('./mysql.js');
const { prefix, currencyName, token } = require('./config.json');
const client = new Discord.Client();

//Sql connection
var connection;

//Bot running
client.once('ready', () => {
    connection = Mysql.getConnection();
    console.log('Ready!');
})

//Message was sent somewhere
client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    
    //Give some coins to the user
    increaseCurrency(message.author.id);
	
    //Someone is trying to run a command
    if(message.content.startsWith(`${prefix}`))
    {
	 //!coins
   	 if(message.content.startsWith(`${prefix}${currencyName}`))
		 getCurrency(message.author.id);
    }
})

//Adding more currency to the db
function increaseCurrency(var did)
{
	//Get user from db
	connection.query(`SELECT * FROM currency WHERE id = '$[did]'`, (err, rows) => {
		if(err) throw err;
		
		let sql;
		var newAmount = Math.Floor(Math.Random() * (3 - 1 + 1)) + 1;
		
		//User doesn't exist in db
		if(rows < 1)
			sql = `INSERT into currency (did, amount) VALUES = ('${did}', ${newAmount})`;
		else { //Exists, just update them
			let amount = rows[0].amount;
			sql = `UPDATE currency SET amount = ${amount + newAmount} WHERE id = '${did}'`;
		}
		
		//Do the thing
		connection.query(sql);
	});
}

//Get our current currency
function getCurrency(var did)
{
	connection.query(`SELECT * FROM currency WHERE did = '${did}'`, (err, rows) => {
		if(err) throw err;
		
		let amount = rows[0].amount;
		message.channel.send(amount);
	});
}

client.login(token); //Grab token and run
