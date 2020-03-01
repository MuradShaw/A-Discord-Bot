//Getting things ready
const Discord = require('discord.js');
const Mysql = require('./mysql.js');
const Items = require('./items.json');

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
        //!info- Get user info (amount of currency/xp/weapons)
        if(message.content.startsWith(`${prefix}info`))
            Mysql.getCurrency(message.author.id, message);
        
        //!shop- get shop
        else if(message.content.startsWith(`${prefix}info`))
            getShop();
    }
})

const getShop = () => {

    const shopEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(message.author.username)
            //.setURL(message.author.fetchProfile)
            .setDescription(`*Currently ${message.author.presence.status}*`)
            .setThumbnail(message.author.avatarURL)
            .addBlankField()
            .addField(currencyName, amount, true)
            .addField('EXP', '7', true)
            //.addBlankField()
            .addField('Equipped Weapon', (rows[0].equipped_weapon == null ? 'No equipped weapon' : sword))
            //.setImage()
            .setTimestamp()
            .setFooter('A Discord Bot', 'https://i.imgur.com/wSTFkRM.png');

		message.channel.send(shopEmbed);
}

client.login(token); //Grab token and run
