//Getting things ready
const Discord = require('discord.js');
const Mysql = require('./mysql.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

//Bot running
client.once('ready', () => {
    console.log('Ready!')
})

//Message was sent somewhere
client.on('message', message => {
	if(message.author.bot) return;
	if(message.channel.type == "dm") return;
	
	Mysql.addCurrency();
	
    //Someone is trying to run a command
    if(message.content.startsWith(`${prefix}`))
    {}
})

client.login(token); //Grab token and run
