const Discord = require('discord.js');
const { currencyName } = require('./config.json');

const createInfoEmbed = (message, amount) => {
	const infoEmbed = new Discord.RichEmbed()
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
		.setFooter('A Discord Bot', 'https://i.imgur.com/wSTFkRM.png');
	
	return infoEmbed;
}

module.exports = createInfoEmbed
