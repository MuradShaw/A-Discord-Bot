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

        //!buy- buy an item from the shop
        else if(message.content.startsWith(`${prefix}buy`))
        {
            //Get command arg
            const baseArg = message.content.slice(prefix.length).split(' ');
            var arg = '';
            var foundID;
	    var info;
            var success = false;

            for(i in args)
                arg = `${arg}${baseArg[i]}`;

            for(i in Items.shop.items)
            {
                if(Items.shop.items[i].name == arg)
                {
                    foundID = Items.shop.items[i].id;
                    success = true;
                }
            }
	    
	    if(!success)
		    message.channel.send('Item not found.');
	    else
	    {
	   	 Mysql.buyItem(message.author.id, message);
		    
	         const buyEmbed = new Discord.RichEmbed()
		    .setColor('#D4AF37')
		    .setTitle('Transaction Complete')
		    //.setURL(message.author.fetchProfile)
		    .setDescription(`${message.author.username} purchased **${arg}**`)
		    .setThumbnail(`${image}`)
		    .addBlankField()
		    .addField('Info', '!buy [item name]')
		    .setTimestamp()
		    .setFooter('A Discord Bot', 'https://i.imgur.com/wSTFkRM.png');
		    
		 message.channel.send(buyEmbed);  
	    }
        }
    }
})

const getShop = (message) => {

    var theItems = '';
    var theClothing = '';

    for (i in Items.shop.items) 
    {   theItems = `${theItems}\n **${Items.shop.items[i].name}** | ${Items.shop.items[i].desc}. [${Items.shop.items[i].cost} ${currencyName}]`; }
    for (g in Items.shop.clothing) 
    {   theClothing = `${theClothing}\n **${Items.shop.clothing[g].name}** | ${Items.shop.clothing[g].desc}. [${Items.shop.clothing[g].cost} ${currencyName}]`; }

    console.log(`${Items.clothing}`);

    const shopEmbed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Shop')
            //.setURL(message.author.fetchProfile)
            .setDescription(`Buy a few things`)
            .setThumbnail('https://www.canteach.ca/minecraft-pe/images/chest.gif')
            .addBlankField()
            .addField('Commands', '!buy [item name]')
            .addField('Weaponry', theItems, true)
            .addField('Clothing', theClothing, true)
            .setTimestamp()
            .setFooter('A Discord Bot', 'https://i.imgur.com/wSTFkRM.png');

	message.channel.send(shopEmbed);
}

client.login(token);
