const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription(`Kicks the pinged member.`)
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kicking')),
	async execute(interaction) {
        const member = interaction.options.getMember('member');
        let reason = interaction.options.getString('reason');
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;

        if (!reason) {
            reason = 'No reason provided';
        }

        if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
            interaction.reply('Cannot kick someone with the same or higher rank as you.');
            return;
        } else if (interaction.user == member) {
            interaction.reply('Please ping someone else to kick.');
        } else if (interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            interaction.reply(`${member.user} has been kicked for "${reason}"`);
            member.kick(reason);
        }
	},
};
