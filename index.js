//Getting things ready
const Discord = require('discord.js');
const Mysql = require('./mysql.js');
const Items = require('./settings/items.json');

const { prefix, currencyName, coin_cooldown, token } = require('./settings/config.json');
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

    //Give some coins to the user
    if (!talkedRecently.has(message.author.id))
    {
        Mysql.increaseCurrency(message.author.id);

        talkedRecently.add(message.author.id);

        setTimeout(() => {
          talkedRecently.delete(message.author.id);
        }, coin_cooldown);
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
            var clothing = false;
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
            {
                daItems = Items.shop.clothing;
                for(i in daItems)
                {
                    if(daItems[i].name.replace(" ", "") == arg)
                    {
                        success = true;
                        clothing = true;
                        r = i;

                        break;
                    }
                }
            }

            if(!success)
                message.channel.send('Item not found.');
            else
                Mysql.equipItem(message, daItems[r].id, daItems[r].image, daItems[r].name, clothing);            
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

        else if(message.content.startsWith(`${prefix}help`))
        {
            const shopEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Help')
                //.setURL(message.author.fetchProfile)
                .setDescription(`Commands`)
                .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/4/44/Question_mark_%28black_on_white%29.png')
                .addBlankField()
                .addField('!info (@user)', 'Pulls user info')
                .addField('!shop', 'Brings up shop menu')
                .addField('!buy (item name)', 'Buy an item you see in the shop')
                .addField('!equip (item name)', 'Equip weapon/clothing')
                .addField('!help', 'Shows all command- wait')
                .setTimestamp()
                .setFooter('A Discord Bot', 'https://i.imgur.com/wSTFkRM.png');

	        message.channel.send(shopEmbed);
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
