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

    //Someone is trying to run a command
    if(message.content.startsWith(`${prefix}`))
    {
        //Authorize command
        if(message.content.startsWith(`${prefix}authorize`))
            if(!Mysql.prepareAuthentication()) //Query didn't fail
                message.author.send("Authentication Test Sent!");
    }
})

client.login(token); //Grab token and run
