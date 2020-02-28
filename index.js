//Getting things ready
const Discord = require('discord.js');
const Mysql = require('./mysql.js');
var mysql = require('mysql');

const { prefix, currencyName, token } = require('./config.json');
const client = new Discord.Client();

//Bot running
client.once('ready', () => {
   // connection = Mysql.getConnection();
    console.log('Ready!');
})

//Message was sent somewhere
client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    
    //Give some coins to the user
    Mysql.increaseCurrency(message.author.id);
	
    //Someone is trying to run a command
    if(message.content.startsWith(`${prefix}`))
    {
	//!Coins- Get amount of currency
   	if(message.content.startsWith(`${prefix}info`))
		Mysql.getCurrency(message.author.id, message);
    }
})

client.login(token); //Grab token and run
