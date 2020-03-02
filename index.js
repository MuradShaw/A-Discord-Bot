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
        else if(message.content.startsWith(`${prefix}shop`))
            getShop(message);
    }
})

const getShop = (message) => {

    var theItems = '';

    for (i in Items.items) {
        theItems = `${theItems}\n **${Items.items[i].name}**, ${Items.items[i].desc}. [${Items.items[i].cost} ${currencyName}]`;
    }

    const shopEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Shop')
            //.setURL(message.author.fetchProfile)
            .setDescription(`Buy a few things`)
            .setThumbnail('https://www.canteach.ca/minecraft-pe/images/chest.gif')
            .addBlankField()
            .addField('+===|SHOP|===+\n !buy [item name]', theItems, true)
            .setTimestamp()
            .setFooter('A Discord Bot', 'https://i.imgur.com/wSTFkRM.png');

	    message.channel.send(shopEmbed);
}

client.login(token);
