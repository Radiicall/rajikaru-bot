const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { contentcheck, guildTables } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans the pinged member')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for banning')),
        // Builds slash command
	async execute(interaction) {
        if (!interaction.guild) {
            const banemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: `This command only works in Guilds!` });
            return interaction.reply({ embeds: [banemb], ephemeral: true });
        }
        const member = interaction.options.getMember('member');
        const brole = interaction.guild.me.roles.highest;
        const usrole = interaction.member.roles.highest;
        const memrole = member.roles.highest;
        const guildTableName = String(interaction.guild.id + '-guild');
		const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let reason = interaction.options.getString('reason');
		let modrole = null;
        let manrole = null;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }
        if (!reason) {
            reason = 'No reason provided';
        }
        if (interaction.member == member) {
            const banemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: `Please ping someone else to ban!` });
            return interaction.reply({ embeds: [banemb], ephemeral: true });
        } else if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			if (!contentcheck(interaction.member._roles, [manrole, modrole])) {
                const banemb = new MessageEmbed()
                    .setColor("#CC0000")
                    .setAuthor({ name: `You are missing the required permissions!` });
                return interaction.reply({ embeds: [banemb], ephemeral: true });
			}
        } else if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
            const banemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: `Cannot ban someone with the same or higher rank than you` })
                .setDescription('||Unless you have set a modrole with /settings modrole||');
            return interaction.reply({ embeds: [banemb], ephemeral: true });
        }
        if (interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            if (brole.comparePositionTo(memrole) <= memrole.comparePositionTo(brole)) {
                const banemb = new MessageEmbed()
                    .setColor("#CC0000")
                    .setAuthor({ name: `This member's highest role is higher than my highest role` });
                return interaction.reply({ embeds: [banemb], ephemeral: true });
            } else {
                member.send(`You have been banned from ${interaction.guild.name} for "${reason}"`);
                await interaction.reply(`${member.user} has been banned for "${reason}"`);
                member.ban({ days: 0, reason: reason });
            }
        } else {
            const banemb = new MessageEmbed()
                .setColor("#CC0000")
                .setAuthor({ name: `I am missing the Ban Members permission` });
            return interaction.reply({ embeds: [banemb], ephemeral: true });
        }
	},
};
