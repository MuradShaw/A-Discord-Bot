//For interacting with a MySql DB

const Discord = require('discord.js');
var mysql = require('mysql');
const { Host, User, Password, Database } = require('./settings.json');
const { currencyName } = require('./config.json');
const Items = require('./items.json');

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
        let sword = rows[0].equipped_weapon;

        const infoEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(message.author.username)
            //.setURL(message.author.fetchProfile)
            .setDescription(`*Currently ${message.author.presence.status}*`)
            .setThumbnail(message.author.avatarURL)
            .addBlankField()
            .addField(currencyName, amount, true)
            .addField('EXP', '7', true)
            //.addBlankField()
            .addField('Equipped Weapon', sword)
            .setImage('https://p7.hiclipart.com/preview/375/528/997/thinkgeek-minecraft-next-generation-diamond-sword-thinkgeek-minecraft-foam-sword-others.jpg')
            .setTimestamp()
            .setFooter('A Discord Bot', 'https://i.imgur.com/wSTFkRM.png');

		message.channel.send(infoEmbed);
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