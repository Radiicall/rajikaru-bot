const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { contentcheck } = require('../functions');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Says the message you tell it to say.')
        .addStringOption(option => option.setName('message').setDescription('Message to say').setRequired(true)),
	async execute(interaction) {
        const message = interaction.options.getString('message');

		if (contentcheck(message, ['nigger', 'niggër', 'niggêr', 'nigg3r', 'nïgger', 'nïggër', 'nïggêr', 'nïgg3r', 'nîgger', 'nîggër', 'nîggêr', 'nîgg3r', 'n1gger', 'n1ggër', 'n1ggêr', 'n1gg3r'])) {
			await interaction.reply({ content: 'This contains a bad word.', ephemeral: true });
		} else if (interaction.guild == null) {
			await interaction.reply(message);
		} else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			await interaction.reply(message);
		} else {
			const sayemb = new MessageEmbed()
				.setColor("#CC0000")
				.setAuthor({ name: 'You are missing the Manage Server permission.' })
				.setDescription('(Needed to prevent spam and stop bad word usage, etc.)');
			await interaction.reply({ embeds: [sayemb], ephemeral: true });
		}
	},
};
