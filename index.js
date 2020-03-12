//Getting things ready
const Discord = require('discord.js');
const Mysql = require('./settings/mysql.js');
const Items = require('./settings/items.json');

const { prefix, currencyName, coin_timeout, token } = require('./settings/config.json');
const client = new Discord.Client();
const talkedRecently = new Set();

//Bot running
client.once('ready', () => {
   // connection = Mysql.getConnection();
    console.log('Ready!');
})

//Message was sent somewhere
client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;

    //Timed out?
    if (!talkedRecently.has(msg.author.id))
    {	    
	//Give coins to the user
    	Mysql.increaseCurrency(message.author.id);
	    
	talkedRecently.add(msg.author.id);
        setTimeout(() => {
          talkedRecently.delete(msg.author.id);
        }, coin_timeout);
    }

    //Someone is trying to run a command
    if(message.content.startsWith(`${prefix}`))
    {
        //!info- Get user info (amount of currency/xp/weapons)
        if(message.content.startsWith(`${prefix}info`))
	{
	    const tagged = message.mentions.users.first();
	    if(tagged == null)
            	Mysql.getCurrency(message.author, message);
	    else 
		Mysql.getCurrency(tagged, message);
	}
        
        //!shop- get shop
        else if(message.content.startsWith(`${prefix}shop`))
            getShop(message);
        
        else if(message.content.startsWith(`${prefix}setCoin`))
        {
            //Get command arg
            var baseCmd = `${prefix}setCoin`;
            var name;
            const baseArg = message.content.slice(baseCmd.length).split(' ');
            var arg = '';

            for(i in baseArg)
                arg = `${arg}${baseArg[i]}`;

            
            Mysql.debugSetCoins(message, arg);            
        }

        else if(message.content.startsWith(`${prefix}equip`))
        {
            //Get command arg
            var baseCmd = `${prefix}equip`;
            var r;
            const baseArg = message.content.slice(baseCmd.length).split(' ');
            var arg = '';

            for(i in baseArg)
                arg = `${arg}${baseArg[i]}`;

            //Join tables
            var daItems = Items.shop.items;
            for(i in daItems)
            {
                if(daItems[i].name.replace(" ", "") == arg)
                {
                    success = true;
                    r = i;

                    break;
                }
            }
            
            if(!success)
                message.channel.send('Item not found.');
            else
                Mysql.equipItem(message, daItems[r].id, daItems[r].image, daItems[r].name);            
        }

        //!buy- buy an item from the shop
        else if(message.content.startsWith(`${prefix}buy`))
        {
            //Get command arg
            var baseCmd = `${prefix}buy`;
            const baseArg = message.content.slice(baseCmd.length).split(' ');
            var arg = '';
            var r;
            var success = false;

            for(i in baseArg)
                arg = `${arg}${baseArg[i]}`;

            //Join tables
            var daItems = Items.shop.items.concat(Items.shop.clothing);
            for(i in daItems)
            {
                if(daItems[i].name.replace(" ", "") == arg)
                {
                    success = true;
                    r = i;

                    break;
                }
            }

            if(!success)
                message.channel.send('Item not found.');
            else
                Mysql.buyItem(message, daItems[r].id, daItems[r].cost, daItems[r].image, daItems[r].name);
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
