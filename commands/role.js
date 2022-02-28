const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { errembed } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Adds role to the pinged user.')
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true))
        .addMentionableOption(option => option.setName('role').setDescription('Role to add.').setRequired(true)),
	async execute(interaction) {
        // Assign variables
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        const usrole = interaction.member.roles.highest;
        // Check if interaction is in guild
        if (!interaction.guild) {
            return errembed({ interaction: interaction, author: `This command only works in Guilds!` });
        // Check role positions
        } else if (usrole.comparePositionTo(role) <= role.comparePositionTo(usrole)) {
            return errembed({ interaction: interaction, author: 'This role is equal to or higher than your highest role!' });
        // Check if member has perms
        } else if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            // Check if bot has perms
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                // Add role
                member.roles.add(role);
            } else {
                // Return error if bot has no perms
                return errembed({ interaction: interaction, author: `I am missing the Manage Roles Permission.` });
            }
        } else {
            // Return error if user has no perms
            return errembed({ interaction: interaction, author: `You are missing the Manage Roles Permission.` });
        }
	},
};
