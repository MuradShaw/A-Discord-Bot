//Getting things ready
const Discord = require('discord.js');
const Mysql = require('./mysql.js');
var mysql = require('mysql');

const { Host, User, Password, Database } = require('./settings.json');
const { prefix, currencyName, token } = require('./config.json');
const client = new Discord.Client();

//Bot running
client.once('ready', () => {
   // connection = Mysql.getConnection();
    console.log('Ready!');
})

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

//Message was sent somewhere
client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    
    //Give some coins to the user
    increaseCurrency(message.author.id);
	
    //Someone is trying to run a command
    if(message.content.startsWith(`${prefix}`))
    {
	    //!Coins- Get amount of currency
   		if(message.content.startsWith(`${prefix}info`))
		{
			connection.query(`SELECT * FROM currency WHERE id = '${message.author.id}'`, (err, rows) => {
				if(err) throw err;
				
				let amount = rows[0].amount;

				const exampleEmbed = new Discord.RichEmbed()
					.setColor('#0099ff')
					.setTitle(message.author.username)
					//.setURL(message.author.fetchProfile)
					//.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
					.setDescription(message.author.tag)
					.setThumbnail(message.author.avatarURL)
					.addBlankField()
					.addField(currencyName, amount, true)
					.addField('EXP', '7', true)
					.addField('Equipped Weapon', 'Toast Sword', true)
					.setImage(message.author.avatarURL)
					.setTimestamp()
					.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

				message.channel.send(exampleEmbed);
			});
		}
    }
})

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

client.login(token); //Grab token and run
